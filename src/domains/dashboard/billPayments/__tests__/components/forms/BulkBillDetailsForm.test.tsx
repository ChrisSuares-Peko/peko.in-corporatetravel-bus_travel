import React from 'react';

import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import BulkBillDetailsForm from '../../../components/forms/BulkBillDetailsForm';

// Mock the useAppSelector hook
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

// Spy on the useGetBillApi hook and its methods
const mockGetBillLimit = vi.fn();

vi.mock('../../../hooks/useGetBillApi', () => ({
    useGetBillApi: () => ({
        getBillLimit: mockGetBillLimit,
        isSubmitting: false,
    }),
}));

// Mock useNavigate and BrowserRouter
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        BrowserRouter: actual.BrowserRouter,
    };
});

describe('BulkBillDetailsForm', () => {
    const mockServiceData = {
        inputComponents: [
            { name: 'accountNumber', label: 'Account Number', type: 'text' },
            { name: 'accountPin', label: 'Account Pin', type: 'password' },
        ],
        title: 'Mock Service',
        path: '/mock-path',
        btnText: 'Submit',
    };

    const mockBeneficiary = {
        accessKey: 'mockAccessKey',
        accountNo: '12345678',
        optional1: '87654321',
    };

    const mockLimitData = {
        minDenomination: 10,
        maxDenomination: 1000,
        flexiKey: 'flexiKeyValue',
        typeKey: 1,
        accessKey: 'accessKeyValue',
        serviceProvider: 'serviceProviderValue',
        surcharge: 'surchargeValue',
    };

    beforeEach(() => {
        (useAppSelector as Mock).mockReturnValue({
            vendor: mockServiceData,
            beneficiary: mockBeneficiary,
            formKey: 1,
        });
    });

    it('should render form fields correctly', () => {
        render(
            <Router>
                <BulkBillDetailsForm limitData={mockLimitData} isLoading={false} />
            </Router>
        );

        expect(screen.getByDisplayValue('12345678')).toBeInTheDocument();
        expect(screen.getByDisplayValue('87654321')).toBeInTheDocument();
    });

    it('should render loading state when isLoading is true', () => {
        render(
            <Router>
                <BulkBillDetailsForm limitData={mockLimitData} isLoading />
            </Router>
        );

        expect(document.querySelector('.ant-skeleton')).toBeInTheDocument();
    });

    it('should navigate away if serviceData is not present', () => {
        (useAppSelector as Mock).mockReturnValueOnce({
            vendor: null, // Simulate absence of service data
            beneficiary: mockBeneficiary,
            formKey: 1,
        });

        render(
            <Router>
                <BulkBillDetailsForm limitData={mockLimitData} isLoading={false} />
            </Router>
        );

        expect(mockNavigate).toHaveBeenCalledWith(`/${paths.billPayments.index}`);
    });
});
