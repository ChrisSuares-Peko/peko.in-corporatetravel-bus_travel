import { cleanup, render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import Spinner from '@components/molecular/loaders/Spinner';
import { useAppSelector } from '@src/hooks/store';

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

describe('Spinner Component', () => {
    beforeEach(() => {
        (useAppSelector as any).mockImplementation((selector: any) =>
            selector({
                reducer: {
                    loader: {
                        isLoading: true,
                    },
                },
            })
        );
        cleanup();
    });

    test('renders Spinner component without crashing', () => {
        (useAppSelector as any).mockImplementation((selector: any) =>
            selector({
                reducer: {
                    loader: {
                        isLoading: false,
                    },
                },
            })
        );
        render(<Spinner />);
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    test('renders spinner when isLoading is true', () => {
        render(<Spinner />);
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
        expect(screen.getByTestId('spinner')).toBeVisible();
    });

    test('renders spinner with large size when size prop is large', () => {
        render(<Spinner size="large" />);
        const spinner = screen.getByTestId('spinner').querySelector('.ant-spin');
        expect(spinner).toHaveClass('ant-spin-lg');
    });

    test('renders spinner with small size when size prop is small', () => {
        render(<Spinner size="small" />);
        const spinner = screen.getByTestId('spinner').querySelector('.ant-spin');
        expect(spinner).toHaveClass('ant-spin-sm');
    });
});
