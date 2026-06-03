import { renderHook } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useBasicDetails } from '@src/domains/dashboard/logistics/hooks/useBasicDetails';
import { useSaveAddressApi } from '@src/domains/dashboard/logistics/hooks/useSaveAddressApi';
import {
    setDestinationAddress,
    setOriginAddress,
    setShipmentDetails,
} from '@src/domains/dashboard/logistics/slice/logisticsSlice';

// Mock dependencies
vi.mock('react-redux', () => ({
    useDispatch: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@src/domains/dashboard/logistics/hooks/useSaveAddressApi', () => ({
    useSaveAddressApi: vi.fn(),
}));

describe('useBasicDetails', () => {
    const mockDispatch = vi.fn();
    const mockNavigate = vi.fn();
    const mockHandleSenderAddress = vi.fn();
    const mockHandleRecieverAddress = vi.fn();

    beforeEach(() => {
        (useDispatch as any).mockReturnValue(mockDispatch);
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useSaveAddressApi as any).mockReturnValue({
            handleSenderAddress: mockHandleSenderAddress,
            handleRecieverAddress: mockHandleRecieverAddress,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should dispatch actions and navigate on form submit', async () => {
        // Arrange
        const { result } = renderHook(() => useBasicDetails());

        // Act
        await result.current.handleFormSubmit({
            senderSaveAddress: true,
            recieverSaveAddress: true,
            senderEmail: 'john.doe@example.com',
            recieverEmail: 'jane.doe@example.com',
            shipmentType: 'DOM',
            senderAddress: '123 Main St',
            senderCity: 'Metropolis',
            senderName: 'John Doe',
            senderCountry: 'US',
            senderPhone: '555-5555',
            senderZipCode: '12345',
            recieverName: 'Jane Doe',
            recieverAddress: '456 Elm St',
            recieverPhone: '555-5555',
            recieverCity: 'Metropolis',
            recieverCountry: 'US',
            recieverZipCode: '67890',
        });

        // Assert
        expect(mockDispatch).toHaveBeenCalledWith(
            setOriginAddress({
                Line1: 'John Doe',
                Line2: '123 Main St',
                Line3: '555-5555',
                City: 'Metropolis',
                CountryCode: 'US',
                Description: 'john.doe@example.com',
                PostCode: '12345',
            })
        );
        expect(mockDispatch).toHaveBeenCalledWith(
            setDestinationAddress({
                Line1: 'Jane Doe',
                Line2: '456 Elm St',
                Line3: '555-5555',
                City: 'Metropolis',
                CountryCode: 'US',
                Description: 'jane.doe@example.com',
                PostCode: '67890',
            })
        );
        expect(mockDispatch).toHaveBeenCalledWith(setShipmentDetails({ productGroup: 'DOM' }));
        expect(mockHandleSenderAddress).toHaveBeenCalledWith({
            Line1: 'John Doe',
            Line2: '123 Main St',
            Line3: '555-5555',
            City: 'Metropolis',
            CountryCode: 'US',
            Description: 'john.doe@example.com',
            PostCode: '12345',
        });
        expect(mockHandleRecieverAddress).toHaveBeenCalledWith({
            Line1: 'Jane Doe',
            Line2: '456 Elm St',
            Line3: '555-5555',
            City: 'Metropolis',
            CountryCode: 'US',
            Description: 'jane.doe@example.com',
            PostCode: '67890',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/logistics/details');
    });

    it('should resolve the promise on successful receiver form submission', async () => {
        // Arrange
        const { result } = renderHook(() => useBasicDetails());
        mockHandleRecieverAddress.mockResolvedValue(true);

        // Act
        const response = await result.current.handleFormRecieverSubmit({
            recieverName: 'Jane Doe',
            recieverAddress: '456 Elm St',
            recieverPhone: '555-5555',
            recieverCity: 'Metropolis',
            recieverCountry: 'US',
            recieverZipCode: '67890',
            recieverSaveAddress: true,
            addressId: 1,
            recieverEmail: 'jane.doe@example.com',
        });

        // Assert
        expect(response).toBe(true);
        expect(mockHandleRecieverAddress).toHaveBeenCalledWith(
            {
                Line1: 'Jane Doe',
                Line2: '456 Elm St',
                Line3: '555-5555',
                City: 'Metropolis',
                CountryCode: 'US',
                Description: 'jane.doe@example.com',
                PostCode: '67890',
            },
            1
        );
    });

    it('should reject the promise on receiver form submission error', async () => {
        // Arrange
        const { result } = renderHook(() => useBasicDetails());
        const mockError = new Error('API Error');
        mockHandleRecieverAddress.mockRejectedValue(mockError);

        // Act & Assert
        await expect(
            result.current.handleFormRecieverSubmit({
                recieverName: 'Jane Doe',
                recieverAddress: '456 Elm St',
                recieverPhone: '555-5555',
                recieverCity: 'Metropolis',
                recieverCountry: 'US',
                recieverZipCode: '67890',
                recieverSaveAddress: true,
                addressId: 1,
                recieverEmail: 'jane.doe@example.com',
            })
        ).rejects.toThrow('API Error');
    });

    it('should resolve the promise on successful sender form submission', async () => {
        // Arrange
        const { result } = renderHook(() => useBasicDetails());
        mockHandleSenderAddress.mockResolvedValue(true);

        // Act
        const response = await result.current.handleFormSenderSubmit({
            senderName: 'John Doe',
            senderAddress: '123 Main St',
            senderPhone: '555-5555',
            senderCity: 'Metropolis',
            senderCountry: 'US',
            senderZipCode: '12345',
            senderSaveAddress: true,
            addressId: 1,
            senderEmail: 'john.doe@example.com',
        });

        // Assert
        expect(response).toBe(true);
        expect(mockHandleSenderAddress).toHaveBeenCalledWith(
            {
                Line1: 'John Doe',
                Line2: '123 Main St',
                Line3: '555-5555',
                City: 'Metropolis',
                CountryCode: 'US',
                Description: 'john.doe@example.com',
                PostCode: '12345',
            },
            1
        );
    });

    it('should reject the promise on sender form submission error', async () => {
        // Arrange
        const { result } = renderHook(() => useBasicDetails());
        const mockError = new Error('API Error');
        mockHandleSenderAddress.mockRejectedValue(mockError);

        // Act & Assert
        await expect(
            result.current.handleFormSenderSubmit({
                senderName: 'John Doe',
                senderAddress: '123 Main St',
                senderPhone: '555-5555',
                senderCity: 'Metropolis',
                senderCountry: 'US',
                senderZipCode: '12345',
                senderSaveAddress: true,
                addressId: 1,
                senderEmail: 'john.doe@example.com',
            })
        ).rejects.toThrow('API Error');
    });
});
