import { useCallback, useEffect, useState } from 'react';

import { DropDown } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import { getOrderDetails } from '../api';
import { EsimOrderDetails } from '../types/orderDetails';

export default function useGetOrderDetails(iccid: string, orderId: string) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [packages, setPackages] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const [conversionRate, setConversionRate] = useState<number>(1);
    const [countryData, setCategoryData] = useState<DropDown>();

    const getOrders = useCallback(async () => {
        const data: EsimOrderDetails | false = await getOrderDetails({
            userId: id,
            userType: role,
            iccid,
            orderId,
        });

        if (data) {
            setPackages(data);
        }
        setIsLoading(false);
    }, [iccid, id, orderId, role]);

    useEffect(() => {
        getOrders();
    }, [getOrders]);

    return { data: packages, conversionRate, isLoading, countryData };
}
