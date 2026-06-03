import { cleanup, render, screen } from '@testing-library/react';
import { it, expect, describe, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

import DrawerModal from '@src/components/atomic/DrawerModal';

describe('Drawer Modal', () => {
    afterEach(() => {
        cleanup();
    });

    it('should render the DrawerModal when open', () => {
        render(
            <DrawerModal open handleCancel={() => {}} modalTitle="Test Modal">
                <div>Modal Content</div>
            </DrawerModal>
        );

        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should not render the DrawerModal when closed', () => {
        const { container } = render(
            <DrawerModal open={false} handleCancel={() => {}} modalTitle="Test Modal">
                <div>Modal Content</div>
            </DrawerModal>
        );

        expect(container.querySelector('.ant-drawer')).toBeNull();
    });

    it('should render the close icon when closeIcon is true', () => {
        render(
            <DrawerModal open handleCancel={() => {}} modalTitle="Test Modal" closeIcon>
                <div>Modal Content</div>
            </DrawerModal>
        );

        expect(screen.getByRole('img', { name: /close/i })).toBeInTheDocument();
    });

    it('should not render the close icon when closeIcon is false', () => {
        render(
            <DrawerModal open handleCancel={() => {}} modalTitle="Test Modal">
                <div>Modal Content</div>
            </DrawerModal>
        );

        expect(screen.queryByRole('img', { name: /close/i })).toBeNull();
    });

    it('should render the footer when provided', () => {
        render(
            <DrawerModal
                open
                handleCancel={() => {}}
                modalTitle="Test Modal"
                footer={<div>Custom Footer</div>}
            >
                <div>Modal Content</div>
            </DrawerModal>
        );

        expect(screen.getByText('Custom Footer')).toBeInTheDocument();
    });

    it('should not render the footer when it is null', () => {
        render(
            <DrawerModal open handleCancel={() => {}} modalTitle="Test Modal" footer={null}>
                <div>Modal Content</div>
            </DrawerModal>
        );

        expect(screen.queryByText('Custom Footer')).toBeNull();
    });

    it('should apply custom width to the drawer', () => {
        const customWidth = 600;

        render(
            <DrawerModal open handleCancel={() => {}} modalTitle="Test Modal" width={customWidth}>
                <div>Modal Content</div>
            </DrawerModal>
        );

        // Query the drawer element based on a specific Ant Design class
        const drawer = document.querySelector('.ant-drawer-content-wrapper');

        // Verify that the drawer exists and check its computed style
        if (drawer) {
            const drawerStyle = window.getComputedStyle(drawer);
            expect(drawerStyle.width).toBe(`${customWidth}px`);
        } else {
            throw new Error('Drawer element not found');
        }
    });
});
