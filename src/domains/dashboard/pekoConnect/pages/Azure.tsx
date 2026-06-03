import React, { useState, useEffect, useRef, useCallback } from 'react';

import { CallClient, VideoStreamRenderer, LocalVideoStream } from '@azure/communication-calling';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AzureLogger, setLogLevel } from '@azure/logger';
// eslint-disable-next-line import/order
import { Avatar, Button, Flex, theme, Typography } from 'antd';

import { CiVideoOn } from 'react-icons/ci';
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from 'react-icons/fi';
import { ReactSVG } from 'react-svg';

import disconnect from '@domains/dashboard/pekoConnect/assets/disconnect.svg';
import screenShare from '@domains/dashboard/pekoConnect/assets/screenShare.svg';
import { useAppSelector } from '@src/hooks/store';

import Calling from './Calling';
import { useHangUp } from '../hooks/useHangUp';
import { useSetupSouces } from '../hooks/useSetupSources';

// eslint-disable-next-line import/order
// import { MessageOutlined } from '@ant-design/icons';

setLogLevel('error');
AzureLogger.log = (...args) => {
    // console.log(...args);
};

const createLocalVideoStream = async (deviceManager: any) => {
    const cameras = await deviceManager.getCameras();
    if (cameras.length > 0) {
        const camera = cameras[0];
        return new LocalVideoStream(camera);
    }
    console.error('No camera device found on the system');
    return null;
};

interface AzureProps {
    incomingCall?: any;
    callAgent: any;
    setIsReceivingCall: React.Dispatch<React.SetStateAction<boolean>>;
    page: string;
}

const Azure = ({ incomingCall, callAgent, setIsReceivingCall, page }: AzureProps) => {
    const { mode, acsUserId: calleeAcsUserId } = useAppSelector(state => state.reducer.chat);

    const { user } = useAppSelector(state => state.reducer.user);

    const { setupSources, addVideoToCall } = useSetupSouces();
    const { hangUp } = useHangUp();

    const localRef = useRef<any>(null);
    const remoteRef = useRef<any>(null);
    const localScreenSharingRef = useRef<HTMLDivElement | null>(null);
    const [cameraOn, setCameraOn] = useState(page === 'video');
    const [microphoneMuted, setMicrophoneMuted] = useState(false);
    const [call, setCall] = useState<any>(null);
    const [deviceManager, setDeviceManager] = useState<any>(null);
    const [connected, setConnected] = useState(false);
    const [localVideoStream, setLocalVideoStream] = useState<any>(null);
    const [localVideoStreamRenderer, setLocalVideoStreamRenderer] = useState<any>(null);
    const {
        token: { colorPrimary },
    } = theme.useToken();

    const [sharingScreen, setSharingScreen] = useState<boolean>(false);

    let companyName: string | undefined;
    if (user) {
        // eslint-disable-next-line prefer-destructuring
        companyName = user.companyName;
    }

    const memoizedSetWebcamActive = useCallback((active: any) => {
        setCameraOn(active);
    }, []);

    const memoizedSetLocalVideoStream = useCallback((stream: any) => {
        setLocalVideoStream(stream);
    }, []);

    useEffect(() => {
        if (mode === 'create' || mode === 'join') {
            setupSources(
                mode,
                calleeAcsUserId,
                localRef,
                remoteRef,
                callAgent,
                call,
                incomingCall,
                memoizedSetWebcamActive,
                memoizedSetLocalVideoStream,
                setIsReceivingCall,
                setCall,
                setConnected,
                setLocalVideoStream,
                setLocalVideoStreamRenderer,
                page
            );
        }
        return () => {
            if (call) {
                call.hangUp();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    useEffect(() => {
        if (!callAgent) return;
        const initialize = async () => {
            try {
                const callClient = new CallClient();
                const newDeviceManager = await callClient.getDeviceManager();
                await newDeviceManager.askDevicePermission({
                    video: page === 'video',
                    audio: true,
                });
                setDeviceManager(newDeviceManager);
            } catch (error) {
                // console.log(error);
            }
        };
        initialize();
    }, [callAgent, page]);

    const toggleCamera = async () => {
        if (call) {
            if (cameraOn) {
                await call.stopVideo(localVideoStream);
                setCameraOn(false); // Update state after stopping video
                if (localVideoStreamRenderer) {
                    localVideoStreamRenderer.dispose();
                    setLocalVideoStreamRenderer(null);
                }
            } else {
                await deviceManager.askDevicePermission({ video: true });
                const videoStream = await addVideoToCall(deviceManager);
                setLocalVideoStream(videoStream);
                await call.startVideo(videoStream);
                const renderer = new VideoStreamRenderer(videoStream!);
                setLocalVideoStreamRenderer(renderer);
                const view = await renderer.createView();
                if (localRef.current) {
                    localRef.current.innerHTML = '';
                    localRef.current.appendChild(view.target);
                }
                setCameraOn(true); // Update state after starting video
            }
        }
    };

    useEffect(() => {
        if (localRef.current) {
            localRef.current.style.backgroundColor = cameraOn ? 'transparent' : 'black';
        }
    }, [cameraOn]);

    const toggleMicrophone = async () => {
        if (call) {
            if (microphoneMuted) {
                await call.unmute();
                setMicrophoneMuted(false); // Update state after unmuting
            } else {
                await call.mute();
                setMicrophoneMuted(true); // Update state after muting
            }
        }
    };

    const handleHangUp = async () => {
        await hangUp(
            call,
            localRef,
            remoteRef,
            setCameraOn,
            setLocalVideoStream,
            setIsReceivingCall,
            setConnected
        );

        setLocalVideoStream(null);
    };

    const handleScreenShareToggle = async () => {
        if (call) {
            if (sharingScreen) {
                setSharingScreen(false);
                // Stop screen sharing
                await call.stopScreenSharing();
                const localScreenSharingStream = call.localVideoStreams.find(
                    (stream: any) => stream.mediaStreamType === 'ScreenSharing'
                );
                if (localScreenSharingStream) {
                    const videoStreamRenderer = new VideoStreamRenderer(localScreenSharingStream);
                    const view = await videoStreamRenderer.createView();
                    view.dispose();
                    if (localScreenSharingRef.current) {
                        localScreenSharingRef.current.innerHTML = ''; // Clear screen share content
                        localScreenSharingRef.current.style.display = 'none'; // Hide screen sharing div
                    }
                }
                // setLocalScreenShareStream(null);
                setLocalVideoStream(await createLocalVideoStream(deviceManager)); // Resume local camera stream
                if (localRef.current && localVideoStreamRenderer) {
                    const view = await localVideoStreamRenderer.createView();
                    localRef.current.innerHTML = '';
                    localRef.current.appendChild(view.target);
                }
            } else {
                // Start screen sharing
                setSharingScreen(true);
                await call.startScreenSharing();
                const localScreenSharingStream = call.localVideoStreams.find(
                    (stream: any) => stream.mediaStreamType === 'ScreenSharing'
                );
                if (localScreenSharingStream) {
                    const videoStreamRenderer = new VideoStreamRenderer(localScreenSharingStream);
                    const view = await videoStreamRenderer.createView();
                    if (localScreenSharingRef.current) {
                        localScreenSharingRef.current.innerHTML = ''; // Clear previous content
                        localScreenSharingRef.current.style.display = 'block'; // Show screen sharing div
                        localScreenSharingRef.current.appendChild(view.target);
                    }
                    //   setLocalScreenShareStream(localScreenSharingStream);
                    setLocalVideoStream(null); // Hide local camera stream
                } else {
                    console.error('Local screen sharing stream not found.');
                }
            }
        }
    };

    useEffect(() => {
        setCameraOn(page === 'video');
        setMicrophoneMuted(false);
    }, [call, page]);

    return (
        <>
            {!connected && <Calling mode={mode} hangUp={handleHangUp} />}

            <div className={`fixed inset-0 bg-black ${!connected ? 'hidden' : ''}`}>
                <div className="flex flex-col w-full h-full">
                    <div className="flex items-center justify-start h-16">
                        <Button
                            type="text"
                            icon={<CiVideoOn />}
                            className="flex items-center justify-center p-4 text-xl font-bold bg-transparent border-none text-brandColor"
                        >
                            {(user && incomingCall?.callerInfo?.displayName) || 'Peko'}
                        </Button>
                    </div>
                    <div className="relative flex-grow">
                        <div
                            id="localRef"
                            ref={localRef}
                            className="absolute z-10 w-32 h-40 rounded-lg bottom-6 right-6 md:bottom-8 md:right-8 md:w-72 md:h-52"
                        />
                        <div
                            ref={remoteRef}
                            className="relative object-contain w-full h-full p-4 overflow-hidden rounded-lg"
                        >
                            <Flex justify="center" align="center" className="w-full h-full">
                                <Avatar
                                    size="large"
                                    draggable={false}
                                    shape="circle"
                                    className="bg-[#ffeeee] w-32 h-32 md:w-64 md:h-64"
                                >
                                    <Typography.Text
                                        style={{ color: colorPrimary }}
                                        className="text-5xl font-bold md:text-9xl"
                                    >
                                        {incomingCall?.callerInfo?.displayName?.slice(0, 1) ?? '-'}
                                    </Typography.Text>
                                </Avatar>
                            </Flex>
                        </div>
                    </div>
                    <div className="flex items-center w-full h-24 p-5">
                        <div className="flex justify-center flex-grow space-x-4 md:space-x-6">
                            <Button
                                size="large"
                                title={
                                    microphoneMuted ? 'Turn On Microphone' : 'Turn Off Microphone'
                                }
                                onClick={toggleMicrophone}
                                icon={microphoneMuted ? <FiMicOff /> : <FiMic />}
                                className={`flex items-center text-xl border-0 justify-center ${!microphoneMuted ? 'bg-gray-500 text-white' : 'bg-white text-gray-500'} hover:${microphoneMuted ? 'bg-gray-500' : 'bg-white'} rounded-md`}
                            />

                            <Button
                                onClick={toggleCamera}
                                size="large"
                                title={cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
                                icon={cameraOn ? <FiVideo /> : <FiVideoOff />}
                                className={`flex items-center text-xl border-0 justify-center ${cameraOn ? 'bg-gray-500 text-white' : 'bg-white text-gray-500'} hover:${cameraOn ? 'bg-gray-500' : 'bg-white'} rounded-md`}
                            />

                            <Button
                                size="large"
                                title={sharingScreen ? 'Stop Screen Share' : 'Start Screen Share'}
                                onClick={handleScreenShareToggle}
                                className={`flex items-center border-0 cursor-pointer justify-center px-1 py-2 ${
                                    sharingScreen
                                        ? 'bg-gray-500 text-white'
                                        : 'bg-white text-gray-500'
                                } hover:${
                                    sharingScreen
                                        ? 'bg-gray-500 text-white'
                                        : 'bg-white text-brandColor'
                                } rounded-md`}
                                icon={
                                    <ReactSVG
                                        src={screenShare}
                                        beforeInjection={svg => {
                                            svg.setAttribute('style', 'width: 34px; height: 22px;');
                                        }}
                                    />
                                }
                            />
                            <Button
                                size="large"
                                title="Disconnect Call"
                                onClick={handleHangUp}
                                className="flex items-center justify-center px-1 py-2 text-white border-none rounded-full bg-brandColor hover:text-white"
                                style={{ backgroundColor: 'red', border: 'none' }}
                                icon={
                                    <ReactSVG
                                        src={disconnect}
                                        className="hover:bg-red-500 hover:opacity-80"
                                        beforeInjection={svg => {
                                            svg.setAttribute('style', 'width: 34px; height: 22px;');
                                        }}
                                    />
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Azure;
