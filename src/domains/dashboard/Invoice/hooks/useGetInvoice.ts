import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getAllInvoices } from '../api';
import { getAllInvoicesTypes } from '../types';

const useGetInvoice = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchText, setSearchText] = useState<string>();
    const [limit, setLimit] = useState<number>(10);
    const { id, role } = useAppSelector(state => state.reducer.auth);
    const [data, setData] = useState<getAllInvoicesTypes | undefined>(undefined);
    const [count, setCount] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const getInvoices = useCallback(async () => {
        const invoices = await getAllInvoices({
            userId: id,
            userType: role,
            searchText,
            currentPage,
            limit,
        });
        if (invoices) {
            setData(invoices);
            setCount(invoices.recordsTotal);
        }
        setIsLoading(false);
    }, [currentPage, id, limit, role, searchText]);
    useEffect(() => {
        getInvoices();
    }, [getInvoices]);

    return {
        data,
        isLoading,
        searchText,
        setSearchText,
        count,
        setCurrentPage,
        currentPage,
        limit,
        setLimit,
    };
};

export default useGetInvoice;
