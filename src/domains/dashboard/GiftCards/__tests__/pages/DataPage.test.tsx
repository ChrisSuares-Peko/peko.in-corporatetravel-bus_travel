import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import Details from '../../pages/Details';

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

describe('Data Page', () => {
    beforeEach(() => {
        const mockDispatch = vi.fn();

        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useAppSelector as any).mockImplementation((selector: any) =>
            selector({
                reducer: {
                    auth: {
                        role: 'user',
                        id: 12,
                    },
                    subscriptions: { userAccessibleServices: [''] },
                },
            })
        );
    });
    test('renders the Details component', () => {
        render(
            <Router>
                <Details />
            </Router>
        );

        expect(screen.getByTitle(/Enter Amount/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Buy Now/i })).toBeInTheDocument();
    });

    test('renders and switches tabs', () => {
        render(
            <Router>
                <Details />
            </Router>
        );

        const aboutTab = screen.getByText(/About this Gift Card/i);
        expect(aboutTab).toBeInTheDocument();
        expect(aboutTab.parentElement).toHaveClass('ant-tabs-tab-active');

        fireEvent.click(screen.getByText(/Terms & Conditions/i));

        const howToUseTab = screen.getByText(/Terms & Conditions/i);
        expect(howToUseTab.parentElement).toHaveClass('ant-tabs-tab-active');

        expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();

        const oldActiveTab = screen.queryByText(/About this Gift Card/i);
        if (oldActiveTab) {
            expect(oldActiveTab.parentElement).not.toHaveClass('ant-tabs-tab-active');
        }
    });
});
