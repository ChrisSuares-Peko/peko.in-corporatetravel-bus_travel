import React from 'react';

import { DownloadOutlined } from '@ant-design/icons';
import { ChatMessage } from '@azure/communication-chat';
import { Flex, Image } from 'antd';
import { FiPhoneIncoming, FiPhoneOutgoing } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';

import { useAppSelector } from '@src/hooks/store';

import documentDefault from '../assets/documentDefault.svg';
import { getDisplayDate, groupMessagesByDate } from '../utils';
import formatDate from '../utils/formatDate';

const highlightSearchTerm = (msg: string, search: string) => {
    if (!search.trim()) return msg;
    const regex = new RegExp(`(${search})`, 'gi');
    return msg.replace(regex, `<mark>$1</mark>`);
};

type ChatBodyProps = {
    messages: ChatMessage[];
    searchTerm: string;
};

export default function ChatBody({ messages, searchTerm = '' }: ChatBodyProps) {
    const { acs_user_id } = useAppSelector(state => state.reducer.auth);
    const groupedMessages = groupMessagesByDate(messages);
    console.log('🚀 ~ ChatBody ~ groupedMessages:', groupedMessages);

    const renderContent = (type: string, msg: string, isSender: boolean) => {
        if (type === 'text') {
            return (
                <div
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(msg, searchTerm),
                    }}
                />
            );
        }
        if (type === 'emoji') {
            return <span className="text-7xl">{msg}</span>;
        }
        if (type === 'image') {
            return (
                <Flex className="relative">
                    <Image
                        src={msg}
                        alt=""
                        loading="lazy"
                        width={200}
                        height={200}
                        className="object-cover w-full h-full rounded-xl"
                        preview
                    />
                    <a
                        href={msg}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="absolute p-1 border-none shadow-lg bg-gray-50 top-2 right-2"
                    >
                        <DownloadOutlined />
                    </a>
                </Flex>
            );
        }
        if (type === 'file') {
            return (
                <Flex className="relative">
                    <Image
                        src={msg}
                        alt=""
                        loading="lazy"
                        // eslint-disable-next-line no-return-assign
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
                            ((e.target as HTMLImageElement).src = documentDefault)
                        }
                        width={200}
                        height={200}
                        className="object-cover w-full h-full rounded-xl"
                        preview={false}
                    />
                    <a
                        href={msg}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="absolute p-1 border-none shadow-lg bg-gray-50 top-2 right-2"
                    >
                        <DownloadOutlined />
                    </a>
                </Flex>
            );
        }
        if (type === 'call') {
            return (
                <Flex className="px-4 py-1 border rounded-xl" align="center" gap={8}>
                    {isSender ? <FiPhoneOutgoing /> : <FiPhoneIncoming />}
                    <span>{isSender ? 'Outgoing Call' : 'Incoming Call'}</span>
                </Flex>
            );
        }
        return <span className="italic">unsupported message</span>;
    };

    return (
        <div className="flex flex-col-reverse">
            {Object.keys(groupedMessages).map(dateKey => (
                <div key={dateKey} className="flex flex-col gap-4">
                    <div className="text-center text-gray-500">{getDisplayDate(dateKey)}</div>
                    {groupedMessages[dateKey].map(message => {
                        const { id, content, createdOn, sender } = message;
                        const { message: msg } = content;
                        const type = message?.metadata?.type || 'text';
                        const isSender = sender?.communicationUserId === acs_user_id;
                        if (!msg) return null;
                        return (
                            <div className="flex flex-col gap-1 px-4 mt-4" key={id}>
                                <div
                                    className={twMerge(
                                        'flex flex-col max-w-[80%] gap-1',
                                        sender?.communicationUserId !== acs_user_id
                                            ? 'self-start'
                                            : 'self-end'
                                    )}
                                >
                                    <div
                                        className={twMerge(
                                            'text-sm font-normal self-stretch rounded-xl select-text p-3',
                                            sender?.communicationUserId !== acs_user_id
                                                ? 'rounded-tl-none bg-white'
                                                : 'rounded-br-none bg-[#fce5e5]',
                                            (type === 'image' ||
                                                type === 'emoji' ||
                                                type === 'call') &&
                                                'bg-transparent ps-0 pe-0 pb-0'
                                        )}
                                    >
                                        {renderContent(type, msg, isSender)}
                                    </div>
                                    <div className="flex items-center self-end gap-1 px-1">
                                        <span className="text-[10px] self-end text-gray-400 lowercase">
                                            {formatDate(createdOn)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
