import { useCallback, useEffect, useState } from 'react';

import { DropDown } from '@customtypes/general';

import { getAddressTypes } from '../api/general';
import { AddressTypesResponse } from '../types';

export default function useAddressTypes() {
    const [addressTypesList, setAddressTypesList] = useState<DropDown>([]);

    const fetchAddressTypes = useCallback(async () => {
        const data: AddressTypesResponse | false = await getAddressTypes();
        if (data) {
            setAddressTypesList(data.addressType);
        }
    }, []);

    useEffect(() => {
        fetchAddressTypes();
    }, [fetchAddressTypes]);

    return { addressTypesList };
}
