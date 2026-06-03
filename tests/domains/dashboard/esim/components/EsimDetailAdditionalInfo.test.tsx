import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import EsimDetailsAdditionalInfoList from '@src/domains/dashboard/esim/components/esimDetails/EsimDetailAdditionalInfo';
import { EsimPackageDetails, SimDetails } from '@src/domains/dashboard/esim/types/orderDetails';
import { showToast } from '@src/slices/apiSlice';

// Mock useAppDispatch
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: () => vi.fn(),
}));

// Mock showToast action
vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn(),
    },
});

const mockDetails: EsimPackageDetails = {
    operatorName: 'Test Operator',
    package: 'Test Plan',
    esim_type: 'Prepaid',
    isRechargable: true,
    countries: [{ title: 'Country1' }, { title: 'Country2' }],
    packageType: 'local',
    id: 0,
    code: '',
    data: '',
    type: '',
    price: 0,
    currency: '',
    quantity: '',
    validity: 0,
    created_at: '',
    package_id: '',
    description: null,
    operatorImage: '',
    installation_guides: {},
    manual_installation: '',
    qrcode_installation: '',
};

const mockEsimDetails: SimDetails = {
    iccid: '12345678901234567890',
    id: 0,
    lpa: '',
    imsis: null,
    qrcode: '',
    apn_type: '',
    apn_value: '',
    created_at: '',
    is_roaming: false,
    qrcode_url: '',
    airalo_code: null,
    matching_id: '',
    confirmation_code: null,
};

const defaultProps = {
    details: mockDetails,
    esimDetails: mockEsimDetails,
};

describe('EsimDetailsAdditionalInfoList Component', () => {
    it('should render additional information correctly', () => {
        render(<EsimDetailsAdditionalInfoList {...defaultProps} />);

        expect(screen.getByText('Service Operator')).toBeInTheDocument();
        expect(screen.getByText('Test Operator')).toBeInTheDocument();
        expect(screen.getByText('Plan')).toBeInTheDocument();
        expect(screen.getByText('Test Plan')).toBeInTheDocument();
    });

    it('should handle the copy button click and display toast message', async () => {
        render(<EsimDetailsAdditionalInfoList {...defaultProps} />);

        // Use findByTestId to wait for the element to appear asynchronously
        const copyIcon = await screen.findByTestId('copy-icon');
        fireEvent.click(copyIcon);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('12345678901234567890');
        expect(showToast).toHaveBeenCalledWith({
            description: 'ICCID copied to clipboard',
            variant: 'success',
        });
    });

    it('should handle missing values gracefully', () => {
        const emptyProps = {
            details: { ...mockDetails, package: '', operatorName: '', esim_type: '' },
            esimDetails: {
                id: 0,
                lpa: '',
                iccid: '', // Setting iccid to an empty string to simulate missing value
                imsis: null,
                qrcode: '',
                apn_type: '',
                apn_value: '',
                created_at: '',
                is_roaming: false,
                qrcode_url: '',
                airalo_code: null,
                matching_id: '',
                confirmation_code: null,
            },
        };

        render(<EsimDetailsAdditionalInfoList {...emptyProps} />);

        expect(screen.getByText('Service Operator')).toBeInTheDocument();
        expect(screen.getByText('Plan')).toBeInTheDocument();
    });
});
