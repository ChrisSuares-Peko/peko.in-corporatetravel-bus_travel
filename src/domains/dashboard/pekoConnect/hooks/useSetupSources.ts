import {
    CallClient,
    VideoStreamRenderer,
    LocalVideoStream,
    RemoteVideoStream,
} from '@azure/communication-calling';

import { setPage } from '@src/slices/connectSlice';
import { store } from '@store/store';

export const useSetupSouces = () => {
    const setupSources = async (
        mode: string,
        calleeAcsUserId: string,
        localRef: React.MutableRefObject<HTMLVideoElement | null>,
        remoteRef: React.MutableRefObject<HTMLVideoElement | null>,
        callAgent: any,
        call: any,
        incomingCall: any,
        setWebcamActive: React.Dispatch<React.SetStateAction<boolean>>,
        setLocalStream: React.Dispatch<React.SetStateAction<any>>,
        setIsReceivingCall: React.Dispatch<React.SetStateAction<boolean>>,
        setCall: React.Dispatch<React.SetStateAction<any>>,
        setConnected: React.Dispatch<React.SetStateAction<boolean>>,
        setLocalVideoStream: React.Dispatch<React.SetStateAction<any>>,
        setLocalVideoStreamRenderer: React.Dispatch<React.SetStateAction<any>>,
        page: string
    ): Promise<any> => {
        try {
            if (!callAgent) {
                throw new Error('CallAgent is not defined.');
            }

            const callClient = new CallClient();
            const deviceManager = await callClient.getDeviceManager();
            await deviceManager.askDevicePermission({ video: page === 'video', audio: true });

            const createLocalVideoStream = async (type: string) => {
                if (type === 'audio') return null;
                const cameras = await deviceManager.getCameras();
                if (cameras.length > 0) {
                    const camera = cameras[0];
                    return new LocalVideoStream(camera);
                }
                return null;
            };

            setWebcamActive(page === 'video');

            const displayLocalVideoStream = async (stream: LocalVideoStream) => {
                try {
                    const renderer = new VideoStreamRenderer(stream);
                    setLocalVideoStreamRenderer(renderer);
                    const view = await renderer.createView();
                    if (localRef.current) {
                        if (localRef.current.children.length === 0) {
                            localRef.current.appendChild(view.target);
                        }
                    }
                } catch (error) {
                    console.error('Error displaying local video stream:', error);
                }
            };

            const subscribeToRemoteParticipant = (remoteParticipant: any) => {
                try {
                    remoteParticipant.on('stateChanged', () => {
                        // console.log(Remote participant state changed: ${remoteParticipant.state});
                    });

                    remoteParticipant.videoStreams.forEach(
                        (remoteVideoStream: RemoteVideoStream) => {
                            subscribeToRemoteVideoStream(remoteVideoStream);
                        }
                    );
                    remoteParticipant.on('videoStreamsUpdated', (e: any) => {
                        e.added.forEach((remoteVideoStream: RemoteVideoStream) => {
                            subscribeToRemoteVideoStream(remoteVideoStream);
                        });
                        e.removed.forEach(() => {
                            // console.log('Remote participant video stream was removed.');
                        });
                    });
                } catch (error) {
                    console.error('Error subscribing to remote participant:', error);
                }
            };

            const subscribeToRemoteVideoStream = async (remoteVideoStream: RemoteVideoStream) => {
                const renderer = new VideoStreamRenderer(remoteVideoStream);
                let view: any;
                const remoteVideoContainer = document.createElement('div');

                remoteVideoContainer.className = 'remote-video-container';

                const loadingSpinner = document.createElement('div');
                loadingSpinner.className = 'loading-spinner';

                remoteVideoStream.on('isReceivingChanged', () => {
                    try {
                        if (remoteVideoStream.isAvailable) {
                            const { isReceiving } = remoteVideoStream;
                            const isLoadingSpinnerActive =
                                remoteVideoContainer.contains(loadingSpinner);
                            if (!isReceiving && !isLoadingSpinnerActive) {
                                remoteVideoContainer.appendChild(loadingSpinner);
                            } else if (isReceiving && isLoadingSpinnerActive) {
                                remoteVideoContainer.removeChild(loadingSpinner);
                            }
                        }
                    } catch (e) {
                        console.error(e);
                    }
                });

                const createView = async () => {
                    view = await renderer.createView();
                    remoteVideoContainer.appendChild(view.target);
                    if (remoteRef.current) {
                        remoteRef.current.appendChild(remoteVideoContainer);
                    }
                };

                remoteVideoStream.on('isAvailableChanged', async () => {
                    try {
                        if (remoteVideoStream.isAvailable) {
                            await createView();
                        } else {
                            view.dispose();
                            if (remoteRef.current)
                                remoteRef.current.removeChild(remoteVideoContainer);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                });

                if (remoteVideoStream.isAvailable) {
                    try {
                        await createView();
                    } catch (e) {
                        console.error(e);
                    }
                }
            };

            const hangUp = async () => {
                try {
                    if (call) {
                        await call.hangUp();
                    }
                    if (incomingCall) incomingCall = undefined;
                    if (localRef.current) localRef.current.innerHTML = '';
                    if (remoteRef.current) remoteRef.current.innerHTML = '';
                    setWebcamActive(false);
                    setLocalVideoStream(null);
                    setLocalVideoStreamRenderer(null);
                    store.dispatch(setPage('chat'));
                    setIsReceivingCall(false);
                } catch (error) {
                    console.error('Error hanging up the call:', error);
                }
            };

            const subscribeToCall = (newCall: any) => {
                try {
                    newCall.on('idChanged', () => {
                        // console.log(Call Id changed: ${newCall.id});
                    });
                    // console.log('newCall.direction', newCall.direction)

                    newCall.on('stateChanged', async () => {
                        if (newCall.state === 'Connected') {
                            setConnected(true);
                        } else if (newCall.state === 'Disconnected') {
                            store.dispatch(setPage('chat'));
                            setConnected(false);
                            await hangUp();
                        }
                    });

                    newCall.on('isLocalVideoStartedChanged', () => {
                        // console.log(isLocalVideoStarted changed: ${newCall.isLocalVideoStarted});
                    });
                    // console.log(isLocalVideoStarted: ${newCall.isLocalVideoStarted});
                    newCall.localVideoStreams.forEach(async (lvs: LocalVideoStream) => {
                        setLocalVideoStream(lvs);
                        await displayLocalVideoStream(lvs);
                    });
                    newCall.on('localVideoStreamsUpdated', (e: any) => {
                        e.added.forEach(async (lvs: LocalVideoStream) => {
                            setLocalVideoStream(lvs);
                            await displayLocalVideoStream(lvs);
                        });
                        // e.removed.forEach(() => {
                        //     removeLocalVideoStream();
                        // });
                    });

                    newCall.remoteParticipants.forEach((remoteParticipant: any) => {
                        subscribeToRemoteParticipant(remoteParticipant);
                    });
                    newCall.on('remoteParticipantsUpdated', (e: any) => {
                        e.added.forEach((remoteParticipant: any) => {
                            subscribeToRemoteParticipant(remoteParticipant);
                        });
                        e.removed.forEach(() => {
                            // console.log('Remote participant removed from the call.');
                        });
                    });
                } catch (error) {
                    // console.log('Error subscribing to call:', error);
                }
            };

            if (mode === 'create') {
                const localStream = await createLocalVideoStream(page);
                const videoOptions = localStream ? { localVideoStreams: [localStream] } : undefined;
                const newCall = callAgent.startCall([{ communicationUserId: calleeAcsUserId }], {
                    videoOptions,
                });
                subscribeToCall(newCall);
                setCall(newCall);
            } else if (mode === 'join') {
                const localStream = await createLocalVideoStream(page);
                const videoOptions = localStream ? { localVideoStreams: [localStream] } : undefined;
                const newCall = await incomingCall.accept({ videoOptions });
                subscribeToCall(newCall);
                setCall(newCall);
            }

            // if (call) {
            //     if (call.state === 'Disconnected') {
            //         await hangUp(
            //             call,
            //             localRef,
            //             remoteRef,
            //             incomingCall,
            //             setWebcamActive,
            //             setLocalStream,
            //             setPage,
            //             setIsReceivingCall
            //         );
            //     }
            // }
        } catch (error) {
            console.error('Error in setupSources:', error);
            setIsReceivingCall(false);
            // Handle error, e.g., display an error message to the user
        }
    };

    const addVideoToCall = async (deviceManager: any) => {
        const cameras = await deviceManager.getCameras();
        if (cameras.length > 0) {
            const camera = cameras[0]; // Select the first camera
            const localVideoStream = new LocalVideoStream(camera);
            return localVideoStream;
        }
        return null;
    };

    return { setupSources, addVideoToCall };
};
