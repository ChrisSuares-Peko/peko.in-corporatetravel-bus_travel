import React from 'react';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Flex, Image, Typography } from 'antd';
// import { ReactSVG } from 'react-svg';

import meeting from '@domains/dashboard/pekoConnect/assets/meeting.png';
// import vectors from '@domains/dashboard/pekoConnect/assets/Vectors.svg';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { setAcsUserId } from '@src/slices/connectSlice';

import CustomAvatar from './CustomAvatar';
import useCreateChat from '../hooks/useCreateChat';
import usePutRequest from '../hooks/usePutRequest';

type ConnectionRequestProps = {
    request: any;
    setChatId: (chatId: string) => void;
    setRequest: (request: any) => void;
    refresh: () => void;
    onClose: () => void;
};

const ConnectionRequest = ({
    request,
    setChatId,
    setRequest,
    refresh,
    onClose,
}: ConnectionRequestProps) => {
    const { corporateId } = useAppSelector(state => state.reducer.auth);
    const { profiles } = useAppSelector(state => state.reducer.chat);
    const profile = profiles.find((p: any) => p.id === request.receiverId);
    const senderProfile = profiles && profiles?.find(profil => profil.id === request.senderId);
    const { handleCreateChat, isLoading } = useCreateChat();
    const { handlePutRequest, isLoading: isLoadingPutRequest } = usePutRequest();
    const dispatch = useAppDispatch();
    const handleAccept = async () => {
        if (!request?.senderAcsUserId) return;
        await handlePutRequest({ requestId: request.id, status: 'ACCEPTED' });
        const data = await handleCreateChat(request?.senderAcsUserId, request?.senderName);
        if (data) {
            setRequest('');
            setChatId(data.id);
            dispatch(setAcsUserId(request?.senderAcsUserId));
            refresh();
        }
    };
    const handleReject = () => {
        handlePutRequest({ requestId: request.id, status: 'REJECTED' }).then(res => {
            refresh();
        });
        setRequest('');
    };

    const name =
        request.senderId === corporateId
            ? profile?.name || 'Unknown Business'
            : senderProfile?.name;
    const image = request.senderId === corporateId ? profile?.logo : senderProfile?.logo;
    const username =
        request.senderId === corporateId
            ? profile?.credential.username
            : senderProfile?.credential.username;

    return (
        <Flex vertical className="flex-grow h-full rounded-xl">
            <Flex align="center" gap={8} className="px-4 py-3">
                <Button
                    type="text"
                    onClick={onClose}
                    shape="circle"
                    size="large"
                    className="md:hidden"
                    icon={<ArrowLeftOutlined />}
                />
                <Flex gap={16} align="center">
                    <CustomAvatar logo={image} name={name} />
                    <Flex vertical gap={1}>
                        <Typography.Text>{name}</Typography.Text>
                        <Typography.Text className="">
                            <span>Peko ID:{username}</span>
                        </Typography.Text>
                    </Flex>
                </Flex>
                {/* <Flex>
                    <ReactSVG src={vectors} />
                </Flex> */}
            </Flex>

            <Flex vertical justify="center" align="center" className="h-full bg-gray-100">
                <Image src={meeting} preview={false} style={{ height: 150, width: 'auto' }} />
                {request.senderId !== corporateId ? (
                    <>
                        <Typography.Text className="px-6 font-thin text-center md:px-0 md:text-3xl">
                            {name} wants to connect
                        </Typography.Text>
                        <Typography.Text className="px-32 mt-4">
                            {name}: {request.message}
                        </Typography.Text>
                        <Flex className="mt-5" gap={10}>
                            <Button
                                loading={isLoading || isLoadingPutRequest}
                                danger
                                type="primary"
                                className="w-48 font-medium"
                                onClick={handleAccept}
                            >
                                Start conversation
                            </Button>
                            <Button type="default" danger onClick={handleReject}>
                                Reject
                            </Button>
                        </Flex>
                    </>
                ) : (
                    <Typography.Text className="px-6 font-thin text-center md:px-0 md:text-3xl">
                        {request?.receiverName || 'Unknown name'} is yet to reply to your request
                    </Typography.Text>
                )}
            </Flex>
        </Flex>
    );
};

export default ConnectionRequest;
