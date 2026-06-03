import { render, screen } from '@testing-library/react';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import ChatNotification from '@src/domains/dashboard/pekoConnect/components/ChatNotification';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { dismissNotification } from '@src/slices/connectSlice';

// Define the type for Ant Design module

type AntdModule = {
    notification: {
        useNotification: () => [
            {
                open: (config: any) => any;
                destroy: (key: string) => void;
            },
            JSX.Element,
        ];
    };
    Avatar: React.FC<any>;
};

// Mock the hooks and modules
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('antd', async importOriginal => {
    const actual = (await importOriginal()) as AntdModule;
    const openMock = vi.fn();
    const destroyMock = vi.fn();

    return {
        ...actual,
        notification: {
            ...actual.notification,
            useNotification: () => [
                {
                    open: openMock.mockImplementation(config => ({
                        ...config,
                        destroy: destroyMock,
                        onClick: () => {
                            console.log('onClick handler called');
                        },
                    })),
                    destroy: destroyMock,
                },
                <div data-testid="context-holder" />,
            ],
        },
        Avatar: (props: any) => <div data-testid="avatar" {...props} />,
    };
});
describe('ChatNotification Component', () => {
    const mockDispatch = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useNavigate as any).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should render context holder', () => {
        (useAppSelector as any).mockReturnValue({ notification: null, profiles: [] });
        render(<ChatNotification />);
        expect(screen.getByTestId('context-holder')).toBeInTheDocument();
    });

    it('should not show notification if no new notification', () => {
        (useAppSelector as any).mockReturnValue({ notification: null, profiles: [] });
        render(<ChatNotification />);
        const [api] = notification.useNotification();
        expect(api.open).not.toHaveBeenCalled(); // Changed to check that open is not called
    });

    it('should show notification with correct content', () => {
        const newNotification = {
            chatId: '123',
            sender: { communicationUserId: 'user123' },
            metadata: { type: 'message' },
            message: 'Hello',
            senderDisplayName: 'John Doe',
            threadId: 'thread123',
        };
        const profiles = [{ acs_user_id: 'user123', name: 'John Doe', logo: 'image-url' }];
        (useAppSelector as any).mockReturnValue({ notification: newNotification, profiles });
        render(<ChatNotification />);
        const [api] = notification.useNotification();
        expect(api.open).toHaveBeenCalledWith(
            expect.objectContaining({
                key: '123',
                description: expect.anything(),
            })
        );
    });

    it('should navigate and dismiss notification on click', () => {
        const newNotification = {
            chatId: '123',
            sender: { communicationUserId: 'user123' },
            metadata: { type: 'message' },
            message: 'Hello',
            senderDisplayName: 'John Doe',
            threadId: 'thread123',
        };

        (useAppSelector as any).mockReturnValue({ notification: newNotification, profiles: [] });
        render(<ChatNotification />);

        // Ensure notification is open
        const [api] = notification.useNotification();
        expect(api.open).toHaveBeenCalled();

        // Directly invoke the onClick handler from the mock
        const openCall = (api.open as any).mock.calls[0][0];
        openCall.onClick();

        // Verify navigation and destruction
        expect(mockNavigate).toHaveBeenCalledWith(
            `/more-services/peko-connect?id=${newNotification.threadId}`
        );
        expect(api.destroy).toHaveBeenCalledWith('123');
    });

    it('should dispatch dismissNotification on close', () => {
        const newNotification = {
            chatId: '123',
            sender: { communicationUserId: 'user123' },
            metadata: { type: 'message' },
            message: 'Hello',
            senderDisplayName: 'John Doe',
            threadId: 'thread123',
        };

        (useAppSelector as any).mockReturnValue({ notification: newNotification, profiles: [] });
        const [api] = notification.useNotification();
        // Mock implementation to include onClose handler
        (api.open as any).mockImplementation((config: any) => {
            if (config.onClose) {
                config.onClose();
            }
            return {
                destroy: vi.fn(),
            };
        });

        render(<ChatNotification />);

        // Verify open is called correctly
        expect(api.open as any).toHaveBeenCalled();

        // Simulate the onClose event
        const openCall = (api.open as any).mock.calls[0][0];
        if (openCall.onClose) openCall.onClose();

        // Verify that dismissNotification is dispatched
        expect(mockDispatch).toHaveBeenCalledWith(dismissNotification());
    });
});
