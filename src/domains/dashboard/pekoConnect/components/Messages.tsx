import React, { useEffect } from 'react';

import { ChatMessage } from '@azure/communication-chat';
import { Col, Empty, Flex, Row, Spin } from 'antd';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { updateLastMessage } from '@src/slices/thunks/updateLastMessage';

import useGetMessages from '../hooks/useGetMessages';
import { getChatClient } from '../utils/chatService';
import formatDate from '../utils/formatDate';

type MessagesProps = {
    chatId: string | null;
};

const Loader = () => (
    <Flex justify="center" align="center" className="h-full">
        <Spin size="large" />
    </Flex>
);

const NoMessages = () => (
    <Flex justify="center" align="center" className="h-full">
        <Empty description="No messages yet" />
    </Flex>
);

const Messages = ({ chatId }: MessagesProps) => {
    const dispatch = useAppDispatch();
    const { acs_user_id } = useAppSelector(state => state.reducer.auth);
    const { messages, setMessages } = useGetMessages(chatId);

    useEffect(() => {
        const getData = async () => {
            const client = await getChatClient();
            await client.startRealtimeNotifications();

            client.on('chatMessageReceived', msg => {
                if (msg.threadId !== chatId) return;
                const newMessage: ChatMessage = {
                    ...msg,
                    content: { message: msg.message, attachments: msg.attachments },
                    type: 'text',
                    metadata: msg.metadata,
                    sequenceId: '',
                };
                const updatedMessages = [...messages, newMessage];
                setMessages(updatedMessages);
                dispatch(updateLastMessage({ chatThreadId: chatId, message: msg }));
            });
        };
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    return (
        <div className="flex-grow overflow-y-scroll bg-gray-100">
            {messages &&
                messages.length > 0 &&
                messages.map((message: any) => {
                    const { content, sender, createdOn, id, metadata } = message;
                    if (metadata?.type !== 'text') return false;
                    return (
                        <div key={id}>
                            {sender?.communicationUserId === acs_user_id ? (
                                <Row className="px-4 mt-4" justify="end">
                                    <Col className="max-w-[80%]">
                                        <div
                                            className="p-3 text-sm font-normal text-black rounded-br-none select-text rounded-xl"
                                            style={{ backgroundColor: '#FFE6E6' }}
                                        >
                                            {content?.message}
                                        </div>
                                        <div className="flex items-center gap-1 px-1">
                                            <span className="text-[10px] text-gray-400 lowercase">
                                                {formatDate(createdOn.getTime())}
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            ) : (
                                <Row className="px-4 mt-4" justify="start">
                                    <Col className="max-w-[80%]">
                                        <div className="text-sm font-normal rounded-xl select-text p-3 rounded-tl-none bg-white text-[#25396F]">
                                            {content?.message}
                                        </div>
                                        <div className="flex items-center gap-1 px-1">
                                            <span className="text-[10px] text-gray-400 lowercase">
                                                {formatDate(createdOn.getTime())}
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            )}
                        </div>
                    );
                })}
        </div>
    );
};

export default Messages;
