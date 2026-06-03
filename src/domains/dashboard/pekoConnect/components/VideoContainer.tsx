import React, { useEffect } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { IncomingCall, IncomingCallEvent } from '@azure/communication-calling';
import { Avatar, Button, Divider, Flex, theme, Typography } from 'antd';
import { capitalize } from 'lodash';
import { FiPhone, FiVideo, FiPhoneMissed } from 'react-icons/fi';

import ringtoneFile from '@assets/audio/callRingtone.wav';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import useScreenSize from '@src/hooks/useScreenSize';
import { setMode, setPage } from '@src/slices/connectSlice';

import Azure from '../pages/Azure';

type VideoContainerProps = {
    callAgent: any;
};

export default function VideoContainer({ callAgent }: VideoContainerProps) {
    const { page } = useAppSelector(state => state.reducer.chat);
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const [isReceivingCall, setIsReceivingCall] = React.useState(false);
    const [ringtonePlaying, setRingtonePlaying] = React.useState(false);
    const [newIncomingCall, setNewIncomingCall] = React.useState<IncomingCall>();
    const { md } = useScreenSize();

    useEffect(() => {
        if (!callAgent) return undefined;
        const incomingCallListener: IncomingCallEvent = ({ incomingCall }) => {
            setNewIncomingCall(incomingCall);
            setIsReceivingCall(true);
            incomingCall.on('callEnded', args => {
                setIsReceivingCall(false);
            });
        };
        callAgent.on('incomingCall', incomingCallListener);
        return () => {
            callAgent.off('incomingCall', incomingCallListener);
        };
    }, [callAgent]);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isReceivingCall) {
            // Start playing ringtone when receiving call
            setRingtonePlaying(true);
        } else {
            // Stop playing ringtone when call ends or declined
            setRingtonePlaying(false);
        }
    }, [isReceivingCall]);

    const acceptCall = async (type: string) => {
        if (newIncomingCall) {
            // const call = await incomingCall.accept();
            // setIncomingCall(call);

            dispatch(setPage(type));
            dispatch(setMode('join'));
            setIsReceivingCall(false);
            return;
        }
        setNewIncomingCall(undefined);
    };

    const declineCall = () => {
        if (newIncomingCall) {
            newIncomingCall.reject();
        }
        setIsReceivingCall(false);
        setNewIncomingCall(undefined);
    };

    if (page === 'chat') {
        return (
            <div>
                {isReceivingCall && (
                    <div className="absolute inset-0 z-50 flex items-start justify-end top-4 right-4">
                        {/* Audio element for ringtone */}
                        {ringtonePlaying && (
                            <audio autoPlay loop>
                                <track kind="captions" srcLang="en" label="English captions" />
                                <source src={ringtoneFile} type="audio/mp3" />
                            </audio>
                        )}
                        <div className="relative w-full max-w-md py-4 bg-white border shadow-2xl rounded-2xl">
                            <Flex justify="space-between" className="px-5 pb-1">
                                <Typography.Text className="text-base text-gray-500">
                                    Peko Connect
                                </Typography.Text>
                                <Typography.Text className="text-base text-gray-500">
                                    Incoming Call
                                </Typography.Text>
                            </Flex>
                            <Divider />
                            <Flex justify="center" className="px-5 pt-2">
                                <Avatar
                                    size="large"
                                    draggable={false}
                                    className="bg-[#ffeeee] w-20 h-20"
                                >
                                    <Typography.Text
                                        style={{ color: colorPrimary }}
                                        className="text-4xl font-bold "
                                    >
                                        {newIncomingCall?.callerInfo?.displayName?.slice(0, 1) ||
                                            '-'}
                                    </Typography.Text>
                                </Avatar>
                            </Flex>
                            <Flex vertical className="pt-3" align="center">
                                <Typography.Text className="text-xl font-semibold">
                                    {capitalize(newIncomingCall?.callerInfo.displayName)}
                                </Typography.Text>
                                <Typography.Text className="text-lg text-gray-500">
                                    is calling you
                                </Typography.Text>
                            </Flex>
                            <Flex justify="center" gap={10} className="pt-4">
                                <Button
                                    onClick={() => acceptCall('video')}
                                    type="default"
                                    icon={md && <FiVideo className="mt-[0.26rem]" />}
                                    className="flex px-4 text-white rounded-md bg-vidoCallGreen"
                                >
                                    {md ? 'Video Call' : <FiVideo className="mt-[0.26rem]" />}
                                </Button>
                                <Button
                                    onClick={() => acceptCall('audio')}
                                    type="default"
                                    icon={md && <FiPhone className="mt-[0.26rem]" />}
                                    className="flex px-4 text-white rounded-md bg-audioCallGreen"
                                >
                                    {md ? 'Voice Call' : <FiPhone className="mt-[0.26rem]" />}
                                </Button>
                                <Button
                                    onClick={declineCall}
                                    type="primary"
                                    icon={
                                        md && <FiPhoneMissed className="mt-[0.26rem] text-white" />
                                    }
                                    danger
                                    className="flex px-4 rounded-md bg-declineCallRed "
                                >
                                    {md ? (
                                        'Decline'
                                    ) : (
                                        <FiPhoneMissed className="mt-[0.26rem] text-white" />
                                    )}
                                </Button>
                            </Flex>

                            {/* Logo image */}
                            {/* {business?.logo && (
                                <div className="flex justify-center mb-0">
                                    <Image
                                        width={100}
                                        height={100}
                                        preview={false}
                                        src={business.logo}
                                        alt="Business Logo"
                                        className="object-cover rounded-full"
                                    />
                                </div>
                            )} */}
                            {/* Business name */}
                            {/* {business?.name && (
                                <p className="mb-6 text-lg font-semibold text-center text-gray-700">
                                    {business.name}
                                </p>
                            )} */}
                            {/* <div className="flex justify-center space-x-4">
                                <Button
                                    onClick={declineCall}
                                    type="primary"
                                    icon={<FiPhoneOff />}
                                    danger
                                    className="px-4 text-white rounded-md"
                                >
                                    Decline
                                </Button>
                                <Button
                                    onClick={acceptCall}
                                    type="default"
                                    icon={<FiPhone />}
                                    className="px-4 text-white bg-green-700 rounded-md"
                                >
                                    Accept
                                </Button>
                            </div> */}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    if (page === 'video' || page === 'audio') {
        return (
            <Azure
                callAgent={callAgent}
                setIsReceivingCall={setIsReceivingCall}
                incomingCall={newIncomingCall}
                page={page}
            />
        );
    }
    return null;
}
