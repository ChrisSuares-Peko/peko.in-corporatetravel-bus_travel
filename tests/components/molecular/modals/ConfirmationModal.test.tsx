import { cleanup, fireEvent, queryByText, render, screen } from '@testing-library/react';
import { describe, beforeEach, vi, afterEach, expect, test } from 'vitest';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';

describe('ConfirmationModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });

    test('should render the modal with the given title', () => {
        render(
            <ConfirmationModal
                isOpen
                handleCancel={() => {}}
                title="Confirm Action"
                handleSubmit={() => {}}
                isLoading={false}
            />
        );

        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    });

    test('should show the modal when isOpen is true', () => {
        render(
            <ConfirmationModal
                isOpen
                handleCancel={() => {}}
                title="Confirm Action"
                handleSubmit={() => {}}
                isLoading={false}
            />
        );
        expect(queryByText(document.body, 'Confirm Action')).toBeInTheDocument();
    });

    test('should not show the modal when isOpen is false', () => {
        render(
            <ConfirmationModal
                isOpen={false}
                handleCancel={() => {}}
                title="Confirm Action"
                handleSubmit={() => {}}
                isLoading={false}
            />
        );

        expect(queryByText(document.body, 'Confirm Action')).not.toBeInTheDocument();
    });

    test('should call handleCancel when No button is clicked', () => {
        const mockHandleCancel = vi.fn();
        render(
            <ConfirmationModal
                isOpen
                handleCancel={mockHandleCancel}
                title="Confirm Action"
                handleSubmit={() => {}}
                isLoading={false}
            />
        );

        fireEvent.click(screen.getByText('No'));

        expect(mockHandleCancel).toHaveBeenCalledTimes(1);
    });

    test('should call handleSubmit when Yes button is clicked', () => {
        const mockHandleSubmit = vi.fn();
        render(
            <ConfirmationModal
                isOpen
                handleCancel={() => {}}
                title="Confirm Action"
                handleSubmit={mockHandleSubmit}
                isLoading={false}
            />
        );

        fireEvent.click(screen.getByText('Yes'));

        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    test('should show loading spinner on Yes button when isLoading is true', () => {
        render(
            <ConfirmationModal
                isOpen
                handleCancel={() => {}}
                title="Confirm Action"
                handleSubmit={() => {}}
                isLoading
            />
        );

        const yesButton = screen.getByText('Yes').parentElement;

        expect(yesButton).toHaveClass('ant-btn-loading');

        const loadingSpinner = screen.getByRole('img', { name: /loading/i });
        expect(loadingSpinner).toBeInTheDocument();
    });

    test('should not show loading spinner on Yes button when isLoading is false', () => {
        render(
            <ConfirmationModal
                isOpen
                handleCancel={() => {}}
                title="Confirm Action"
                handleSubmit={() => {}}
                isLoading={false}
            />
        );

        expect(screen.queryByRole('button', { name: 'Yes' })).not.toHaveClass('ant-btn-loading');
    });

    test('should close modal when No button is clicked', () => {
        const mockHandleCancel = vi.fn();
        render(
            <ConfirmationModal
                isOpen
                handleCancel={mockHandleCancel}
                title="Confirm Action"
                handleSubmit={() => {}}
                isLoading={false}
            />
        );

        fireEvent.click(screen.getByText('No'));

        expect(mockHandleCancel).toHaveBeenCalled();
    });
});
