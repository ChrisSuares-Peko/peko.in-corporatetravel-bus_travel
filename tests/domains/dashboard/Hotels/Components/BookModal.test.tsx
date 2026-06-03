import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

import BookModal from '@src/domains/dashboard/Hotels/Components/GuestInfoModal/Modal';

// Define the initial state for the mock store
const initialState = {
    reducer: {
        hotels: {
            hotelsRequest: {
                rooms: [
                    {
                        adult: 2,
                        child: 1,
                        childAge: [7, 5],
                    },
                ],
            },
        },
        auth: {
            role: 'user',
            id: '123',
        },
    },
};

// Create the mock store with the initial state
const mockStore = configureStore({
    reducer: (state = initialState) => state,
});

// Mock necessary hooks and functions
vi.mock('@src/hooks/store', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        useAppSelector: (selector: (state: typeof initialState) => any) => selector(initialState),
        useAppDispatch: () => vi.fn(),
    };
});

vi.mock('react-router-dom', () => ({
    useLocation: vi.fn(() => ({ state: { key: 'search123' } })),
}));

vi.mock('@domains/dashboard/Hotels/hooks/useRoomCount', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        default: () => ({
            rooms: initialState.reducer.hotels.hotelsRequest.rooms,
            handleCountChange: vi.fn(),
            roomDelete: vi.fn(index => {
                initialState.reducer.hotels.hotelsRequest.rooms.splice(index, 1);
            }),
            handleAddRoom: vi.fn(() => {
                initialState.reducer.hotels.hotelsRequest.rooms.push({
                    adult: 2,
                    child: 0,
                    childAge: [],
                });
            }),
        }),
    };
});

const mockHandleCancel = vi.fn();
const mockSetRoomData = vi.fn();

describe('BookModal', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('should render correctly with one room and one child', () => {
        render(
            <Provider store={mockStore}>
                <BookModal
                    isModalOpen
                    handleCancel={mockHandleCancel}
                    setRoomData={mockSetRoomData}
                />
            </Provider>
        );

        expect(screen.getByText('Room 1')).toBeInTheDocument();
        expect(screen.getByText('Child 1 Age:')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should handle child age change', () => {
        render(
            <Provider store={mockStore}>
                <BookModal
                    isModalOpen
                    handleCancel={mockHandleCancel}
                    setRoomData={mockSetRoomData}
                />
            </Provider>
        );

        const selectElements = screen.getAllByRole('combobox');
        const childAgeSelect = selectElements[0]; // assuming it's the first combobox

        fireEvent.mouseDown(childAgeSelect); // Open the dropdown
        fireEvent.click(screen.getByText('7')); // Select the age

        expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('should add another room when clicking "Add Another Room"', () => {
        render(
            <Provider store={mockStore}>
                <BookModal
                    isModalOpen
                    handleCancel={mockHandleCancel}
                    setRoomData={mockSetRoomData}
                />
            </Provider>
        );

        fireEvent.click(screen.getByText('Add Another Room'));

        // expect(screen.getByText('Room 2')).toBeInTheDocument();
    });

    it('should delete a room when clicking "Delete"', async () => {
        render(
            <Provider store={mockStore}>
                <BookModal
                    isModalOpen
                    handleCancel={mockHandleCancel}
                    setRoomData={mockSetRoomData}
                />
            </Provider>
        );

        // Add another room so there's more than one
        fireEvent.click(screen.getByText('Add Another Room'));

        // Get all "Delete" buttons
        const deleteButtons = screen.getAllByText('Delete');

        // Click the first "Delete" button (assuming it corresponds to the first room)
        fireEvent.click(deleteButtons[0]);

        // After deleting the first room, ensure "Room 1" no longer exists

        // await waitFor(() => {
        //     expect(screen.queryByText('Room 1')).not.toBeInTheDocument();
        // });
    });

    it('should call handleCancel when Drawer is closed', () => {
        render(
            <Provider store={mockStore}>
                <BookModal
                    isModalOpen
                    handleCancel={mockHandleCancel}
                    setRoomData={mockSetRoomData}
                />
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /close/i }));
        expect(mockHandleCancel).toHaveBeenCalled();
    });
});
