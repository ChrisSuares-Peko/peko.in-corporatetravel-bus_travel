import { useEffect } from 'react';

import clevertap from 'clevertap-web-sdk';
import { v4 as uuidv4 } from 'uuid';

import AntdConfig from './antd.config';
import { CLEVERTAP_ACCOUNT_ID } from './config-global';
import useCustomNotification from './hooks/useCustomNotification';
import { useScrollToTop } from './hooks/useScrollToTop';
// eslint-disable-next-line import/no-cycle
import Router from './routes/sections';
import { clearData } from './services/handleLogout';

export const TAB_ID = uuidv4();

function App() {
    useScrollToTop();
    const { contextHolder } = useCustomNotification();
    const authChannel = new BroadcastChannel('authChannel');

    clevertap.init(CLEVERTAP_ACCOUNT_ID);
    clevertap.event.push('AppLoaded', {
        Property: 'AppLoadedValue',
    });

    useEffect(() => {
        const handleLogoutEvent = (event: any) => {
            if (event.data === 'logout') {
                clearData();
            }
            if (event.data.type === 'login' && event.data.tabId !== TAB_ID) {
                window.location.reload();
            }
        };

        authChannel.addEventListener('message', handleLogoutEvent);

        return () => {
            authChannel.removeEventListener('message', handleLogoutEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AntdConfig>
            {contextHolder}
            <Router />
        </AntdConfig>
    );
}

export default App;
