import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { store, createTestStore } from '@store/store';

import HafilatDetailForm from '../../../components/forms/HafilatDetailForm';
import { useHafilatApi } from '../../../hooks/hafilat/useHafilatApi';
import useHafilatPayment from '../../../hooks/hafilat/useHafilatPayment';
import { useFetchLimitApi } from '../../../hooks/useFetchLimitApi';

// Mock hooks
vi.mock('../../../hooks/useFetchLimitApi');
vi.mock('../../../hooks/hafilat/useHafilatApi');
vi.mock('../../../hooks/hafilat/useHafilatPayment');

// Mock react-router-dom
vi.mock('react-router-dom', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(), // Mock useNavigate
    };
});

// Create a mock store with necessary initial state
const mockStore = createTestStore(store.getState());

describe('HafilatDetailForm', () => {
    const mockHandleSubmission = vi.fn();
    const mockGetBalance = vi.fn().mockResolvedValue({
        TransactionId: 'mockTransactionId',
        isHafilatCardValid: true,
        ExpiryDate: '2025-12-31',
        CardStatus: 'Active',
        RequestStatus: 'Success',
        ProductDetails: [
            {
                ProductCode: 'mockProductCode',
                ProductTitle: 'mockProductTitle',
                TransactionType: 'Purchase',
                ProductCategory: 'tpurse',
                TitleNetwork: 'mockNetwork',
                ValidityStartDate: '2024-01-01',
                ValidityEndDate: '2025-12-31',
                BalanceAmount: 100,
                AmountInProcess: 0,
                MaximumAllowed: 1000,
                ItemInfo: null,
            },
        ],
        dueBalanceInAed: '100',
    });

    const mockLimitData = {
        flexiKey: 'mockFlexiKey',
        typeKey: 1,
        minDenomination: 10,
        maxDenomination: 1000,
        accessKey: 'mockAccessKey',
        serviceProvider: 'mockServiceProvider',
        surcharge: 'mockSurcharge',
    };

    const mockHaflatBalanceData = {
        TransactionId: 'mockTransactionId',
        isHafilatCardValid: true,
        ExpiryDate: '2025-12-31',
        CardStatus: 'Active',
        RequestStatus: 'Success',
        ProductDetails: [
            {
                ProductCode: 'mockProductCode',
                ProductTitle: 'mockProductTitle',
                TransactionType: 'Purchase',
                ProductCategory: 'tpurse',
                TitleNetwork: 'mockNetwork',
                ValidityStartDate: '2024-01-01',
                ValidityEndDate: '2025-12-31',
                BalanceAmount: 100,
                AmountInProcess: 0,
                MaximumAllowed: 1000,
                ItemInfo: null,
            },
        ],
        dueBalanceInAed: '100',
    };

    beforeEach(() => {
        vi.mocked(useFetchLimitApi).mockReturnValue({ limitData: mockLimitData, isLoading: false });
        vi.mocked(useHafilatApi).mockReturnValue({
            limitData: mockHaflatBalanceData,
            isLoading: false,
            getBalance: mockGetBalance,
        });
        vi.mocked(useHafilatPayment).mockReturnValue({ handleSubmission: mockHandleSubmission });

        // Mock useNavigate
        const navigate = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(navigate);

        // Render the component in beforeEach to ensure it is fresh for each test
        render(
            <Provider store={mockStore}>
                <Router>
                    <HafilatDetailForm />
                </Router>
            </Provider>
        );
    });

    afterEach(() => {
        cleanup();
    });

    it('renders the form correctly', () => {
        expect(screen.getByPlaceholderText('Enter Card Serial Number')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /View Bill/i })).toBeInTheDocument();
    });

    it('submits the form with valid values', async () => {
        fireEvent.change(screen.getByPlaceholderText('Enter Card Serial Number'), {
            target: { value: '123456789012345' },
        });

        fireEvent.click(screen.getByRole('button', { name: /View Bill/i }));

        await waitFor(() => {
            expect(mockHandleSubmission).toHaveBeenCalledWith({
                account: '123456789012345',
                amount: 100,
                flexiKey: 'mockFlexiKey',
                typeKey: 1,
                optionals: {
                    ProductCode: 'mockProductCode',
                    isTPurse: '1',
                    customerMobileNo: '',
                    itemCode: '',
                },
                transactionId: 'mockTransactionId',
            });
        });
    });

    it('shows validation errors for required fields', async () => {
        fireEvent.click(screen.getByRole('button', { name: /View Bill/i }));

        expect(await screen.findByText('Please enter the card number')).toBeInTheDocument();
    });
});
