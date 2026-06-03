import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Formik } from 'formik';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

import BuyForm from '../../components/BuyForm';
import { setFormData } from '../../slices/checkoutSlice';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: () => vi.fn(),
}));

vi.mock('@src/hooks/useSubscriptionCheck', () => ({
    default: () => true,
}));

vi.mock('../../slices/checkoutSlice', () => ({
    setFormData: vi.fn(),
    setProductData: vi.fn(),
}));

describe('BuyForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });
    const giftCard = {
        id: 123,
        product_id: '456',
        brand_code: 'TEST_BRAND',
        name: 'Test Card',
        image: 'test-image.png',
        minDenomination: '10',
        maxDenomination: '50',
        priceType: 'FIXED',
        denominations: [10, 20, 50],
        activation_fee: null,
        currency: 'USD',
        description: 'A test gift card',
        redemption_instructions: 'Instructions for redemption',
        status: 1,
        createdAt: '2024-08-01T00:00:00Z',
        updatedAt: '2024-08-01T00:00:00Z',
        serviceOperatorId: 789,
        serviceOperator: { accessKey: 'example-access-key' },
    };
    const productData = {
        mainGiftCard: giftCard,
        relatedGiftCards: [giftCard],
    };

    it('should render form with product data', () => {
        render(
            <MemoryRouter>
                <Formik initialValues={{ amount: '', quantity: '1' }} onSubmit={() => {}}>
                    <BuyForm productData={productData} />
                </Formik>
            </MemoryRouter>
        );

        expect(screen.getByText('Test Card')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Select Amount')).toBeInTheDocument();
        expect(screen.getByTitle('No. of Cards:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Buy Now/i })).toBeInTheDocument();
    });

    it('should handle form submission with valid data', async () => {
        const setFormDataMock = vi.fn();
        vi.mocked(setFormData).mockImplementation(setFormDataMock);

        const { container } = render(
            <MemoryRouter>
                <Formik initialValues={{ amount: '20', quantity: '1' }} onSubmit={() => {}}>
                    <BuyForm productData={productData} />
                </Formik>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Select Amount'), { target: { value: '20' } });
        const spinbutton = container.querySelector('.ant-input-number-input');
        if (spinbutton) fireEvent.change(spinbutton, { target: { value: '1' } });
        fireEvent.click(screen.getByRole('button', { name: /Buy Now/i }));

        await waitFor(() => {
            expect(setFormDataMock).toHaveBeenCalledWith({
                amount: '20',
                quantity: '1',
                orderType: 'buyForOther',
            });
        });
    });

    it('should update order type and render relevant fields', () => {
        render(
            <MemoryRouter>
                <Formik initialValues={{ amount: '', quantity: '1' }} onSubmit={() => {}}>
                    <BuyForm productData={productData} />
                </Formik>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByLabelText('Bulk Purchase'));

        expect(screen.getByTitle('No. of Cards:')).toBeInTheDocument();
    });

    it('should update the form based on radio button selection', () => {
        render(
            <MemoryRouter>
                <Formik initialValues={{ amount: '', quantity: '1' }} onSubmit={() => {}}>
                    <BuyForm productData={productData} />
                </Formik>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByLabelText('Buy for other'));

        fireEvent.click(screen.getByLabelText('Buy for employees'));

        fireEvent.click(screen.getByLabelText('Bulk Purchase'));
    });
});
