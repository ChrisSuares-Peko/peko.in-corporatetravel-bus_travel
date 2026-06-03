import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import ReviewLeftCard from '@src/domains/dashboard/logistics/components/ReviewLeftCard';
import { useAppSelector } from '@src/hooks/store';

// Mock the necessary components
vi.mock('@src/hooks/store');
vi.mock('react-svg', () => ({
    ReactSVG: ({ src }: { src: string }) => <img src={src} alt="Truck Icon" />,
}));
vi.mock('@src/domains/dashboard/logistics/components/CustomText', () => ({
    GrayTextLeft: ({ text }: { text: string }) => <div>{text}</div>,
}));

describe('ReviewLeftCard', () => {
    beforeEach(() => {
        // Mock the return value of useAppSelector to control the Redux state
        (useAppSelector as any).mockReturnValue({
            originAddress: {
                Line1: '123 Main St',
                Line2: 'Apt 4B',
                City: 'New York',
                CountryCode: 'US',
                Description: 'Sender Address Description',
                Line3: 'Near Park',
            },
            destinationAddress: {
                Line1: '456 Elm St',
                Line2: 'Suite 101',
                City: 'Los Angeles',
                CountryCode: 'US',
                Description: 'Receiver Address Description',
                Line3: 'Near Lake',
            },
            shipmentDetails: {
                shipmentContent: 'parcel',
                quantity: 2,
                actualWeight: 5.5,
            },
            shippingAmount: {
                type: 'Standard Shipping',
            },
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders the ReviewLeftCard with correct data', () => {
        render(<ReviewLeftCard />);

        // Check if the Truck Icon is rendered
        const truckIcon = screen.getByAltText('Truck Icon');
        expect(truckIcon).toBeInTheDocument();

        // Check if the shipping type is rendered
        expect(screen.getByText('Standard Shipping')).toBeInTheDocument();

        // Check if the origin address is rendered correctly
        expect(screen.getByText('123 Main St')).toBeInTheDocument();
        expect(screen.getByText('Apt 4B, New York, US')).toBeInTheDocument();
        expect(screen.getByText('Sender Address Description')).toBeInTheDocument();
        expect(screen.getByText('Near Park')).toBeInTheDocument();

        // Check if the destination address is rendered correctly
        expect(screen.getByText('456 Elm St')).toBeInTheDocument();
        expect(screen.getByText('Suite 101, Los Angeles, US')).toBeInTheDocument();
        expect(screen.getByText('Receiver Address Description')).toBeInTheDocument();
        expect(screen.getByText('Near Lake')).toBeInTheDocument();

        // Check if the shipment content, quantity, and weight are rendered
        expect(screen.getByText('Parcel')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('5.5 Kg')).toBeInTheDocument();
    });
});
