import { Button } from 'src/components/Button';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { Layout } from '../../components/Layout';
import styles from './ProfilePage.scss';
import { Avatar } from './components/Avatar';

export const ProfilePage = (): JSX.Element => {
    const user = useSelector((state: AllStateTypes) => state.user.item);

    return (
        <Layout>
            <div className={styles.profile__main}>
                <div className={styles['profile__block-up']}>
                    <Button
                        href={PageLinks.home}
                        skin="quad"
                        color="red"
                        title="X"
                    />
                </div>
                <div className={styles['profile__block-center']}>
                    {Avatar(user!)}
                    <span>{user?.display_name}</span>
                    <span>{user?.first_name}</span>
                    <span>{user?.second_name}</span>
                    <span>{user?.login}</span>
                    <span>{user?.email}</span>
                    <span>{user?.phone}</span>
                </div>
                <div className={styles['profile__block-down']}>
                    <Button
                        href={PageLinks.profileUpdate}
                        title="EDIT PROFILE"
                        skin="wide"
                    />
                    <Button
                        href={PageLinks.profilePassUpdate}
                        title="EDIT PASSWORD"
                        skin="wide"
                    />
                </div>
            </div>
        </Layout>
    );
};
