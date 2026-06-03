import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Formik } from 'formik';
import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import AmountField from '../../components/AmountField';

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

const mockDispatch = vi.fn();

describe('AmountField Component', () => {
    const defaultProps = {
        priceType: 'FLEXI',
        min_price: '100',
        max_price: '1000',
        setFieldValue: vi.fn(),
        isSubmitting: false,
        denominations: [100, 200, 300],
    };

    const renderComponent = (props = {}) =>
        render(
            <Formik initialValues={{ amount: '' }} onSubmit={vi.fn()}>
                <AmountField {...defaultProps} {...props} />
            </Formik>
        );

    beforeEach(() => {
        (useAppDispatch as Mock).mockImplementation(() => mockDispatch);
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });
    it('should render input field and min/max price tags when priceType is FLEXI', () => {
        renderComponent({ priceType: 'FLEXI' });

        expect(screen.getByPlaceholderText('Enter Amount')).toBeInTheDocument();
        expect(screen.getByText(/Min: AED\s*100\.00\s*, Max: AED\s*1,000\.00/)).toBeInTheDocument();
    });

    it('should render PriceTag components when priceType is FIXED', () => {
        renderComponent({ priceType: 'FIXED' });
        expect(screen.queryByPlaceholderText('Enter Amount')).not.toBeInTheDocument();
        expect(screen.getAllByText(/^AED/)).toHaveLength(3); // Matches elements starting with "AED"
    });

    it('should validate that the entered amount is within the minimum and maximum price range', async () => {
        renderComponent({ priceType: 'FLEXI' });

        const input = screen.getByPlaceholderText('Enter Amount');
        fireEvent.change(input, { target: { value: 50 } });

        expect(defaultProps.setFieldValue).toHaveBeenCalledWith('amount', 50);
        expect(screen.getByPlaceholderText('Enter Amount')).toHaveValue('50');
    });

    it('should validate that the entered amount is one of the denominations when priceType is FIXED', async () => {
        renderComponent({ priceType: 'FIXED' });

        const input = screen.getByPlaceholderText('Select Amount');
        fireEvent.change(input, { target: { value: '400' } });

        expect(defaultProps.setFieldValue).toHaveBeenCalledWith('amount', 400);
        expect(screen.getByPlaceholderText('Select Amount')).toHaveValue('400');
    });

    it('should update selectedAmount state when a PriceTag is clicked', () => {
        renderComponent({ priceType: 'FIXED' });

        const priceTags = screen.getAllByText(/^AED/);

        fireEvent.click(priceTags[0]);

        expect(defaultProps.setFieldValue).toHaveBeenCalledWith('amount', 100);
    });

    it('should allow only numeric input in the input field', () => {
        renderComponent({ priceType: 'FLEXI' });

        const input = screen.getByPlaceholderText('Enter Amount');
        fireEvent.keyDown(input, { key: 'A' }); // Attempt to input a letter
        expect(input).toHaveValue('');
        fireEvent.change(input, { target: { value: '123' } }); // Input valid number
        expect(input).toHaveValue('123');
    });

    it('should show an error message if the entered amount is outside the min/max range', () => {
        renderComponent({ priceType: 'FLEXI' });

        const input = screen.getByPlaceholderText('Enter Amount');
        fireEvent.change(input, { target: { value: '50' } });

        expect(showToast).toHaveBeenCalledWith({
            description:
                'Please enter a value between the minimum and maximum prices of the Gift Card',
            variant: 'error',
        });
    });

    it('should not dispatch a toast message if the entered amount is one of the allowed denominations when priceType is FIXED', () => {
        renderComponent({ priceType: 'FIXED', denominations: [100, 200, 300] });

        const input = screen.getByPlaceholderText('Select Amount');
        fireEvent.change(input, { target: { value: '100' } });

        expect(showToast).not.toHaveBeenCalled();
    });

    it('should dispatch a toast message if the entered amount is not one of the allowed denominations when priceType is FIXED', () => {
        renderComponent({ priceType: 'FIXED', denominations: [100, 200, 300] });

        const input = screen.getByPlaceholderText('Select Amount');
        fireEvent.change(input, { target: { value: '500' } });

        expect(showToast).toHaveBeenCalledWith({
            description: 'Please enter denomination values mentioned on Gift Card',
            variant: 'error',
        });
    });
});
