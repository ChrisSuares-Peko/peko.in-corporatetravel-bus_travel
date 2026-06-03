import React, { useEffect, useState } from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Layout, Spin } from 'antd';

import CustomBreadCrumb from '@components/molecular/breadcrumbs/CustomBreadcrumb';
import Footer from '@components/molecular/footer';
import Spinner from '@components/molecular/loaders/Spinner';
import CustomHeader from '@components/molecular/nav-section/horizontal/CustomHeader';
import MobileHeader from '@components/molecular/nav-section/horizontal/MobileHeader';
import Sidebar from '@components/molecular/nav-section/vertical/Sidebar';
import ChatNotification from '@src/domains/dashboard/pekoConnect/components/ChatNotification';
import VideoContainer from '@src/domains/dashboard/pekoConnect/components/VideoContainer';
import { getCallAgent } from '@src/domains/dashboard/pekoConnect/utils/chatService';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import useUserInfo from '@src/hooks/useUserInfo';
import { fetchChats } from '@src/slices/thunks/fetchChats';

const { Header, Content, Sider } = Layout;

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [callAgent, setCallAgent] = useState<any>(null);
    const { isLoading } = useUserInfo();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.reducer.user);
    const { roleName, role } = useAppSelector(state => state.reducer.auth);

    useEffect(() => {
        if (roleName === 'corporate' && user?.companyName) {
            const getAgent = async () => {
                const newCallAgent = await getCallAgent(user?.companyName);
                setCallAgent(newCallAgent);
                dispatch(fetchChats());
                //   dispatch(setCallAgent(newCallAgent));
            };
            getAgent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleName, user]);

    return isLoading ? (
        <Flex className="items-center justify-center min-w-full min-h-svh">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </Flex>
    ) : (
        <>
            <Layout className="overflow-hidden bg-white min-h-svh max-h-svh">
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    width={270}
                    style={{ background: '#ffffff' }}
                    className="hidden overflow-y-scroll hide-scroll lg:block "
                >
                    <Sidebar />
                </Sider>
                <Layout>
                    <Header className="px-0 py-2 bg-white border-b border-solid lg:py-3 lg:px-10 xs:hidden lg:block">
                        <CustomHeader />
                    </Header>
                    <Header className="px-0 py-2 bg-white border-b border-solid lg:py-3 lg:px-10 xs:inline lg:hidden">
                        <MobileHeader />
                    </Header>
                    <Spinner />
                    <Content
                        className="px-5 py-4 overflow-y-scroll bg-white sm:pt-8 sm:px-10"
                        id="myContainer"
                    >
                        {role === 'corporate' && <CustomBreadCrumb />}
                        <div className="sm:my-4 dynamic-min-height">{children}</div>
                        <Footer />
                    </Content>
                </Layout>
            </Layout>
            <ChatNotification />
            {callAgent && <VideoContainer callAgent={callAgent} />}
        </>
    );
};

export default DashboardLayout;
