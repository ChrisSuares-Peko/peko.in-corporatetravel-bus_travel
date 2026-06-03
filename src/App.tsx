import AntdConfig from './antd.config';
import useCustomNotification from './hooks/useCustomNotification';
import { useScrollToTop } from './hooks/useScrollToTop';
// eslint-disable-next-line import/no-cycle
import Router from './routes/sections';

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
