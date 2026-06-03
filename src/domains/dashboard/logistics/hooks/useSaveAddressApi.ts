import { useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { saveAddressApi } from '../api/address';
import { Address } from '../types';
import { SaveAddressPayload } from '../types/address';

export const useSaveAddressApi = () => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(true);

    const handleSenderAddress = async (originAddress: Address, addressId?: number) => {
        const response: SaveAddressPayload | false = await saveAddressApi({
            userId: id,
            userType: role,
            id: addressId,
            name: originAddress.Line1,
            addressLine1: originAddress.Line2,
            addressLine2: '',
            city: originAddress.City,
            countryCode: originAddress.CountryCode,
            country: '',
            email: originAddress.Description,
            default: 0,
            phoneNumber: originAddress.Line3,
            zipCode: originAddress.PostCode,
            isReceiver: 0,
        });
        if (response) {
            setIsLoading(false);
            return response;
        }
        setIsLoading(false);
        return false;
    };

    const handleRecieverAddress = async (destinationAddress: Address, addressId?: number) => {
        const response: SaveAddressPayload | false = await saveAddressApi({
            userId: id,
            userType: role,
            id: addressId,
            name: destinationAddress.Line1,
            addressLine1: destinationAddress.Line2,
            addressLine2: '',
            city: destinationAddress.City,
            countryCode: destinationAddress.CountryCode,
            country: '',
            email: destinationAddress.Description,
            default: 0,
            phoneNumber: destinationAddress.Line3,
            zipCode: destinationAddress.PostCode,
            isReceiver: 1,
        });
        if (response) {
            setIsLoading(false);
            return response;
        }
        setIsLoading(false);
        return false;
    };

    return { data: '', isLoading, handleSenderAddress, handleRecieverAddress };
};
