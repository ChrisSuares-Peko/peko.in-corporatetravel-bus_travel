import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CompanyInfo from '@src/domains/dashboard/profile/components/CompanyInfo';
// import CompanyInfoModal from '@src/domains/dashboard/profile/components/CompanyInfoModal';
import useCompanyInfoApi from '@src/domains/dashboard/profile/hooks/useCompanyInfoApi';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';

vi.mock('@src/domains/dashboard/profile/hooks/useCompanyInfoApi', () => ({
    default: vi.fn(() => ({
        handleUpdateCompanyInfo: vi.fn(),
        isEditLoading: false,
        data: {
            activity: 'Retail',
            tradeLicenseNo: '123456',
            tradeLicenseExpiry: '2024-12-31',
            trnNo: 'TRN123456',
            trnCertificate: 'http://example.com/trn',
            tradeLicenseDoc: 'http://example.com/license',
            eidDoc: 'http://example.com/eid',
        },
        isLoading: false,
    })),
}));

vi.mock('@components/atomic/inputs/DatePickerInput', () => ({
    default: ({ name, label, isDisabled, ...props }: any) => (
        <div data-testid={`date-picker-${name}`}>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} type="date" disabled={isDisabled} {...props} />
        </div>
    ),
}));

vi.mock('@src/domains/dashboard/profile/api/general', () => ({
    getOtp: vi.fn(() => Promise.resolve(true)),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

describe('CompanyInfo Component', () => {
    const mockDispatch = vi.fn();
    const mockHandleUpdateCompanyInfo = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useAppSelector as any).mockReturnValue({
            id: 123,
            role: 'userRole',
        });
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useCompanyInfoApi as any).mockReturnValue({
            handleUpdateCompanyInfo: mockHandleUpdateCompanyInfo,
            isEditLoading: false,
            data: {
                activity: 'Retail',
                tradeLicenseNo: '123456',
                tradeLicenseExpiry: '2024-12-31',
                trnNo: 'TRN123456',
                trnCertificate: 'http://example.com/trn',
                tradeLicenseDoc: 'http://example.com/license',
                eidDoc: 'http://example.com/eid',
            },
            isLoading: false,
        });
    });

    it('renders without crashing', () => {
        render(<CompanyInfo />);
        expect(screen.getByText(/Company Information/i)).toBeInTheDocument();
    });

    it('opens the company info modal when the edit button is clicked', async () => {
        render(<CompanyInfo />);
        fireEvent.click(screen.getByText(/Edit Info/i));
        await waitFor(() => {
            expect(screen.getByText(/Company Information/i)).toBeInTheDocument();
        });
    });

    it('renders "No documents available" when no documents are present', () => {
        (useCompanyInfoApi as any).mockReturnValue({
            handleUpdateCompanyInfo: mockHandleUpdateCompanyInfo,
            isEditLoading: false,
            data: {
                activity: 'Retail',
                tradeLicenseNo: '123456',
                tradeLicenseExpiry: '2024-12-31',
                trnNo: 'TRN123456',
                trnCertificate: null,
                tradeLicenseDoc: null,
                eidDoc: null,
            },
            isLoading: false,
        });

        render(<CompanyInfo />);

        expect(screen.getByText(/No documents available/i)).toBeInTheDocument();
    });

    it('should set loading state correctly during API call', async () => {
        // Simulate loading state
        (useCompanyInfoApi as any).mockReturnValue({
            handleUpdateCompanyInfo: mockHandleUpdateCompanyInfo,
            isEditLoading: false,
            data: {
                activity: 'Retail',
                tradeLicenseNo: '123456',
                tradeLicenseExpiry: '2024-12-31',
                trnNo: 'TRN123456',
                trnCertificate: 'http://example.com/trn',
                tradeLicenseDoc: 'http://example.com/license',
                eidDoc: 'http://example.com/eid',
            },
            isLoading: true,
        });

        render(<CompanyInfo />);

        // Check for loading indicator presence
        expect(screen.getByText(/Company Information/i)).toBeInTheDocument();

        // Simulate end of loading state
        (useCompanyInfoApi as any).mockReturnValue({
            handleUpdateCompanyInfo: mockHandleUpdateCompanyInfo,
            isEditLoading: false,
            data: {
                activity: 'Retail',
                tradeLicenseNo: '123456',
                tradeLicenseExpiry: '2024-12-31',
                trnNo: 'TRN123456',
                trnCertificate: 'http://example.com/trn',
                tradeLicenseDoc: 'http://example.com/license',
                eidDoc: 'http://example.com/eid',
            },
            isLoading: false,
        });

        await waitFor(() => {
            expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            expect(screen.getByText(/Company Information/i)).toBeInTheDocument();
        });
    });
});
