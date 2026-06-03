import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';

import ViewMore from '@components/molecular/view-more/ViewMore';

describe('ShowFile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });

    test('renders component with items', () => {
        const items = [{ label: 'Item 1', path: '/path1' }];
        render(<ViewMore list={items} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('opens and closes dropdown on button click', async () => {
        const items = [{ label: 'Item 1', path: '/path1' }];
        render(
            <MemoryRouter>
                <ViewMore list={items} />
            </MemoryRouter>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => expect(screen.getByText('Item 1')).toBeVisible());

        fireEvent.click(button);

        await waitFor(() => expect(screen.getByText('Item 1')).not.toBeVisible());
    });

    test('renders dropdown menu items correctly', () => {
        const items = [
            { label: 'Item 1', path: '/path1' },
            { label: 'Item 2', action: vi.fn() },
        ];
        render(
            <MemoryRouter>
                <ViewMore list={items} />
            </MemoryRouter>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    test('navigates to correct URL on link click', () => {
        const items = [{ label: 'Item 1', path: '/path1' }];
        render(
            <MemoryRouter>
                <ViewMore list={items} />
                <Routes>
                    <Route path="/path1" element={<div>Path 1</div>} />
                </Routes>
            </MemoryRouter>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        const link = screen.getByText('Item 1');
        fireEvent.click(link);

        expect(screen.getByText('Path 1')).toBeInTheDocument();
    });

    test('calls action function when action item is clicked', () => {
        const mockAction = vi.fn();
        const items = [{ label: 'Action Item', action: mockAction }];
        render(<ViewMore list={items} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        const actionItem = screen.getByText('Action Item');
        fireEvent.click(actionItem);

        expect(mockAction).toHaveBeenCalledTimes(1);
    });

    test('dropdown state updates correctly', async () => {
        const items = [{ label: 'Item 1', path: '/path1' }];
        render(
            <MemoryRouter>
                <ViewMore list={items} />
            </MemoryRouter>
        );
        screen.debug();
        expect(screen.queryByText('Item 1')).not.toBeInTheDocument();

        // Open the dropdown by clicking the icon/button
        fireEvent.click(screen.getByRole('button'));

        // Wait for the dropdown to be in the document
        const dropdownItem = await screen.findByText('Item 1');

        // Check that the dropdown item is visible
        await waitFor(() => {
            expect(dropdownItem).toBeVisible();
        });

        // Close the dropdown by clicking the icon/button again
        fireEvent.click(screen.getByRole('button'));

        // The dropdown should be closed, and 'Item 1' should not be visible
        await waitFor(() => {
            expect(screen.queryByText('Item 1')).not.toBeVisible();
        });
    });

    test('toggles dropdown with keyboard', async () => {
        const items = [{ label: 'Item 1', path: '/path1' }];

        render(
            <MemoryRouter>
                <ViewMore list={items} />
            </MemoryRouter>
        );

        const button = screen.getByRole('button');

        // Simulate pressing 'Enter' to open the dropdown
        fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

        // Wait for the dropdown item to be visible
        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeVisible();
        });

        // Simulate pressing 'Enter' again to close the dropdown
        fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

        // Wait for the dropdown item to not be visible
        await waitFor(() => {
            expect(screen.queryByText('Item 1')).not.toBeVisible();
        });
    });
});
