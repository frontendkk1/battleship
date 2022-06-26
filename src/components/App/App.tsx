/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-constructed-context-values */
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AllStateTypes } from 'src/store/reducers';
import { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { useAuth } from 'src/hooks/auth.hook';

import { Toast } from '../Toast';
import { AuthContext } from '../utils/Context/AuthContext';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import { PageLinks } from '../utils/Routes/types';
import { SocketListener } from '../utils/Socket/Socket';
import './App.scss';

const AppWithRoutes: React.FC = () => {
    const routes = useRoutes();
    const position = 'top-right';
    const startGameRoom = useSelector(
        (state: AllStateTypes) => state.game.room,
    );
    const navigate = useNavigate();
    useEffect(() => {
        if (startGameRoom) navigate(`${PageLinks.game}/${startGameRoom}`);
    }, [startGameRoom]);
    const { token, login, logout } = useAuth();

    useEffect(() => {
        SocketListener();
    }, []);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            <ErrorBoundary>
                <Toast position={position} />
                {routes}
            </ErrorBoundary>
        </AuthContext.Provider>
    );
};

export const App = hot(AppWithRoutes);
