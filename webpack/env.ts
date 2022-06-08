import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const IS_DEV = process.env.NODE_ENV !== 'production';
const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');
const DB = process.env.DB_CONN || '';
const { PORT } = process.env;
const IS_DEV_SERVER = process.env.SERVER === 'true';
const SECRET_KEY = '5fXeXE0WvPDxbsn411y67Q0j6Idr6Jwv'

export {
    IS_DEV,
    SRC_DIR,
    DIST_DIR,
    DB,
    PORT,
    IS_DEV_SERVER,
    SECRET_KEY
};
