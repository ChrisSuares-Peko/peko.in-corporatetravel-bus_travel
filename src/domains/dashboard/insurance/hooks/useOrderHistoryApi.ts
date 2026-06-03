import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getOrderHistoryApi } from '../api';
import {
    InsuranceOrder,
    OrderHistoryRequestPayload,
    OrderHistoryResponse,
    useOrderHistoryApiProps,
} from '../types/types';

export function useOrderHistoryApi({ searchText, page, pageSize }: useOrderHistoryApiProps) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [orders, setOrders] = useState<InsuranceOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>();

    const getOrderHistoryList = useCallback(async () => {
        const payLoad: OrderHistoryRequestPayload = {
            userId: id,
            userType: role,
            searchText,
            page,
            pageSize,
        };
        const data: OrderHistoryResponse | false = await getOrderHistoryApi(payLoad);
        if (data) {
            const ordersData = data as OrderHistoryResponse;

            setOrders(ordersData.rows);
            setCount(ordersData.recordsTotal);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, role, pageSize, page, searchText]);

    useEffect(() => {
        getOrderHistoryList();
    }, [getOrderHistoryList]);

    return { orders, isLoading, count };
}
