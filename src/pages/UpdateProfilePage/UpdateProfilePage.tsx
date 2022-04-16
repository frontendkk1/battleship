/// Ошибка деструктуризации
/* eslint-disable object-curly-newline */
import { useHistory } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { useHttp } from 'src/hooks/http.hook';
import { useCallback, useContext, useEffect } from 'react';
import { Preloader } from 'src/components/Preloader';
import { Form } from 'src/components/Form';
import { useMessage } from 'src/hooks/message.hook';
import { AuthContext } from 'src/context/Authcontext';
import { fieldsProps } from 'src/components/Form/types';
import { PageLinks } from 'src/components/utils/Routes/types';
import { Layout } from 'src/components/Layout';
import styles from '../ProfilePage/ProfilePage.scss';
import { inputs, submitTitle } from './config';
import { Avatar } from '../ProfilePage/Avatar';

export const UpdateProfilePage = (): JSX.Element => {
    const { user, setUser } = useContext(AuthContext);
    const inputsWithDefaultsValue: fieldsProps[] = [];
    inputs.forEach((input) => {
        const element = {
            ...input,
            ...{ defaultValue: user[input.name as keyof typeof user] },
        };
        inputsWithDefaultsValue.push(element);
    });
    const message = useMessage();
    const { request, loading, error, clearError } = useHttp();
    const history = useHistory();
    const changeProfile = useCallback(
        async (data) => {
            try {
                const fetched = await request('/user/profile', 'PUT', data);
                setUser(fetched);
                history.push(PageLinks.profile);
            } catch (e) {
                throw new SyntaxError('Что-то пошло не так');
            }
        },
        [history, request, setUser],
    );

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    return (
        <Layout>
            <div className={styles.profile__main}>
                {loading ? (
                    <Preloader />
                ) : (
                    <>
                        <div className={styles['profile__block-up']}>
                            <Button
                                skin="quad"
                                color="red"
                                href={PageLinks.profile}
                                title="X"
                            />
                        </div>
                        <div className={styles['profile__block-center']}>
                            {Avatar(user)}
                            <Form
                                inputs={inputsWithDefaultsValue}
                                setData={changeProfile}
                                submitTitle={submitTitle}
                                disabled={loading}
                            />
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};