import React, { useEffect, useState } from 'react';

import { CallClient, CallAgent, DeviceManager, Call } from '@azure/communication-calling';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { setPage } from '@src/slices/connectSlice';

import Calling from './Calling';

interface AudioAzureProps {
    callAgent: CallAgent | null;
    setIsReceivingCall: React.Dispatch<React.SetStateAction<boolean>>;
    incomingCall: any; // Define a proper type if you know the structure
}

const AudioAzure: React.FC<AudioAzureProps> = ({ callAgent, setIsReceivingCall, incomingCall }) => {
    const { acsUserId: calleeAcsUserId, mode } = useAppSelector(state => state.reducer.chat);
    const dispatch = useAppDispatch();
    const [deviceManager, setDeviceManager] = useState<DeviceManager | null>(null);
    const [isCallActive, setIsCallActive] = useState<boolean>(false);
    const [call, setCall] = useState<Call | null>(null);
    const [microphoneMuted, setMicrophoneMuted] = useState(false);

    useEffect(() => {
        const initializeCall = async () => {
            try {
                if (!callAgent) return;
                const callClient = new CallClient();

                // Set up the device manager and permissions
                const manager = await callClient.getDeviceManager();
                await manager.askDevicePermission({ audio: true, video: false });
                setDeviceManager(manager);

                // Start the call immediately
                const newCall = callAgent.startCall([{ communicationUserId: calleeAcsUserId }], {});
                setCall(newCall);
                setIsCallActive(true);
            } catch (error) {
                window.alert('Please submit a valid token!');
                console.error('Error initializing call agent:', error);
            }
        };

        initializeCall();

        // Cleanup function to remove event listeners and hang up the call
        return () => {
            if (call) {
                call.hangUp().catch(err => console.error('Error hanging up:', err));
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callAgent, calleeAcsUserId]);

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
        if (call) {
            await call.hangUp();
        }
        dispatch(setPage('chat'));
        setIsCallActive(false);
    };
    return (
        <>
            {!isCallActive && <Calling mode={mode} hangUp={handleHangUp} />}

            <p>{isCallActive ? 'Call in progress...' : 'Ready to start call.'}</p>
        </>
    );
};

export default AudioAzure;
