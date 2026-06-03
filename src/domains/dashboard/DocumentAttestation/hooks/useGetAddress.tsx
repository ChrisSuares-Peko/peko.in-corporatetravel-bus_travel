import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { getSavedAddressApi } from '../api';
// import { AddressOptions, any } from '../types/address';

export function useFetchAddressApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();

    const [addressOptions, setAddressOptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getAddress = useCallback(async () => {
        const data: any | false = await getSavedAddressApi({
            userId: id,
            userType: role,
        });
        if (data) {
            const addressData = data as any;
            const arr: any[] = addressData?.data?.map((address: any) => ({
                label: `${address.name} - ${address.addressLine1}`,
                value: JSON.stringify({
                    address: `${address?.addressLine1}\n${address?.addressLine2}`,
                    email: address.email ?? '',
                    phoneNumber: address.phoneNumber ?? '',
                }),
            }));
            setAddressOptions(arr);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, role]);

    useEffect(() => {
        getAddress();
    }, [getAddress]);

    return { addressOptions, isLoading };
}
