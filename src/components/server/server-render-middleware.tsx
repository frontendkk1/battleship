import { renderToString } from 'react-dom/server';
import { Request, Response } from 'express';
import { StaticRouter } from 'react-router-dom/server';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '../../store/store';
// import { getInitialState } from './store/getInitialState';
import { App } from '../App';

// const App: React.FC = () => <div>Hey from server!</div>;

function getHtml(reactHtml: string, reduxState = {}) {
    return `
    <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>Battleship - play together!</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link
                    href="https://fonts.googleapis.com/css2?family=Rubik+Wet+Paint&family=Titan+One&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap"
                    rel="stylesheet"
                >
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
                />
                <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    rel="stylesheet"
                />
                <link rel="stylesheet" href="/main.css"/>
                <script src="/bundle.js" defer></script>
            </head>
            <body>
                <div id="root">${reactHtml}</div>
                <script>
                    // Записываем состояние редакса, сформированное на стороне сервера в window
                    // На стороне клиента применим это состояние при старте
                    window.__INITIAL_STATE__ = ${JSON.stringify(reduxState)}
                </script>
            </body>
        </html>
    `;
}

export function requestHandler(req: Request, res: Response) {
    const store = configureStore();
    const jsx = (
        <ReduxProvider store={store}>
            <StaticRouter location={req.url}>
                <App />
            </StaticRouter>
        </ReduxProvider>
    );
    const reactHtml = renderToString(jsx);
    const reduxState = store.getState();

    res.send(getHtml(reactHtml, reduxState));
}
