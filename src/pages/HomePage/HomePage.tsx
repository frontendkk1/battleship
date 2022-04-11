import cn from 'classnames';
import { Button } from 'src/components/Button';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import menuLogoWithShips from '../../../images/menuLogoWithShips.svg';
import menuLogoWithPirates from '../../../images/menuLogoWithPirates.svg';
import { Layout } from '../../components/Layout';
import styles from './HomePage.scss';
import stylesButton from '../../components/Button/Button.scss';

export const HomePage = (): JSX.Element => {
    const [typeOfGame, setTypeOfGame] = useState(false);

    return (
        <Layout>
            <div className={styles.home__main}>
                <div className={styles.home__buttons}>
                    <NavLink to="/">
                        <Button title="forum" />
                    </NavLink>
                    <NavLink to="/">
                        <Button title="leaders" />
                    </NavLink>
                    <NavLink to="/profile">
                        <Button title="profile" />
                    </NavLink>
                    <NavLink to="/auth">
                        <Button className={stylesButton.red} title="x" />
                    </NavLink>
                </div>
                <img
                    className={styles['home__image-left']}
                    src={menuLogoWithShips}
                    alt="Логотип с кораблями"
                />
                <span className={styles.home__header}>BATTLESHIP</span>
                <div className={styles.home__menu}>
                    <div className={styles.home__select}>
                        <div>
                            <div>
                                <label htmlFor="toggle">
                                    <input
                                        id="toggle"
                                        type="checkbox"
                                        checked={typeOfGame}
                                        onChange={() => {
                                            setTypeOfGame(!typeOfGame);
                                        }}
                                    />
                                    <span className="lever" />
                                    <span
                                        className={
                                            styles[
                                                'home__select-toggle-logotype'
                                            ]
                                        }
                                    >
                                        Toggle play mode!
                                    </span>
                                </label>
                            </div>
                            <div className="home__select-type">
                                <span
                                    className={cn(
                                        styles['home__select-type-logotype'],
                                        { selected: !typeOfGame },
                                    )}
                                >
                                    CLASSIC
                                </span>
                                <span
                                    className={cn(
                                        styles['home__select-type-logotype'],
                                        { selected: !typeOfGame },
                                    )}
                                >
                                    ONLINE
                                </span>
                            </div>
                        </div>
                        <NavLink to="/auth">
                            <Button
                                className={cn(
                                    stylesButton.green,
                                    stylesButton.big,
                                )}
                                title="play"
                            />
                        </NavLink>
                    </div>
                    <img
                        className={styles['home__image-right']}
                        src={menuLogoWithPirates}
                        alt="Логотип с пиратами"
                    />
                </div>
            </div>
        </Layout>
    );
};
