import { setPage } from '@src/slices/connectSlice';
import { store } from '@store/store';

export const useHangUp = () => {
    const hangUp = async (
        call: any,
        localRef: React.MutableRefObject<HTMLVideoElement | null>,
        remoteRef: React.MutableRefObject<HTMLVideoElement | null>,
        // incomingCall: any,
        setWebcamActive: React.Dispatch<React.SetStateAction<boolean>>,
        setLocalVideoStream: React.Dispatch<React.SetStateAction<any>>,
        setIsReceivingCall: React.Dispatch<React.SetStateAction<boolean>>,
        setConnected: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        try {
            if (call) {
                await call.hangUp();
            }
            // if (incomingCall) incomingCall.reject();
            if (localRef.current) localRef.current.innerHTML = '';
            if (remoteRef.current) remoteRef.current.innerHTML = '';
        } catch (error) {
            // console.log('Error hanging up the call:', error);
        } finally {
            setWebcamActive(false);
            setLocalVideoStream(null);
            store.dispatch(setPage('chat'));
            setIsReceivingCall(false);
            setConnected(false);
        }
    };
    return { hangUp };
};
