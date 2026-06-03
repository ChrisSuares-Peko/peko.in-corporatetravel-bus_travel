import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import DetailsRight from '@src/domains/dashboard/esim/components/esimDetails/DetailsRight';
import { EsimUsage } from '@src/domains/dashboard/esim/types/orderDetails';

describe('DetailsRight Component', () => {
    const mockUsage: EsimUsage = {
        total_voice: 100,
        total_text: 50,
        total: 2048, // in MB
        remaining: 1024, // in MB
        expired_at: '2024-12-31T00:00:00Z',
        remaining_voice: 50,
        remaining_text: 20,
        is_unlimited: false,
        status: '',
    };

    const unlimitedUsage: EsimUsage = {
        ...mockUsage,
        is_unlimited: true,
    };

    const defaultProps = {
        usage: mockUsage,
    };

    it('should render remaining data, voice, and SMS', () => {
        render(<DetailsRight {...defaultProps} />);

        expect(screen.getByText('1.00 GB')).toBeInTheDocument(); // Remaining Data
        expect(screen.getByText('Remaining Data')).toBeInTheDocument();

        expect(screen.getByText('100 Min')).toBeInTheDocument(); // Remaining Minutes
        expect(screen.getByText('Remaining Minutes')).toBeInTheDocument();

        expect(screen.getByText('20 SMS')).toBeInTheDocument(); // Remaining SMS
        expect(screen.getByText('Remaining SMS')).toBeInTheDocument();
    });

    it('should display "Unlimited" for voice and SMS when is_unlimited is true', () => {
        render(<DetailsRight usage={unlimitedUsage} />);

        // Use getAllByText since "Unlimited" appears multiple times
        const unlimitedElements = screen.getAllByText('Unlimited');
        expect(unlimitedElements).toHaveLength(2); // One for voice, one for SMS

        expect(screen.getByText('Remaining Minutes')).toBeInTheDocument();
        expect(screen.getByText('Remaining SMS')).toBeInTheDocument();
    });

    it('should handle empty usage details gracefully', () => {
        const emptyUsageProps = {
            usage: {} as EsimUsage, // Empty usage object
        };

        render(<DetailsRight {...emptyUsageProps} />);

        // Use a flexible matching function for "N/A"

        expect(screen.getByText('Remaining Data')).toBeInTheDocument();
        expect(screen.getByText('Remaining Minutes')).toBeInTheDocument();
        expect(screen.getByText('Remaining SMS')).toBeInTheDocument();
    });
});
