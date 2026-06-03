import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';

import IdleWarningModal from '@components/molecular/modals/IdleWarningModal';

vi.mock('@src/services/handleLogout');

describe('IdleWarningModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should render modal when isOpen is true', () => {
        render(
            <IdleWarningModal
                isOpen
                handleCancel={vi.fn()}
                handleSubmit={vi.fn()}
                isLoading={false}
            />
        );

        expect(screen.getByText('Still with us?')).toBeInTheDocument();
        expect(
            screen.getByText(
                "We value your privacy, and you've been inactive for a while. We will log you out in the following seconds unless you confirm you're still with us."
            )
        ).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
        render(
            <IdleWarningModal
                isOpen={false}
                handleCancel={vi.fn()}
                handleSubmit={vi.fn()}
                isLoading={false}
            />
        );

        expect(screen.queryByText('Still with us?')).not.toBeInTheDocument();
    });

    it('should call handleCancel and reset counter when "Stay with us" is clicked', () => {
        const handleCancel = vi.fn();
        render(
            <IdleWarningModal
                isOpen
                handleCancel={handleCancel}
                handleSubmit={vi.fn()}
                isLoading={false}
            />
        );

        fireEvent.click(screen.getByText('Stay with us'));

        expect(handleCancel).toHaveBeenCalledTimes(1);
    });
    // it('should call handleLogout when countdown reaches 0', async () => {
    //     const mockHandleLogout = vi.fn();
    //     (handleLogout as Mock).mockImplementation(mockHandleLogout);
    //     const handleCancel = vi.fn();
    //     const handleSubmit = vi.fn();
    //     render(
    //         <IdleWarningModal
    //             isOpen
    //             handleCancel={handleCancel}
    //             handleSubmit={handleSubmit}
    //             isLoading={false}
    //         />
    //     );

    //     // Fast forward time until the countdown reaches 0
    //     act(() => {
    //         vi.advanceTimersByTime(60000); // 60 seconds
    //     });
    //     screen.debug();
    //     await waitFor(() => {
    //         expect(mockHandleLogout).toHaveBeenCalled();
    //     });
    // },1000);

    //       it('should call handleLogout when "Logout" button is clicked', async () => {
    //         const mockHandleLogout = vi.fn();
    //             (handleLogout as Mock).mockImplementation(mockHandleLogout);
    //         render(<IdleWarningModal isOpen handleCancel={() => {}} handleSubmit={() => {}} isLoading={false} />);
    // screen.debug()
    //         fireEvent.click(screen.getByText('Logout'));

    //         await waitFor(() => {
    //             expect(mockHandleLogout).toHaveBeenCalled();
    //         });
    //     },1000);

    it('should display the correct countdown time', async () => {
        render(
            <IdleWarningModal
                isOpen
                handleCancel={vi.fn()}
                handleSubmit={vi.fn()}
                isLoading={false}
            />
        );

        expect(screen.getByText('01:00')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(screen.getByText('00:58')).toBeInTheDocument();
    });
});
