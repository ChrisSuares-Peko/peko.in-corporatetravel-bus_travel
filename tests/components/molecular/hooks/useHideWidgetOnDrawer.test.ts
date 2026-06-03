import { renderHook } from '@testing-library/react';
import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';

import useHideWidgetOnDrawer from '@components/molecular/freshChat/hooks/useHideWidgetOnDrawer';

describe('useHideWidgetOnDrawer', () => {
    beforeEach(() => {
        // Clear the global fcWidget object before each test
        (window as any).fcWidget = {
            hide: vi.fn(),
            show: vi.fn(),
        };
    });

    afterEach(() => {
        // Clean up after each test
        vi.resetAllMocks();
    });

    test('should not interact with fcWidget when open is false initially', () => {
        renderHook(() => useHideWidgetOnDrawer(false));

        expect((window as any).fcWidget.hide).not.toHaveBeenCalled();
    });

    test('should call fcWidget.hide when open is true', () => {
        renderHook(() => useHideWidgetOnDrawer(true));

        expect((window as any).fcWidget.hide).toHaveBeenCalled();
    });

    test('should call fcWidget.show on cleanup when open was true', () => {
        const { unmount } = renderHook(() => useHideWidgetOnDrawer(true));

        unmount();
        expect((window as any).fcWidget.show).toHaveBeenCalled();
    });

    test('should call fcWidget.show on cleanup when open changes from true to false', () => {
        const { rerender } = renderHook(({ open }) => useHideWidgetOnDrawer(open), {
            initialProps: { open: true },
        });

        // Initial call
        expect((window as any).fcWidget.hide).toHaveBeenCalled();

        // Change open to false
        rerender({ open: false });

        expect((window as any).fcWidget.show).toHaveBeenCalled();
    });

    test('should not call methods if fcWidget is not present on window', () => {
        (window as any).fcWidget = undefined;

        renderHook(() => useHideWidgetOnDrawer(true));

        expect((window as any).fcWidget?.hide).toBeUndefined();
    });

    test('should not call methods on re-render with same open value', () => {
        const { rerender } = renderHook(({ open }) => useHideWidgetOnDrawer(open), {
            initialProps: { open: false },
        });

        // No method should be called on initial render
        expect((window as any).fcWidget.hide).not.toHaveBeenCalled();
        expect((window as any).fcWidget.show).not.toHaveBeenCalled();

        // Rerender with same open value
        rerender({ open: false });

        expect((window as any).fcWidget.hide).not.toHaveBeenCalled();
        expect((window as any).fcWidget.show).not.toHaveBeenCalled();
    });
});
