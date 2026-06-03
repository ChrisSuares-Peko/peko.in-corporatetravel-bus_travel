import { fireEvent, render, screen } from '@testing-library/react';
import { describe, beforeEach, vi, test, expect } from 'vitest';

import IFrameModal from '@components/molecular/modals/IFrameModal';

describe('IdleWarningModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render modal when open is true', () => {
        render(<IFrameModal open handleCancel={() => {}} videoUrl="https://example.com/video" />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('should not render modal when open is false', () => {
        render(
            <IFrameModal
                open={false}
                handleCancel={() => {}}
                videoUrl="https://example.com/video"
            />
        );

        expect(screen.queryByRole('dialog')).toBeNull();
    });

    test('should call handleCancel when modal is closed', () => {
        const handleCancel = vi.fn();
        render(
            <IFrameModal open handleCancel={handleCancel} videoUrl="https://example.com/video" />
        );

        fireEvent.click(screen.getByLabelText('Close')); // Clicking the close button
        expect(handleCancel).toHaveBeenCalled();
    });

    test('should display spinner while iframe is loading', () => {
        render(<IFrameModal open handleCancel={() => {}} videoUrl="https://example.com/video" />);

        // Spinner should be visible while iframe is loading
        expect(document.querySelector('.ant-spin')).toBeInTheDocument();
    });

    test('should hide spinner and show iframe once iframe is loaded', () => {
        render(<IFrameModal open handleCancel={() => {}} videoUrl="https://example.com/video" />);

        // Initially, the spinner should be visible
        expect(document.querySelector('.ant-spin')).toBeInTheDocument();

        // Simulate iframe load event
        fireEvent.load(document.querySelector('iframe') as HTMLElement);

        // Spinner should be hidden and iframe should be visible
        expect(document.querySelector('.ant-spin')).toBeNull();
        expect(document.querySelector('iframe')).toBeInTheDocument();
    });

    test('should display the iframe with the correct URL', () => {
        const videoUrl = 'https://example.com/video';
        render(<IFrameModal open handleCancel={() => {}} videoUrl={videoUrl} />);

        expect(screen.getByTitle('')).toHaveAttribute('src', videoUrl);
    });
});
