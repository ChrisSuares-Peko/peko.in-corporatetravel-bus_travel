import { useState, useCallback, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';
import formatString from '@utils/wordFormat';

import { CashbackListing } from '../api';
import { reportListingResponse, transactionType } from '../types';

export const useGetCashbackData = (
    searchText: string,
    category: string,
    sort: string,
    page: number,
    itemsPerPage: number,
    filter: string,
    from: string,
    to: string,
    sortField: string
) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [reportRows, setReportRows] = useState<transactionType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>();

    const getReportList = useCallback(async () => {
        setIsLoading(true);
        const data: reportListingResponse | false = await CashbackListing({
            userId: id,
            userType: role,
            from,
            to,
            categoryName: category,
            searchText,
            sort,
            page,
            itemsPerPage,
            filter,
            sortField,
        });

        if (data) {
            const rows = data;

            const filteredRows = rows?.result?.filter(item => {
                const cashback = Number(item.corporateCashback);
                return cashback !== 0;
            });

            const arr = filteredRows?.map(item => ({
                date: item.transactionDate ?? '',
                transactionID: item.corporateTxnId ?? '',
                category: item.transactionCategory ?? '',
                operator: item.serviceOperator.serviceProvider ?? '',
                amount: item.order.amountInAed ?? '',
                paymentMode: formatString(item.order.paymentMode) ?? '',
                cashback: item.corporateCashback ?? '',
                status: formatString(item.order.status) ?? '',
                download: 'Download invoice',
                accountNumber: item.order.accountNo ?? '',
                subCorporateName: item.order?.subCorporateUser?.name ?? '',
            }));
            setCount(filteredRows.length);
            setReportRows(arr);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, role, category, filter, from, itemsPerPage, page, searchText, to, sort, sortField]);
    useEffect(() => {
        getReportList();
    }, [getReportList]);
    return { cashbackdata: reportRows, cashbackCount: count, cashbackLoading: isLoading };
};
