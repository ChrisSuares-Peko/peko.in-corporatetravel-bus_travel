import { v4 as uuidv4 } from 'uuid';

import AntdConfig from './antd.config';
import useCustomNotification from './hooks/useCustomNotification';
import { useScrollToTop } from './hooks/useScrollToTop';
// eslint-disable-next-line import/no-cycle
import Router from './routes/sections';

// TAB_ID is used by auth components (e.g. RegisterStepFive) to identify the
// current browser tab in BroadcastChannel messages.
export const TAB_ID = uuidv4();

function App() {
    useScrollToTop();
    const { contextHolder } = useCustomNotification();

    return (
        <AntdConfig>
            {contextHolder}
            <Router />
        </AntdConfig>
    );
}

export default App;
