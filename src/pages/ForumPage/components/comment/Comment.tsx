import { Props } from './types';

import styles from './Comment.scss';

export const Comment: Props = ({
    date = '',
    name = 'Noname',
    description = 'Default description...',
}): JSX.Element => (
    <div className={styles.comment}>
        <div className={styles.comment__header}>
            <p className={styles.comment__description}>{description}</p>
            <div className={styles.comment__author}>
                <h3 className={styles['comment__author-name']}>{name}</h3>
                <p className={styles['comment__author-date']}>{date}</p>
            </div>
        </div>
    </div>
);