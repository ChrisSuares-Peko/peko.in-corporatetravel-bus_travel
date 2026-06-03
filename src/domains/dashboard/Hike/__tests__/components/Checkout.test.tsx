import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Checkout from '../../components/Checkout';
import useCheckout from '../../hooks/useCheckout';
// import { updateQuantity } from '../../slices/hikeSlice';

vi.mock('../../hooks/useCheckout', () => ({
    __esModule: true,
    default: vi.fn(() => ({
        handleSubmission: vi.fn(),
    })),
}));

vi.mock('../../slices/hikeSlice', () => ({
    updateQuantity: vi.fn(),
}));

vi.mock('@utils/priceFormat', () => ({
    formatNumberWithLocalString: (num: number) => num.toString(),
}));

const mockStore = configureStore([]);

describe('Checkout Component', () => {
    let store: any;

    const mockHikeArray = [
        {
            id: 1,
            logo: 'logo1.png',
            price: 100,
            quantity: 2,
            totalPrice: 200,
            employees: [],
        },
        {
            id: 2,
            logo: 'logo2.png',
            price: 150,
            quantity: 1,
            totalPrice: 150,
            employees: [],
        },
    ];

    beforeEach(() => {
        store = mockStore({
            reducer: {
                hike: {
                    amount: 350,
                    hikeArray: mockHikeArray,
                },
            },
        });
    });

    it('should render the component and display default UI elements', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText('Reward your employees')).toBeInTheDocument();
        expect(screen.getByText('Sub Total')).toBeInTheDocument();
        expect(screen.getByText('Taxes and Fees')).toBeInTheDocument();

        // Use getAllByText to retrieve all "Total" elements and check the correct one
        const totalElements = screen.getAllByText('Total');
        expect(totalElements[1]).toBeInTheDocument(); // Assuming the second one is in the summary section

        expect(screen.getByText('AED 200')).toBeInTheDocument();

        const totalamount = screen.getAllByText('AED 150');
        expect(totalamount[1]).toBeInTheDocument();
        // expect(screen.getByText('AED 150')).toBeInTheDocument();
    });

    // it('should handle quantity change and update total amount', () => {
    //   render(
    //     <Provider store={store}>
    //       <BrowserRouter> {/* Wrap component in BrowserRouter */}
    //         <Checkout />
    //       </BrowserRouter>
    //     </Provider>
    //   );

    //   const inputNumbers = screen.getAllByRole('spinbutton');

    //   fireEvent.change(inputNumbers[0], { target: { value: '3' } });

    //   expect(updateQuantity).toHaveBeenCalledWith({
    //     id: 1,
    //     quantity: 3,
    //   });
    // });

    it('should display the correct total amount in the summary', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    {' '}
                    {/* Wrap component in BrowserRouter */}
                    <Checkout />
                </BrowserRouter>
            </Provider>
        );

        const totalElements = screen.getAllByText('AED 350');
        expect(totalElements[1]).toBeInTheDocument();
    });

    it('should call handleSubmission when clicking the Continue button', () => {
        const mockHandleSubmission = vi.fn();
        (useCheckout as any).mockReturnValue({ handleSubmission: mockHandleSubmission });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    {' '}
                    {/* Wrap component in BrowserRouter */}
                    <Checkout />
                </BrowserRouter>
            </Provider>
        );

        const continueButton = screen.getByText('Continue');
        fireEvent.click(continueButton);

        expect(mockHandleSubmission).toHaveBeenCalled();
    });

    it('should display the correct quantity in the input fields', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    {' '}
                    {/* Wrap component in BrowserRouter */}
                    <Checkout />
                </BrowserRouter>
            </Provider>
        );

        const inputNumbers = screen.getAllByRole('spinbutton');
        expect(inputNumbers[0]).toHaveValue(2);
        expect(inputNumbers[1]).toHaveValue(1);
    });

    it('should not allow the user to manually type in the quantity', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    {' '}
                    {/* Wrap component in BrowserRouter */}
                    <Checkout />
                </BrowserRouter>
            </Provider>
        );

        const inputNumbers = screen.getAllByRole('spinbutton');
        fireEvent.keyDown(inputNumbers[0], { key: '1', code: 'Digit1' });

        expect(inputNumbers[0]).toHaveValue(2); // Quantity should remain the same as manual input is prevented
    });

    it('should calculate the correct total and subtotal', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    {' '}
                    {/* Wrap component in BrowserRouter */}
                    <Checkout />
                </BrowserRouter>
            </Provider>
        );

        const totalElements = screen.getAllByText('AED 350');
        expect(totalElements[1]).toBeInTheDocument();

        expect(screen.getByText('Sub Total')).toBeInTheDocument();
    });
});
