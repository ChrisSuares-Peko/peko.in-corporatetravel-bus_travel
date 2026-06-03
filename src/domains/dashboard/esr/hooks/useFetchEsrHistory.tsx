import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getESROrderHistory } from '../api';
import { ApiResponse, ESRRecord } from '../types';

export default function useFetchEsrHistory({
    searchText,
    itemsPerPage,
    page,
    sort,
    sortField,
}: any) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<ESRRecord[]>([]);
    const [count, setCount] = useState(0);

    const getOrders = useCallback(async () => {
        setIsLoading(true);
        const result: ApiResponse | false = await getESROrderHistory({
            userId: id,
            userType: role,
            itemsPerPage,
            page,
            searchText,
            sort,
            sortField,
        });

        if (result) {
            setData(result.data);
            setCount(result.count);
        }
        setIsLoading(false);
    }, [id, itemsPerPage, page, role, searchText, sort, sortField]);

    useEffect(() => {
        getOrders();
    }, [getOrders]);

    return { data, isLoading, count };
}
