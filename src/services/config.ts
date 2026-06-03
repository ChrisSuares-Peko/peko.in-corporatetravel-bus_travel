/* eslint-disable @typescript-eslint/dot-notation */
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { ErrorGenericResponse } from '@customtypes/general';
import { SERVER_URL } from '@src/config-global';
import { loginSuccess } from '@src/domains/auth/slices/loginSlice';
import { showToast } from '@src/slices/apiSlice';
import { RootState, store } from '@store/store';

import { handleLogout } from './handleLogout';
import { updateRefreshToken } from './refreshToken';

const authChannel = new BroadcastChannel('authChannel');

export const ApiClient = axios.create({
    baseURL: SERVER_URL,
    // timeout: 15000,
    signal: new AbortController().signal,
});

ApiClient.interceptors.request.use(
    async config => {
        const originalRequest = config.url;
        const currentDateAndTime = new Date().getTime() / 1000;

        const { refreshToken, token, sessionId, id, username, role, isAuthenticated } = (
            store.getState() as RootState
        ).reducer.auth;

        const decodedToken = jwtDecode(token);
        const decodedRefreshToken = jwtDecode(refreshToken);
        if (
            token !== undefined &&
            originalRequest !== '/user/refresh-token' &&
            decodedToken?.exp! > currentDateAndTime &&
            sessionId
        ) {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['sessionid'] = sessionId;
        } else if (
            decodedToken?.exp! < currentDateAndTime &&
            decodedRefreshToken?.exp! > currentDateAndTime &&
            refreshToken !== undefined
        ) {
            try {
                const response = await updateRefreshToken();
                const { data, status } = response;

                if (status === 200) {
                    store.dispatch(
                        loginSuccess({
                            username,
                            id,
                            role,
                            isAuthenticated,
                            token: data?.data?.token,
                            refreshToken: data?.data?.refreshToken,
                            sessionId: data?.data?.sessionId,
                        })
                    );
                    config.headers['Authorization'] = `Bearer ${data?.data?.token}`;
                    config.headers['sessionid'] = data?.data?.sessionId;
                }
            } catch (error) {
                await handleLogout();
            }
        } else {
            await handleLogout();
        }

        return config;
    },
    error => Promise.reject(error)
);

ApiClient.interceptors.response.use(
    response => {
        const { data } = response;
        return data;
    },
    error => {
        const data: ErrorGenericResponse = error?.response?.data;
        if (data.message === 'invalid token' || data.responseCode === '002') {
            handleLogout();
        } else if (data.responseCode === '004') {
            window.location.href = '/404';
        } else if (data.responseCode !== '003') {
            store.dispatch(showToast({ description: data.message, variant: 'error' }));
        }
        return Promise.reject(error);
    }
);
