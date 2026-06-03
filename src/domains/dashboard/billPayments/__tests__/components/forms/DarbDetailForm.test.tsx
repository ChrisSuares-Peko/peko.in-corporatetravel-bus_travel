import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { store } from '@store/store';

import DarbDetailForm from '../../../components/forms/DarbDetailForm';
import { useDarbApi } from '../../../hooks/darb/useDarbApi';
import useDarbPayment from '../../../hooks/darb/useDarbPayment';

vi.mock('../../../hooks/darb/useDarbApi', () => ({
    useDarbApi: () => ({
        getBalance: vi.fn(),
    }),
}));

vi.mock('../../../hooks/darb/useDarbPayment', () => ({
    default: () => ({
        handleSubmission: vi.fn(),
    }),
}));

vi.mock('../../../hooks/useFetchLimitApi', () => ({
    useFetchLimitApi: () => ({
        limitData: {
            flexiKey: 'testFlexiKey',
            maxDenomination: '1000',
            minDenomination: '10',
            typeKey: '1',
        },
    }),
}));

describe('DarbDetailForm', () => {
    beforeEach(() => {
        cleanup();
        render(
            <Provider store={store}>
                <Router>
                    <DarbDetailForm />
                </Router>
            </Provider>
        );
    });

    it('renders the form with initial values', () => {
        expect(screen.getByPlaceholderText('Enter Traffic Number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Emirates ID')).toBeInTheDocument();
    });

    it('shows validation errors on submitting an empty form', async () => {
        fireEvent.click(screen.getByRole('button', { name: /View Bill/i }));

        await waitFor(() => {
            expect(screen.getByText('Please enter the traffic number')).toBeInTheDocument();
            expect(screen.getByText('Please enter Emirates ID')).toBeInTheDocument();
        });
    });

    // it('submits the form with valid values', async () => {
    //     const mockGetBalanceResponse = {
    //         WalletDetails: [{ walletIdentity: 'wallet123', customerEN: 'customer123', amount: 500 }],
    //         TransactionId: 'txn123',
    //     };

    //     // Setting up the mocks
    //     const getBalanceMock = vi.mocked(useDarbApi().getBalance).mockResolvedValue(mockGetBalanceResponse);
    //     const handleSubmissionMock = vi.mocked(useDarbPayment().handleSubmission);

    //     // Fill in form values
    //     fireEvent.change(screen.getByPlaceholderText('Enter Traffic Number'), {
    //         target: { value: '1234567890' }, // Ensure valid input value
    //     });
    //     fireEvent.change(screen.getByPlaceholderText('Enter Emirates ID'), {
    //         target: { value: '123456789012345' },
    //     });

    //     // Submit the form
    //     fireEvent.click(screen.getByRole('button', { name: /View Bill/i }));

    //     // Wait for assertions
    //     await waitFor(() => {
    //         expect(getBalanceMock).toHaveBeenCalledWith('123456789012345', '1234567890', 'testFlexiKey');
    //         expect(handleSubmissionMock).toHaveBeenCalledWith({
    //             account: '1234567890',
    //             flexiKey: 'testFlexiKey',
    //             optional1: 'wallet123',
    //             optional2: 'customer123',
    //             amount: 500,
    //             typeKey: 1,
    //             transactionId: 'txn123',
    //             minAmt: '10',
    //             maxAmt: '1000',
    //         });
    //     });
    // });

    it('handles server errors gracefully', async () => {
        vi.mocked(useDarbApi().getBalance).mockResolvedValue(false);

        fireEvent.change(screen.getByPlaceholderText('Enter Traffic Number'), {
            target: { value: 'ABC123' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter Emirates ID'), {
            target: { value: '123456789012345' },
        });

        fireEvent.click(screen.getByRole('button', { name: /View Bill/i }));

        await waitFor(() => {
            const handleSubmissionMock = vi.mocked(useDarbPayment().handleSubmission);
            expect(handleSubmissionMock).not.toHaveBeenCalled();
        });
    });
});
