import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, beforeEach, vi, test, expect } from 'vitest';

import ImageCropModal from '@components/molecular/modals/ImageCropModal';

vi.mock('@components/molecular/modals/ImageCropModal', async importOriginal => {
    const actual: {} = await importOriginal();
    return {
        ...actual,
        getCroppedImg: vi.fn(() =>
            Promise.resolve({ base64: 'mockBase64', dataUrl: 'mockDataUrl' })
        ),
    };
});

describe('ImageCropModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render modal when isVisible is true', () => {
        render(
            <ImageCropModal
                isVisible
                onClose={() => {}}
                handleImage={() => {}}
                imgSrc="data:image/jpeg;base64,..."
            />
        );
        expect(document.querySelector('.ant-modal')).toBeInTheDocument();
    });

    test('should not render modal when isVisible is false', () => {
        render(
            <ImageCropModal
                isVisible={false}
                onClose={() => {}}
                handleImage={() => {}}
                imgSrc="data:image/jpeg;base64,..."
            />
        );
        expect(document.querySelector('.ant-modal')).toBeNull();
    });

    test('should call onClose when the modal is closed', () => {
        const onClose = vi.fn();
        render(
            <ImageCropModal
                isVisible
                onClose={onClose}
                handleImage={() => {}}
                imgSrc="data:image/jpeg;base64,..."
            />
        );
        screen.debug();
        fireEvent.click(screen.getByText('Cancel'));
        expect(onClose).toHaveBeenCalled();
    });

    // test('should call handleImage with cropped image data when Submit is clicked', async () => {
    //     // Create mock functions
    //     const handleImage = vi.fn();
    //     const onClose = vi.fn();

    //     render(
    //         <ImageCropModal
    //             isVisible
    //             onClose={onClose}
    //             handleImage={handleImage}
    //             imgSrc={Icon}
    //         />
    //     );
    //     fireEvent.click(screen.getByText('Submit'));

    //     await new Promise(resolve => setTimeout(resolve, 1000));

    //     await waitFor(() => {
    //         expect(handleImage).toHaveBeenCalled();
    //     });

    //     expect(onClose).toHaveBeenCalled();
    // });

    // test('should correctly handle getCroppedImg and makeClientCrop', async () => {
    //     const handleImage = vi.fn();
    //     const { container } = render(
    //         <ImageCropModal
    //             isVisible
    //             onClose={() => {}}
    //             handleImage={handleImage}
    //             imgSrc="data:image/jpeg;base64,..." // Use a valid image source here
    //         />
    //     );

    //     // Simulate image load
    //     const image = container.querySelector('img');
    //     if (image) {
    //         fireEvent.load(image);
    //     }

    //     // Simulate cropping and submit
    //     fireEvent.click(screen.getByText('Submit')); // Ensure this is the exact text in the button

    //     await waitFor(() => {
    //         expect(handleImage).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    //     });
    // });
});
