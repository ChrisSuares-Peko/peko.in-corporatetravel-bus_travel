import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

import Rooms from '@src/domains/dashboard/Hotels/Components/ViewHotel/Rooms';

// Define initial state for the mock store
const initialState = {
    reducer: {
        hotels: {
            hotelsRequest: {
                rooms: [
                    {
                        roomIndex: 1,
                        adult: 2,
                        child: 1,
                        childAge: [5],
                    },
                ],
            },
            roomResponse: [],
            keyData: {},
        },
    },
};

// Create the mock store with the initial state
const mockStore = configureStore({
    reducer: (state = initialState) => state,
});

describe('Rooms Component', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders room information correctly', () => {
        const filteredRoomInfo = [
            {
                roomKey: '1',
                roomIndex: 1,
                roomId: '1',
                roomTypeDesc: 'Standard Room',
                roomRate: { netAmount: 200, rates: [{ name: 'DailyRate' }] },
                ratePlan: { availableStatus: 'Available', fixedCombo: false },
            },
            {
                roomKey: '2',
                roomIndex: 2,
                roomId: '2',
                roomTypeDesc: 'Deluxe Room',
                roomRate: { netAmount: 300, rates: [{ name: 'WeeklyRate' }] },
                ratePlan: { availableStatus: 'Not Available', fixedCombo: true },
            },
        ];

        const handleRoomSelect = vi.fn();
        const roomData = { roomIndex: 1, adult: 2, child: 1 };
        const reset = false;

        render(
            <Provider store={mockStore}>
                <Router>
                    <Rooms
                        filteredRoomInfo={filteredRoomInfo}
                        roomData={roomData}
                        handleRoomSelect={handleRoomSelect}
                        reset={reset}
                    />
                </Router>
            </Provider>
        );

        // Check that room information is rendered correctly
        expect(screen.getByText('Standard Room')).toBeInTheDocument();
        expect(screen.getByText('Day wise rate')).toBeInTheDocument();
        expect(screen.getByText('Available')).toBeInTheDocument();
        expect(screen.getByText('AED 200')).toBeInTheDocument();

        expect(screen.getByText('Deluxe Room')).toBeInTheDocument();
        expect(screen.getByText('Not Available')).toBeInTheDocument();
        expect(screen.getByText('Combined Room')).toBeInTheDocument();
        expect(screen.getByText('AED 300')).toBeInTheDocument();
    });

    it('handles room selection correctly', () => {
        const filteredRoomInfo = [
            {
                roomKey: '1',
                roomIndex: 1,
                roomId: '1',
                roomTypeDesc: 'Standard Room',
                roomRate: { netAmount: 200, rates: [{ name: 'DailyRate' }] },
                ratePlan: { availableStatus: 'Available', fixedCombo: false },
            },
        ];

        const handleRoomSelect = vi.fn();
        const roomData = { roomIndex: 1, adult: 2, child: 1 };
        const reset = false;

        render(
            <Provider store={mockStore}>
                <Router>
                    <Rooms
                        filteredRoomInfo={filteredRoomInfo}
                        roomData={roomData}
                        handleRoomSelect={handleRoomSelect}
                        reset={reset}
                    />
                </Router>
            </Provider>
        );

        // Query the radio input by its role
        const radio = screen.getByRole('radio');

        // Simulate selecting a room
        fireEvent.click(radio);

        // Check that the handleRoomSelect function was called with the correct arguments
        expect(handleRoomSelect).toHaveBeenCalledWith(
            filteredRoomInfo[0].roomIndex,
            filteredRoomInfo[0].roomId,
            filteredRoomInfo[0].roomTypeDesc,
            filteredRoomInfo[0].roomRate.netAmount,
            filteredRoomInfo[0].roomKey,
            { isAdd: true }
        );
    });

    it('does not reset selected state on reset prop change when no reset logic exists in the component', () => {
        const filteredRoomInfo = [
            {
                roomKey: '1',
                roomIndex: 1,
                roomId: '1',
                roomTypeDesc: 'Standard Room',
                roomRate: { netAmount: 200, rates: [{ name: 'DailyRate' }] },
                ratePlan: { availableStatus: 'Available', fixedCombo: false },
            },
        ];

        const handleRoomSelect = vi.fn();
        const roomData = { roomIndex: 1, adult: 2, child: 1 };
        let reset = false;

        const { rerender } = render(
            <Provider store={mockStore}>
                <Router>
                    <Rooms
                        filteredRoomInfo={filteredRoomInfo}
                        roomData={roomData}
                        handleRoomSelect={handleRoomSelect}
                        reset={reset}
                    />
                </Router>
            </Provider>
        );

        // Simulate selecting a room
        const radio = screen.getByRole('radio');
        fireEvent.click(radio);
        expect(radio).toBeChecked();

        // Now set reset to true and re-render
        reset = true;
        rerender(
            <Provider store={mockStore}>
                <Router>
                    <Rooms
                        filteredRoomInfo={filteredRoomInfo}
                        roomData={roomData}
                        handleRoomSelect={handleRoomSelect}
                        reset={reset}
                    />
                </Router>
            </Provider>
        );

        // Check that the selected state is not reset
        expect(radio).toBeChecked();
    });
});
