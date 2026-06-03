import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getOrdersList } from '../api';
import { DocumentResponse } from '../types/documentType';

export default function useGetOrdersList(page: number, setSearchKey: string) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [ordersList, setOrdersList] = useState<any>();
    const [totalOrders, setTotalOrders] = useState<number>();
    const [isLoading, setIsLoading] = useState(true);

    const handleGetOrdersList = useCallback(async () => {
        const data: DocumentResponse | false = await getOrdersList({
            userId: id,
            userType: role,
            page,
            setSearchKey,
        });
        if (data) {
            const listData = data as DocumentResponse;
            const docData = listData.data.map((item, i) => ({
                id: i,
                date: item.createdAt,
                documentType: item.documentType,
                orderId: item.id,
                amount: item.amount,
                status: item.status,
                transaction: item.transaction,
            }));
            setOrdersList(docData);
            setTotalOrders(listData.recordsTotal);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, page, role, setSearchKey]);

    useEffect(() => {
        handleGetOrdersList();
    }, [handleGetOrdersList]);

    return { ordersList, isLoading, totalOrders };
}
