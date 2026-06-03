import React, { useEffect, useState } from 'react';

import { useIdleTimer } from 'react-idle-timer/legacy';

import IdleWarningModal from '@components/molecular/modals/IdleWarningModal';
import { useAppSelector } from '@src/hooks/store';
import { handleLogout } from '@src/services/handleLogout';

const IDLE_TIMEOUT = import.meta.env.VITE_IDLE_TIMEOUT || 0;

type IdleGuardProps = {
    children: React.ReactNode;
};

const IdleGuard = ({ children }: IdleGuardProps) => {
    const authChannel = new BroadcastChannel('authChannel');
    const { isAuthenticated } = useAppSelector(state => state.reducer.auth);
    const [isOpen, setIsOpen] = useState(false);

    const onIdle = () => {
        if (isAuthenticated) {
            setIsOpen(true);
        }
    };

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            localStorage.setItem('idleStamp', `${Date.now()}`);
        } else if (document.visibilityState === 'visible') {
            const idleFrom = localStorage.getItem('idleStamp');
            const idleTime = (Date.now() - Number(idleFrom)) / 1000;
            const totalAllowedIdleTime = (Number(IDLE_TIMEOUT) + 1) * 60; // + 1 represents the timeout of modal
            if (idleTime >= 60 * 60) {
                // 60 * 60 handles 1hr out of site for handle session expired cases
                authChannel.postMessage('logout');
            } else if (idleTime >= totalAllowedIdleTime) {
                handleLogout();
            }
        }
    };

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useIdleTimer({
        disabled: !isAuthenticated,
        timeout: 1000 * 60 * IDLE_TIMEOUT, /// user idle timeout in minutes
        onIdle,
    });

    return (
        <>
            {children}
            <IdleWarningModal
                handleCancel={() => setIsOpen(false)}
                handleSubmit={() => setIsOpen(false)}
                isLoading={false}
                isOpen={isOpen}
            />
        </>
    );
};

export default IdleGuard;
