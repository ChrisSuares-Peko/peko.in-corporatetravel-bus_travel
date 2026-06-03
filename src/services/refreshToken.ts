import axios from 'axios';

import { SERVER_URL } from '@src/config-global';
import { store } from '@store/store';

export const updateRefreshToken = () => {
    const { refreshToken } = store.getState().reducer.auth;
    const response = axios.post(`${SERVER_URL}/user/refresh-token`, { refreshToken });
    return response;
};
