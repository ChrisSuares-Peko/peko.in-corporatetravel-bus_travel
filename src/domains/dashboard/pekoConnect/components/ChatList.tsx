import React, { useEffect } from 'react';

import { Avatar, Badge, Divider, Empty, Flex, Skeleton, Typography } from 'antd';
// eslint-disable-next-line import/no-self-import
import { useLocation, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { setAcsUserId } from '@src/slices/connectSlice';

import { formatDisplayDate } from '../utils/formatDate';

export { list } from '@domains/dashboard/pekoConnect/utils/data';

type ChatListProps = {
    chatId: string | null;
    setChatId: (chatId: string) => void;
    request: any;
    setRequest: (any: string) => void;
    query: string;
    requests: any;
    refresh: () => void;
    isLoading: boolean;
};

const ChatList = ({
    chatId,
    setChatId,
    request,
    setRequest,
    query,
    requests,
    refresh,
    isLoading: requestsLoading,
}: ChatListProps) => {
    const { chats, isLoading, profiles, error } = useAppSelector(state => state.reducer.chat);
    const { corporateId } = useAppSelector(state => state.reducer.auth);
    const filterChats =
        chats
            ?.filter(it => {
                if (query === '') return true;
                const profile = profiles?.find(profil => profil.acs_user_id === it.sender.userId);
                if (!profile || !profile.name) return false;
                return profile.name.toLowerCase().startsWith(query.toLowerCase());
            })
            .sort((a, b) => {
                const dateA = a.lastMessage ? new Date(a.lastMessage.createdOn).getTime() : 0;
                const dateB = b.lastMessage ? new Date(b.lastMessage.createdOn).getTime() : 0;
                return dateB - dateA;
            }) || [];
    const filterRequests =
        requests
            ?.filter((it: any) => {
                if (query === '') return true;
                const profile = profiles?.find(profil => profil.id === it.receiverId);
                if (!profile || !profile.name) return false;
                return profile.name.toLowerCase().startsWith(query.toLowerCase());
            })
            .sort(
                (a: any, b: any) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ) || [];

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    useEffect(() => {
        if (id) {
            const chat = chats.find(it => it.threadId === id);
            if (chat) {
                // setChatId(chat.threadId);
                handleSetChat(chat);
                navigate('.', { replace: true, state: {} });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chats, id, navigate, setChatId]);

    const dispatch = useAppDispatch();
    const handleSetChat = (chat: any) => {
        if (!chat) {
            setChatId('');
            dispatch(setAcsUserId(''));
            return;
        }
        dispatch(setAcsUserId(chat.sender.userId));
        setChatId(chat.threadId);
    };

    const renderUser = (chat: any) => {
        const profile = profiles?.find((p: any) => p.acs_user_id === chat.sender.userId);
        const displayName = chat?.sender?.displayName || 'Unknown Business';
        // const name = profile?.name || 'Unknown Business';
        const image = profile?.logo;
        const type = chat?.lastMessage?.metadata?.type || 'type';
        let lastMessage = chat?.lastMessage?.content?.message || '';
        const time = formatDisplayDate(chat?.lastMessage?.createdOn);
        if (type === 'image') lastMessage = '📷 image';
        if (type === 'call') lastMessage = '📞 call';

        return (
            <div
                className={twMerge(
                    'm-1 px-2 py-4 rounded-xl hover:bg-gray-50',
                    chat.threadId === chatId && 'bg-[#F5F5F5] hover:bg-[#F5F5F5]'
                )}
            >
                <div className="flex items-center justify-start gap-4 px-2">
                    <div className="min-w-6">
                        {image ? (
                            <Avatar src={<img src={image} alt={displayName} />} />
                        ) : (
                            <Avatar
                                style={{
                                    backgroundColor: '#FFE6E6',
                                    color: '#FF4F4F',
                                    fontWeight: 'bolder',
                                }}
                            >
                                {displayName?.[0].toUpperCase()}
                            </Avatar>
                        )}
                    </div>
                    <Flex vertical justify="center" gap={1} className="w-full border-gray-100">
                        <Flex justify="space-between" align="center" gap={4} className="w-full">
                            <div>
                                <p className="text-darkBlue font-medium text-[13px] line-clamp-1">
                                    {displayName}
                                </p>
                                <p className="mt-1 text-xs font-normal text-secondary line-clamp-1">
                                    {lastMessage}
                                </p>
                            </div>
                            <div className="flex flex-col items-end justify-start gap-1">
                                <p className="text-xs text-textDisabledGray">{time}</p>
                                <div className="h-4">
                                    {chat.unreadCount > 0 && (
                                        <Badge
                                            color={chat.unreadCount <= 5 ? 'green' : 'red'}
                                            count={chat.unreadCount}
                                            overflowCount={9}
                                            size="small"
                                        />
                                    )}
                                </div>
                            </div>
                        </Flex>
                    </Flex>
                </div>
            </div>
        );
    };

    const renderRequest = (req: any) => {
        const { senderLogo, senderName, receiverName, receiverLogo } = req;
        const name = req.senderId === corporateId ? receiverName || 'Unknown Business' : senderName;
        const image = req.senderId === corporateId ? receiverLogo : senderLogo;
        const time = formatDisplayDate(req.createdAt);

        return (
            <div
                className={twMerge(
                    'm-1 px-2 py-4 rounded-xl hover:bg-gray-50',
                    req?.id === request?.id && 'bg-gray-100 hover:bg-gray-100'
                )}
            >
                <div className="flex items-center justify-start gap-4 px-2">
                    <div className="min-w-6">
                        {image ? (
                            <Avatar src={<img src={image} alt={name} />} />
                        ) : (
                            <Avatar
                                style={{
                                    backgroundColor: '#FFE6E6',
                                    color: '#FF4F4F',
                                    fontWeight: 'bolder',
                                }}
                            >
                                {name?.[0].toUpperCase()}
                            </Avatar>
                        )}
                    </div>
                    <Flex vertical justify="center" gap={1} className="w-full border-gray-100">
                        <Flex justify="space-between" align="center" gap={4} className="w-full">
                            <div>
                                <p className="text-darkBlue font-medium text-[13px] line-clamp-1">
                                    {name}
                                </p>
                                <p className="text-xs font-normal text-secondary line-clamp-1">
                                    {req.message}
                                </p>
                            </div>
                            <p className="text-xs text-textDisabledGray">{time}</p>
                        </Flex>
                    </Flex>
                </div>
            </div>
        );
    };

    // if (isLoading && requestsLoading)
    //     return (
    //         <div className="flex items-center justify-center h-full">
    //             <Spin size="large" />
    //         </div>
    //     );

    if (error || !filterChats)
        return (
            <div className="flex items-center justify-center h-full">
                <Empty description="Something went wrong. Please try again later." />
            </div>
        );

    if (filterChats && filterChats.length === 0 && !filterRequests) {
        if (query)
            return (
                <div className="flex items-center justify-center h-full">
                    <Empty description="No chats were found matching the search." />
                </div>
            );
        return (
            <div className="flex items-center justify-center h-full">
                <Empty description="No chats yet. You can start a chat from New Connection button." />
            </div>
        );
    }
    // if(requestsLoading || isLoading){
    //     return (
    //         <div className="flex items-center justify-center h-full">
    //             <Skeleton active className="p-5" paragraph={{ rows: 5 }} />
    //         </div>
    //     )
    // }

    return (
        <ul className="h-full overflow-y-scroll">
            <Divider />
            {requestsLoading && <Skeleton active className="p-5" paragraph={{ rows: 5 }} />}

            {filterRequests && filterRequests.length > 0 && (
                <>
                    <Typography.Text className="px-2 py-4 m-2">
                        {filterRequests.length === 1
                            ? 'Pending Request Connection'
                            : 'Pending Request Connections'}
                    </Typography.Text>
                    {filterRequests.map((value: any) => (
                        <li key={value?.id}>
                            <div
                                onClick={() => {
                                    setRequest(value);
                                    handleSetChat(null);
                                }}
                                onKeyPress={() => {
                                    setRequest(value);
                                    handleSetChat(null);
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                {renderRequest(value)}
                            </div>
                        </li>
                    ))}
                    <Divider />
                </>
            )}
            {isLoading && <Skeleton active className="p-5" paragraph={{ rows: 5 }} />}

            {filterChats && filterChats.length > 0 && (
                <>
                    <Typography.Text className="px-2 py-4 m-2">
                        {filterChats.length === 1 ? 'Connection' : 'Connections'}
                    </Typography.Text>
                    {filterChats.map(value => (
                        <li key={value?.threadId}>
                            <div
                                onClick={() => {
                                    handleSetChat(value);
                                    setRequest('');
                                }}
                                onKeyPress={() => {
                                    handleSetChat(value);
                                    setRequest('');
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                {renderUser(value)}
                            </div>
                        </li>
                    ))}
                </>
            )}
            {filterChats.length === 0 &&
                filterRequests.length === 0 &&
                !isLoading &&
                !requestsLoading && (
                    <Flex
                        justify="center"
                        align="center"
                        className={twMerge('flex-grow bg-white rounded-xl h-full p-4')}
                    >
                        <Empty description="No Connections Found" />
                    </Flex>
                )}
        </ul>
    );
};

export default ChatList;
