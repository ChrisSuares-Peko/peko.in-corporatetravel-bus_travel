import axios from 'axios';
import clevertap from 'clevertap-web-sdk';

import { SERVER_URL } from '@src/config-global';
import { persistor } from '@store/store';

export const clearData = () => {
    persistor.pause();
    persistor.flush();
    persistor.purge();

    window.location.href = '/'; // avoid auto redirecting to prev page after login in again
};

export const handleLogout = async () => {
    const authChannel = new BroadcastChannel('authChannel');

    if ((window as any).fcWidget) {
        (window as any).fcWidget.destroy();
    }
    const reduxStorageString = localStorage.getItem('persist:root');
    let reduxStorage;
    if (reduxStorageString) reduxStorage = JSON.parse(reduxStorageString);
    const authData = JSON.parse(reduxStorage.auth);

    try {
        clevertap.event.push('userlogout', {
            Page: 'logout',
            Action: 'user logout',
        });
        await axios.post(
            `${SERVER_URL}/user/logout`,
            {},
            {
                headers: {
                    authorization: `Bearer ${authData.token}`,
                    sessionid: authData.sessionId,
                },
            }
        );
        authChannel.postMessage('logout');
    } catch (error) {
        authChannel.postMessage('logout');
    }
};
