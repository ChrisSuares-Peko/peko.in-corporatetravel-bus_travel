import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getOrdersList } from '../api';
import { ordersList } from '../types/ordersList';

export default function useGetOrdersList(itemsPerPage: number, page: number, searchText: string) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [packages, setPackages] = useState<any>();
    const [totalRecord, setTotalRecord] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getOrders = useCallback(async () => {
        const data: ordersList | false = await getOrdersList({
            userId: id,
            userType: role,
            itemsPerPage,
            page,
            searchText,
        });

        if (data) {
            const arr = data.data.map(item => ({
                date: item.createdAt,
                id: item.orderId,
                plan: '',
                esimType: '',
                amount: item.amountInAed,
                orderId: item.transactionId,
                quantity: 1,
                iccid: item.simDetailsEsim,
                paymentMethod: (item.paymentMode ?? '').toLowerCase(),
            }));

            setPackages(arr);
            setTotalRecord(data.recordsTotal);
        }
        setIsLoading(false);
    }, [id, itemsPerPage, page, role, searchText]);

    useEffect(() => {
        getOrders();
    }, [getOrders]);

    return { data: packages, totalRecord, isLoading };
}
