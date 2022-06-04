/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from 'react';
import cn from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { notificationService } from 'src/store/services/notificationService';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import styles from './Toast.scss';
import { Props } from './types';
import { Notification } from 'src/store/reducers/notifications';

const ToastBlock = (toast: Notification, position: string): JSX.Element => {
    const deleteToast = (id: string) => {
        notificationService.deleteNotification(id);
    };

    setInterval(() => {
        if (toast.autoDelete) {
            deleteToast(toast.id as string);
        }
    }, toast.autoDeleteTime);

    return (
        <div
            key={toast.id}
            className={cn(
                styles.notification,
                styles[position],
                toast.type && styles[toast.type],
            )}
        >
            <button
                className={styles['notification-close']}
                onClick={() => deleteToast(toast.id || '')}
            >
                x
            </button>
            {toast.user && (
                <div className={styles['notification-image']}>
                    {Avatar(toast.user)}
                </div>
            )}
            {toast.title && (
                <p className={styles['notification-title']}>
                    {toast.title}
                </p>
            )}
            <p className={styles['notification-message']}>
                {toast.message}
            </p>
            {toast.buttons && toast.buttons.length > 0 && (
                <p className={styles['notification-buttons']}>
                    {toast.buttons.map((button) => (
                        <Button
                            key={uuidv4()}
                            title={button.title}
                            skin="small"
                            onClick={button.onClick}
                        />
                    ))}
                </p>
            )}
        </div>
    )
}

export const Toast: FC<Props> = ({ position }) => {
    const list = useSelector((state: AllStateTypes) => state.notification);

    return (
        <div
            className={cn(styles['notification-containers'], styles[position])}
        >
            {list.map((toast) => (
                ToastBlock(toast, position)
            ))}
        </div>
    );
};