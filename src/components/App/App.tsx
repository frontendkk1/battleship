import { hot } from 'react-hot-loader/root';
import { Toast } from '../Toast';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import { Listener } from '../utils/Socket/Listeners';
import './App.scss';

const AppWithRoutes: React.FC = () => {
    const routes = useRoutes();
    const position = 'top-right';
    Listener()
    return (
        <ErrorBoundary>
            <Toast
                position={position}
            />
            {routes}
        </ErrorBoundary>
    );
};

export const App = hot(AppWithRoutes);
