import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { describe, it, expect } from 'vitest';

import DetailsLeft from '@src/domains/dashboard/esim/components/esimDetails/DetailsLeft';
import { EsimUsage } from '@src/domains/dashboard/esim/types/orderDetails';

describe('DetailsLeft Component', () => {
    const mockUsage: EsimUsage = {
        total_voice: 100,
        total_text: 50,
        total: 2048, // in MB
        expired_at: '2024-12-31T00:00:00Z',
        remaining: 0,
        is_unlimited: false,
        status: '',
        remaining_voice: 0,
        remaining_text: 0,
    };

    const defaultProps = {
        usage: mockUsage,
        image: '/path/to/operator/image.png',
        operator: 'Test Operator',
    };

    it('should render the operator image and name', () => {
        render(<DetailsLeft {...defaultProps} />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', defaultProps.image);

        expect(screen.getByText('Test Operator')).toBeInTheDocument();
    });

    it('should display correct package details', () => {
        render(<DetailsLeft {...defaultProps} />);

        expect(screen.getByText('Voice:')).toBeInTheDocument();
        expect(screen.getByText('100 min')).toBeInTheDocument();

        expect(screen.getByText('SMS:')).toBeInTheDocument();
        expect(screen.getByText('50 sms')).toBeInTheDocument();

        expect(screen.getByText('Data:')).toBeInTheDocument();
        expect(screen.getByText('2 GB')).toBeInTheDocument();

        const formattedDate = dayjs('2024-12-31T00:00:00Z').format('DD-MM-YYYY');
        expect(screen.getByText('Validity:')).toBeInTheDocument();
        expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });

    it('should display warning message', () => {
        render(<DetailsLeft {...defaultProps} />);

        expect(
            screen.getByText(
                /Warning! Most eSIMs can only be installed once. If you remove the eSIM from your device, you cannot install it again./i
            )
        ).toBeInTheDocument();
    });

    it('should handle empty usage details gracefully', () => {
        const emptyProps = {
            ...defaultProps,
            usage: {} as EsimUsage, // Passing an empty usage object
        };

        render(<DetailsLeft {...emptyProps} />);

        expect(screen.getByText('Voice:')).toBeInTheDocument();

        expect(screen.getByText('SMS:')).toBeInTheDocument();
        expect(screen.getByText('0 sms')).toBeInTheDocument();

        expect(screen.getByText('Data:')).toBeInTheDocument();
        expect(screen.queryByText('GB')).not.toBeInTheDocument();

        expect(screen.getByText('Validity:')).toBeInTheDocument();
        expect(screen.queryByText(dayjs().format('DD-MM-YYYY'))).not.toBeInTheDocument();
    });
});
