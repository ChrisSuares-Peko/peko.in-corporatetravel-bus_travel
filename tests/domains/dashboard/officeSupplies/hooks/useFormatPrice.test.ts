import { describe, it, expect } from 'vitest';

import { useFormatPrice } from '@domains/dashboard/officeSupplies/hooks/useFormatPrice';

describe('useFormatPrice', () => {
    it('should format a valid number correctly', () => {
        const price = 12345.67;
        const formattedPrice = useFormatPrice(price);
        expect(formattedPrice).toBe('12,345.67');
    });

    it('should handle string representation of a number correctly', () => {
        const price = '67890.12';
        const formattedPrice = useFormatPrice(price);
        expect(formattedPrice).toBe('67,890.12');
    });

    it('should handle integer input correctly', () => {
        const price = 1000;
        const formattedPrice = useFormatPrice(price);
        expect(formattedPrice).toBe('1,000');
    });

    it('should handle zero correctly', () => {
        const price = 0;
        const formattedPrice = useFormatPrice(price);
        expect(formattedPrice).toBe('0');
    });

    it('should handle null input gracefully', () => {
        const price = null;
        const formattedPrice = useFormatPrice(price);
        expect(formattedPrice).toBe('0');
    });
});
