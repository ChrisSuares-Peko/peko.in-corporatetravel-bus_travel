import React, { useEffect, useState } from 'react';

import { Empty, Flex, Input, Typography, Button } from 'antd';
import { ReactSVG } from 'react-svg';
import { twMerge } from 'tailwind-merge';

import Vectors from '@domains/dashboard/pekoConnect/assets/Connection-Icon.svg';
import useScreenSize from '@src/hooks/useScreenSize';

import CallHistory from './CallHistory';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ConnectionRequest from './ConnectionRequest';

type CorporateListProps = {
    requests: any;
    refresh: () => void;
    isLoading: boolean;
    handleConnection: () => void;
};
const CorporateList = ({ refresh, requests, isLoading, handleConnection }: CorporateListProps) => {
    const [activeKey, setActiveKey] = useState('1');
    const [activeTab, setActiveTab] = useState('1');
    const [chatId, setChatId] = React.useState<string | null>(null);
    const [request, setRequest] = React.useState<string | null>(null);
    const [query, setQuery] = useState('');
    const screens = useScreenSize();
    const getMaxHeight = () => {
        if (screens.xxl) {
            return 'calc(100vh - 280px)';
        }
        if (screens.md) {
            return 'calc(100vh - 260px)';
        }
        return 'calc(100vh - 180px)';
    };

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (chatId) return setActiveKey('1');
        if (request) return setActiveKey('3');
        setActiveKey('1');
    }, [chatId, request]);

    const renderComponent = () => {
        switch (activeKey) {
            case '1':
                return (
                    <ChatWindow
                        key={chatId}
                        chatId={chatId}
                        onClose={() => setChatId(null)}
                        refresh={refresh}
                    />
                );
            case '2':
                return <CallHistory />;
            case '3':
                return (
                    <ConnectionRequest
                        request={request}
                        setChatId={setChatId}
                        setRequest={setRequest}
                        refresh={refresh}
                        onClose={() => {
                            setActiveKey('1');
                            setChatId(null);
                            setRequest(null);
                        }}
                    />
                );
            default:
                return (
                    <div className="flex items-center justify-center h-full">
                        <Empty description="Please select a chat" />
                    </div>
                );
        }
    };

    const renderSidebar = () => {
        if (activeTab === '2') return <p className="p-2">Call history</p>;
        return (
            <ChatList
                chatId={chatId}
                setChatId={s => setChatId(s)}
                request={request}
                setRequest={setRequest}
                query={query}
                requests={requests}
                isLoading={isLoading}
                refresh={refresh}
            />
        );
    };

    return (
        <>
            <Flex
                gap={12}
                justify="space-between"
                align="center"
                className={twMerge(
                    request || chatId ? 'hidden md:flex' : 'flex',
                    'px-5 py-4 md:px-0 md:py-0'
                )}
            >
                <Typography.Text className="text-lg font-medium sm:text-xl">
                    Peko Connect
                </Typography.Text>
                <Button
                    danger
                    type="primary"
                    onClick={handleConnection}
                    className="font-medium md:w-36"
                >
                    {screens.md ? 'New Connection' : <ReactSVG src={Vectors} />}
                </Button>
            </Flex>
            <Flex className="flex-grow min-h-[calc(100vh-170px)] md:min-h-[calc(100vh-220px)] lg:min-h-[calc(100vh-210px)] xl:min-h-[calc(100vh-240px)] xxl:md:min-h-[calc(100vh-280px)] md:mt-4 bg-white md:border md:rounded-xl">
                <Flex
                    vertical
                    className={twMerge(
                        request || chatId
                            ? 'hidden md:flex w-full lg:w-80 md:w-64'
                            : 'flex w-full md:w-64 lg:w-80'
                    )}
                    style={{
                        overflowY: 'auto',
                        maxHeight: getMaxHeight(),
                    }}
                >
                    <div className="px-2 m-2 md:mt-6">
                        <Input
                            placeholder="Search for a Connection"
                            className=""
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                    {renderSidebar()}
                </Flex>
                <div
                    className={twMerge(
                        !request && !chatId
                            ? 'hidden md:flex flex-grow border-l'
                            : 'flex-grow border-l'
                    )}
                >
                    {renderComponent()}
                </div>
            </Flex>
        </>
    );
};

export default CorporateList;
