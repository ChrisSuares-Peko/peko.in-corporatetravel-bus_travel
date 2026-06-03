import { paths } from './routes/paths';

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.home;

export const FRONTEND_BASE_URL = `${import.meta.env.VITE_FRONTEND_BASE_URL}`;
export const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}/api/v1`;
export const LEAN_APP_TOKEN = `${import.meta.env.VITE_LEAN_APP_TOKEN}`;
export const ENV = `${import.meta.env.VITE_ENV}`;
export const VITE_PUSHER_APPKEY = `${import.meta.env.VITE_PUSHER_APPKEY}`;
export const CLEVERTAP_ACCOUNT_ID = `${import.meta.env.VITE_CLEVERTAP_ACCOUNT_ID}`;
export const USD_TO_AED = `${import.meta.env.VITE_USD_TO_AED}`;
