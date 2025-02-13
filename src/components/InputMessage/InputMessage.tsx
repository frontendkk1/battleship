// @ts-nocheck
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable indent */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable @typescript-eslint/ban-types */
import cn from 'classnames';
import {
    ChangeEvent,
    FormEvent,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Button } from 'src/components/Button';
import { useLocation, useParams } from 'react-router-dom';
import { useHttp } from 'src/hooks/http.hook';
import { File, FileInput } from 'src/pages/UpdateProfilePage/components/types';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import { VideoCallService } from 'src/store/services/videoCallService';
import styles from './InputMessage.scss';
import { Icon } from '../Icon/Icon';
import { InputMessageType } from './types';
import { Emoji } from '../Emoji';
import { AuthContext } from '../utils/Context/AuthContext';
import { Dropdown } from '../Dropdown/Dropdown';
import { CallPeer, CancelCall } from '../VideoChat/utils';

export const InputMessage = ({ callback }: InputMessageType) => {
    const [isActive, setIsActive] = useState(false);
    const { pathname } = useLocation();
    const { room } = useParams() as { room: string };
    const [message, setMessage] = useState('');
    const [openEmoji, setOpenEmoji] = useState(false);
    const [caretPosition, setCaretPosition] = useState(0);
    const [userInRoom, setUserInRoom] = useState() as unknown as User;
    const { type, comment, topic } = useSelector(
        (messageState: AllStateTypes) => messageState.message,
    );
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const { status } = useSelector((state: AllStateTypes) => state.videocall);
    const fileInput = useRef<FileInput>(null);
    const { token, socket } = useContext(AuthContext);
    const { request, loading } = useHttp();
    const id = () => {
        switch (type) {
            case 'message':
                return room;
            case 'comment':
                return topic;
            case 'subcomment':
                return comment;
            default:
                return null;
        }
    };

    const uploadImage = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('image', file ?? '');
            await request(`/api/upload/${type}/${id()}`, 'POST', formData, {
                Authorization: `Bearer ${token}`,
                'Content-Disposition': 'form-data',
            });
        } catch (e) {
            throw new Error('Что-то пошло не так');
        }
    };

    const handlerImageCustom = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        if (e.target.files.length === 0) return;
        uploadImage(e.target.files[0]);
    };

    const createMessage = useCallback(async () => {
        const newMessage = {
            room,
            message,
        };
        await request('/api/message/create', 'POST', newMessage, {
            Authorization: `Bearer ${token}`,
        });
    }, [message, request, room, token]);

    const getUser = useCallback(async () => {
        const userFind = await request(
            '/api/room/findusers',
            'POST',
            { room },
            {
                Authorization: `Bearer ${token}`,
            },
        );
        const userForCall = userFind.find((obj: User) => obj._id !== user?._id);
        setUserInRoom(userForCall);
    }, [request, room, token, user]);

    const createComment = useCallback(async () => {
        let newTopic;
        if (comment) {
            newTopic = {
                comment,
                message,
            };
        } else {
            newTopic = {
                topic,
                message,
            };
        }
        await request('/api/comment/create', 'POST', newTopic, {
            Authorization: `Bearer ${token}`,
        });
    }, [comment, message, request, token, topic]);

    const sendMessageHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message) {
            if (type === 'message') {
                createMessage();
            } else {
                createComment();
            }
            setMessage('');
            if (callback) {
                callback(comment ?? topic);
            }
        }
    };

    const onEmojiClick = (emoji: string) => {
        const newString =
            message.slice(0, caretPosition) +
            emoji +
            message.slice(caretPosition);
        setMessage(newString as unknown as string);
        setOpenEmoji(!openEmoji);
    };

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setCaretPosition(e.target.selectionStart as number);
        setMessage(e.target.value);
    };

    useEffect(() => {
        console.log(!pathname.match(/forum/gm))
        if (!pathname.match(/forum/gm)) {
            getUser();
        }
    }, []);

    return (
        <form
            className={styles.inputMessage__block}
            onSubmit={(e) => sendMessageHandler(e)}
        >
            <div className={styles.inputMessage__dropdown}>
                {isActive && (
                    <div className={styles['inputMessage__dropdown-content']}>
                        <Button
                            skin="quad"
                            color={status === 'end' ? 'green' : 'red'}
                            onClick={
                                status === 'end'
                                    ? () =>
                                        CallPeer({
                                            user: userInRoom,
                                            from: user,
                                            socket,
                                            room,
                                        })
                                    : () =>
                                        CancelCall({
                                            socket,
                                            from: userInRoom,
                                        })
                            }
                        >
                            <Icon
                                type={status === 'end' ? 'call' : 'slashcall'}
                            />
                        </Button>
                        <Button
                            skin="quad"
                            color="yellow"
                            onClick={() => {
                                setIsActive(!isActive);
                                if (fileInput.current) {
                                    fileInput.current.click();
                                }
                            }}
                            disabled={!type || loading}
                        >
                            <Icon type="gallery" />
                        </Button>
                        <Button
                            title={'\u{1F642}'}
                            skin="quad"
                            color="blue"
                            onClick={() => {
                                setOpenEmoji(!openEmoji);
                                setIsActive(!isActive);
                            }}
                        />
                    </div>
                )}
                <Button
                    skin="quad"
                    color="blue"
                    onClick={() => setIsActive(!isActive)}
                >
                    <Icon type="arrowUp" />
                </Button>
            </div>
            {status === 'end' && (
                <>
                    <input
                        className={cn(
                            styles.inputMessage__input,
                            'browser-default',
                        )}
                        type="text"
                        placeholder="Message"
                        name="MessageInput"
                        value={message}
                        onChange={(e) => inputHandler(e)}
                        onClick={(e) =>
                            setCaretPosition(e.target.selectionStart)
                        }
                    />
                    <Button
                        skin="quad"
                        color="green"
                        type="submit"
                        disabled={!message || !type}
                    >
                        <Icon type="send" />
                    </Button>
                    <input
                        accept=".png, .jpg, .jpeg"
                        hidden
                        onChange={(e) => handlerImageCustom(e)}
                        type="file"
                        ref={fileInput}
                    />
                    {openEmoji && <Emoji callback={onEmojiClick} />}
                </>
            )}
        </form>
    );
};
