import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { serviceTypeListing } from '../api';
import { IServiceTypeListingResponse, defaultSelectType } from '../types';

export const useLogisticsServiceLisitingApi = (shipmentType: string, itemType: string) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [serviceTypes, setServiceTypes] = useState<defaultSelectType[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const getServiceList = useCallback(async () => {
        const data: IServiceTypeListingResponse | false = await serviceTypeListing({
            userId: id,
            userType: role,
            shipmentType,
            itemType,
        });
        if (data) {
            const listingData = data;

            const arr = listingData?.serviceType?.map(item => ({
                value: item.code ?? '',
                label: item.name ?? '',
            }));
            setServiceTypes(arr);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, role, shipmentType, itemType]);
    useEffect(() => {
        getServiceList();
    }, [getServiceList]);
    return { data: serviceTypes, isLoading };
};
