/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import express from 'express';
import 'babel-polyfill';
import jwt from 'jsonwebtoken';
import http from 'http';
import https from 'https';
import path from 'path';
import { Server, Socket } from 'socket.io';
import authRoutes from 'socketRoutes/auth.routes';
import inviteRoutes from 'socketRoutes/invite.routes';
import videoRoutes from 'socketRoutes/video.routes';
import mongoose from 'mongoose';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import fs from 'fs';
import { DB, IS_DEV, IS_DEV_SERVER, PORT, SECRET_KEY } from '../webpack/env';
import { renderResponse } from './server/renderResponse';
import authRouter from '../serverRoutes/auth.routes';
import fileRouter from '../serverRoutes/file.routes';
import userRouter from '../serverRoutes/user.routes';
import topicRouter from '../serverRoutes/topic.routes';
import commentRouter from '../serverRoutes/comment.routes';
import roomRouter from '../serverRoutes/room.routes';
import messageRouter from '../serverRoutes/message.routes';
import gameRouter from '../serverRoutes/game.routes';
import webpackConfig from '../webpack/client.config';
import { ISocket } from './server/types';
import { TimersStore } from './server/timersStore';
import type {
    ClientToServerEvents,
    ServerToClientEvents,
} from './components/utils/Socket/types';

const compiler = webpack(webpackConfig);
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
const privateKey = fs.readFileSync('./src/sslcert/localhost.key', 'utf8');
const certificate = fs.readFileSync('./src/sslcert/localhost.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

const app = express();
const httpServer = IS_DEV
    ? https.createServer(credentials, app)
    : http.createServer(app);
if (IS_DEV && !IS_DEV_SERVER) {
    app.use(
        devMiddleware(compiler, {
            publicPath: webpackConfig?.output?.publicPath,
        }),
    );
    app.use(hotMiddleware(compiler));
}

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
        cors: {
            origin: '*',
        },
        transports: ['polling'],
    },
);

export const ts = new TimersStore();

io.engine.on(
    'connection_error',
    (err: { req: any; code: any; message: any; context: any }) => {
        console.log(err.req); // the request object
        console.log(err.code); // the error code, for example 1
        console.log(err.message); // the error message, for example "Session ID unknown"
        console.log(err.context); // some additional error context
    },
);

io.use((socket: ISocket, next: (err?: Error) => void) => {
    try {
        const token = socket.handshake.auth.jwtToken;
        if (!token) {
            return next(new Error('Пользователь не авторизован'));
        }
        jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
            if (err && err.name === 'TokenExpiredError') {
                return next(new Error('TokenExpiredError'));
            }
            if (decoded) {
                socket.userID = decoded.userId;
                next();
            } else {
                return next(new Error('Пользователь не распознан'));
            }
        });
    } catch (e) {
        return next(new Error('Нет авторизации'));
    }
});

io.on('connection', (socket: Socket) => {
    authRoutes(socket);
    inviteRoutes(socket);
    videoRoutes(socket);
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/topic', topicRouter);
app.use('/api/comment', commentRouter);
app.use('/api/room', roomRouter);
app.use('/api/message', messageRouter);
app.use('/api/game', gameRouter);
app.use('/api/upload', fileRouter);

app.use(express.static(path.resolve(__dirname, '../dist')));
app.get('/*', renderResponse);

mongoose.connect(DB);
httpServer.listen(PORT, () => {
    console.log(
        `Сервер запущен в режиме ${IS_DEV ? 'РАЗРАБОТКИ' : 'ПРОДАКШЕН'}${
            IS_DEV_SERVER ? ' СЕРВЕРА' : ''
        } на порту: ${PORT}`,
    );
});
