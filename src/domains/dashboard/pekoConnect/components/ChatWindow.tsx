import React, { useState, useEffect } from 'react';

import { ArrowLeftOutlined, Loading3QuartersOutlined } from '@ant-design/icons';
import { ChatClient } from '@azure/communication-chat';
import { Avatar, Button, Empty, Flex, Image, Input, Modal, Spin, Typography } from 'antd';
import { ReactSVG } from 'react-svg';
import { twMerge } from 'tailwind-merge';

import audioCall from '@domains/dashboard/pekoConnect/assets/audioCall.svg';
import FileAttach from '@domains/dashboard/pekoConnect/assets/fileAttach.svg';
import sendIcon from '@domains/dashboard/pekoConnect/assets/sendIcon.svg';
import video from '@domains/dashboard/pekoConnect/assets/videoCall.svg';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { markChatAsRead, setMode, setPage } from '@src/slices/connectSlice';
import { updateLastMessage } from '@src/slices/thunks/updateLastMessage';

import ChatBody from './ChatBody';
import EmojiPanel from './EmojiPanel';
import documentDefault from '../assets/documentDefault.svg';
import useGetMessages from '../hooks/useGetMessages';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import usePostChatFile from '../hooks/usePostChatFile';
import useSendMessage from '../hooks/useSendMessage';
import useUpdateLastSeen from '../hooks/useUpdateLastSeen';
import { getChatClient } from '../utils/chatService';

type ChatWindowProps = {
    chatId: string | null;
    onClose: () => void;
    className?: string;
    refresh: () => void;
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

const ChatWindow = ({ chatId, onClose, className, refresh }: ChatWindowProps) => {
    const { acs_user_id } = useAppSelector(state => state.reducer.auth);
    const { acsUserId } = useAppSelector(state => state.reducer.chat);
    const [enableScroll, setEnableScroll] = useState(false);
    const [message, setMessage] = useState('');
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLDivElement>(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
    const [file, setFile] = useState<File | null>(null);
    const { handleUpdateLastSeen } = useUpdateLastSeen({ chatId });
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const { profiles } = useAppSelector(state => state.reducer.chat);
    const profile = profiles && profiles?.find(profil => profil.acs_user_id === acsUserId);

    const { messages, setMessages, fetchNext, isLoading, isLoadingMore, error, hasMore } =
        useGetMessages(chatId);
    const { handleSendChatMessage, isLoading: isLoadingSendMessage } = useSendMessage({
        chatThreadId: chatId,
    });

    const { handlePostChatFile, isLoading: isLoadingPostChatFile } = usePostChatFile();
    const loaderRef = useInfiniteScroll({
        hasMore,
        loading: isLoadingMore,
        setPage: fetchNext,
    });

    const imageInputRef = React.useRef<HTMLInputElement>(null);
    const handleImageClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
            imageInputRef.current.click();
        }
    };

    useEffect(() => {
        if (chatId) {
            dispatch(markChatAsRead(chatId));
            if (messages.length > 2) {
                const lastMessage = messages.find(
                    (m: any) => m?.sender?.communicationUserId !== acs_user_id && m.type === 'text'
                );
                if (lastMessage) handleUpdateLastSeen(lastMessage.id);
            }
            if (inputRef.current) inputRef.current.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId, messages]);

    const sendEmoji = async (e: any) => {
        if (!e?.emoji) return;
        await handleSendChatMessage('emoji', e.emoji);
        setEnableScroll(true);
    };

    const handleSendMessage = async () => {
        const trimmedMsg = message.trim();
        if (!trimmedMsg || !chatId) return;
        await handleSendChatMessage('text', trimmedMsg);
        setMessage('');
        setEnableScroll(true);
        // handleUpdateLastSeen();
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (
            selectedFile &&
            !(
                selectedFile.type.startsWith('image/') ||
                selectedFile.type === 'application/pdf' ||
                selectedFile.type ===
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                selectedFile.type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
        ) {
            e.target.value = '';
            dispatch(
                showToast({
                    description: 'Please upload only image, PDF, DOCX, or Excel files',
                    variant: 'error',
                })
            );
            return;
        }
        const maxFileSizeKB = 2048; // 2MB
        if (selectedFile) {
            const isLtMaxFileSize = selectedFile.size / 1024 <= maxFileSizeKB; // 2MB
            if (!isLtMaxFileSize) {
                dispatch(
                    showToast({
                        description: `File size must be smaller than ${maxFileSizeKB}KB!`,
                        variant: 'error',
                    })
                );
                return;
            }

            setFile(selectedFile);
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setPreviewImage(fileReader.result as string);
                setPreviewVisible(true);
            };
            fileReader.readAsDataURL(selectedFile);
        }
    };

    useEffect(() => {
        let client: ChatClient | null = null;
        const chatMessageReceivedHandler = (msg: any) => {
            if (msg.threadId !== chatId) return;
            const newMessage = {
                ...msg,
                content: { message: msg.message, attachments: msg.attachments },
                type: 'text',
                metadata: msg.metadata,
                sequenceId: '',
            };
            const updatedMessages = [newMessage, ...messages];
            setMessages(updatedMessages);
            dispatch(updateLastMessage({ chatThreadId: chatId, message: msg }));
        };

        const getData = async () => {
            client = await getChatClient();
            await client.startRealtimeNotifications();
            client.on('chatMessageReceived', chatMessageReceivedHandler);
        };

        getData();

        return () => {
            if (client) {
                client.off('chatMessageReceived', chatMessageReceivedHandler);
            }
        };
    }, [messages, chatId, setMessages, dispatch]);

    useEffect(() => {
        if (enableScroll) scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        setEnableScroll(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    const handleVideoCall = async () => {
        await handleSendChatMessage('call', 'Call started');
        dispatch(setMode('create'));
        dispatch(setPage('video'));
    };

    const handleAudioCall = async () => {
        await handleSendChatMessage('call', 'Call started');
        dispatch(setMode('create'));
        dispatch(setPage('audio'));
    };

    const handleDeleteChat = async () => {
        if (!chatId) return;
        const t1 = await getChatClient();
        const t2 = await t1.deleteChatThread(chatId);
    };

    const handleProceed = async () => {
        if (file) {
            const fileType = file?.type?.startsWith('image/') ? 'image' : 'file';
            const url = await handlePostChatFile({ target: { files: [file] } } as any);
            if (url) {
                await handleSendChatMessage(fileType, url);
                setEnableScroll(true);
            }
            resetState();
        }
    };

    const handleCancel = () => {
        resetState();
    };

    const resetState = () => {
        setPreviewVisible(false);
        setPreviewImage(undefined);
        setFile(null);
    };

    if (!chatId)
        return (
            <Flex
                justify="center"
                align="center"
                className={twMerge('flex-grow bg-white rounded-xl h-full p-4', className)}
            >
                <Empty description="No chat selected" />
            </Flex>
        );

    if (error)
        return (
            <Flex
                justify="center"
                align="center"
                className={twMerge('flex-grow bg-white rounded-xl h-full p-4', className)}
            >
                <Empty description="Failed to load chat" />
            </Flex>
        );

    return (
        <Flex vertical className={twMerge('flex-grow bg-white rounded-xl h-full ', className)}>
            <Flex align="center" gap={8} className="px-4 py-3">
                <Button
                    type="text"
                    onClick={onClose}
                    shape="circle"
                    size="large"
                    className="md:hidden"
                    icon={<ArrowLeftOutlined />}
                />
                <Flex gap={16} className="flex-grow" align="center">
                    {profile?.logo ? (
                        <Avatar src={<img src={profile?.logo} alt={profile?.name} />} />
                    ) : (
                        <Avatar
                            style={{
                                backgroundColor: '#FFE6E6',
                                color: '#FF4F4F',
                                fontWeight: 'bolder',
                            }}
                        >
                            {profile?.name?.[0].toUpperCase()}
                        </Avatar>
                    )}
                    <Flex vertical gap={1}>
                        <Typography.Text className="font-medium">
                            {profile?.name || 'Unknown name'}
                        </Typography.Text>
                        <Typography.Text className="text-sm text-gray-400 whitespace-nowrap">
                            Peko ID:{profile?.credential.username || 'NA'}
                        </Typography.Text>
                    </Flex>
                    {/* <Button onClick={handleDeleteChat} type="text">
						Delete Chat
					</Button> */}
                </Flex>
                <ReactSVG
                    type="button"
                    className="pr-3 text-xl cursor-pointer text-brandColor"
                    onClick={handleAudioCall}
                    beforeInjection={svg => {
                        svg.setAttribute('style', 'width: 23px; height: 23px;');
                    }}
                    src={audioCall}
                />
                <ReactSVG
                    type="button"
                    className="cursor-pointer"
                    onClick={handleVideoCall}
                    src={video}
                />
            </Flex>
            <div className="flex flex-col-reverse flex-grow p-2 overflow-auto bg-gray-100 max-h-[calc(100vh-210px)] sm:max-h-[calc(100vh-210px)] md:max-h-[calc(100vh-350px)] lg:max-h-[calc(100vh-350px)] xl:max-h-[calc(100vh-380px)] xxl:max-h-[calc(100vh-420px)]">
                {messages.length === 0 && isLoadingMore && <Loader />}
                {messages.length === 2 && !isLoadingMore && <NoMessages />}
                <div ref={scrollRef} id="chat-container">
                    {messages && messages.length > 2 && (
                        <div className="text-center">
                            <div ref={loaderRef as any} className="p-2">
                                {isLoadingMore && <Spin />}
                                {!hasMore && <div className="h-px mx-auto bg-gray-200 md:w-96" />}
                            </div>
                        </div>
                    )}
                    {messages && <ChatBody messages={messages} searchTerm={searchTerm} />}
                </div>
            </div>
            <Flex align="center" gap={16} className="p-4 bg-white rounded">
                {isLoadingPostChatFile ? (
                    <Loading3QuartersOutlined className="text-lg animate-spin" />
                ) : (
                    <ReactSVG
                        src={FileAttach}
                        onClick={handleImageClick}
                        className="text-lg cursor-pointer"
                    />
                )}
                <input
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    ref={imageInputRef}
                    onChange={handleInputChange}
                />
                <Flex className="flex-grow gap-2 px-4 py-1 bg-[#FAFAFA] rounded-xl items-center">
                    <EmojiPanel onEmojiClick={sendEmoji} />
                    <Input
                        type="text"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Type your message here"
                        className="bg-[#FAFAFA] border-none rounded-lg focus:ring-0 focus:bg-transparent focus:outline-none"
                        onKeyUp={e => {
                            if (e.key === 'Enter') handleSendMessage();
                        }}
                        autoFocus
                    />
                </Flex>
                <Button
                    type="text"
                    loading={isLoadingSendMessage}
                    onClick={handleSendMessage}
                    icon={<ReactSVG src={sendIcon} />}
                />
            </Flex>
            <Modal
                open={previewVisible}
                title="File Preview"
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                        loading={isLoadingSendMessage || isLoadingPostChatFile}
                        key="submit"
                        type="primary"
                        danger
                        onClick={handleProceed}
                    >
                        Proceed
                    </Button>,
                ]}
            >
                {previewImage && file?.type.startsWith('image/') ? (
                    <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
                ) : (
                    <Flex vertical justify="center" align="center">
                        <Image style={{ width: '100%' }} src={documentDefault} alt="" />
                        <Typography.Text className="my-5 text-center">
                            Preview not available
                        </Typography.Text>
                    </Flex>
                )}
            </Modal>
        </Flex>
    );
};

export default ChatWindow;
