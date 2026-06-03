import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import Lottie from 'react-lottie';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { TAB_ID } from '@src/App';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import RegisterStepFive from '../../../components/sections/RegisterStepFive';
import { loginSuccess } from '../../../slices/loginSlice';
import { resetRegisterState } from '../../../slices/registerSlice';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('react-lottie', () => ({
    default: vi.fn(() => <div>Lottie Animation</div>),
}));

vi.mock('../../../slices/loginSlice', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('../../../slices/loginSlice');
    return {
        ...actual,
        loginSuccess: vi.fn(),
    };
});

vi.mock('../../../slices/registerSlice', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('../../../slices/registerSlice');
    return {
        ...actual,
        resetRegisterState: vi.fn(),
    };
});

describe('RegisterStepFive Component', () => {
    const mockDispatch = vi.fn();
    const mockPostMessage = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();

        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useAppSelector as any).mockImplementation((selector: any) =>
            selector({
                reducer: {
                    registration: {
                        loginData: { username: 'testUser', token: 'abc123' },
                        formData: { email: 'test@example.com' },
                    },
                },
            })
        );

        global.BroadcastChannel = vi.fn(() => ({
            postMessage: mockPostMessage,
        })) as any;

        (loginSuccess as any).mockImplementation((payload: any) => ({
            type: 'login/success',
            payload,
        }));

        (resetRegisterState as any).mockReturnValue({
            type: 'register/reset',
        });
    });

    it('renders all elements correctly', () => {
        render(<RegisterStepFive />);

        expect(Lottie).toHaveBeenCalledWith(
            expect.objectContaining({
                options: expect.objectContaining({
                    animationData: expect.any(Object),
                    loop: false,
                    autoplay: true,
                }),
            }),
            {}
        );

        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
            'Thanks for the registration'
        );
        expect(
            screen.getByText(/Your Peko business account has been successfully created/)
        ).toBeInTheDocument();
        expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    });

    it('dispatches loginSuccess and resetRegisterState, and posts message on "Go to Dashboard" click', () => {
        render(<RegisterStepFive />);

        const dashboardButton = screen.getByText('Go to Dashboard');
        fireEvent.click(dashboardButton);

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'login/success',
            payload: { username: 'testUser', token: 'abc123', isAuthenticated: true },
        });

        expect(mockPostMessage).toHaveBeenCalledWith({ type: 'login', tabId: TAB_ID });

        expect(mockDispatch).toHaveBeenCalledWith({ type: 'register/reset' });
    });
});
