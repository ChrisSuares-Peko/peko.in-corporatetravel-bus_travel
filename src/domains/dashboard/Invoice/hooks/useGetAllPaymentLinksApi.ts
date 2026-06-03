import { useCallback, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import { useAppSelector } from '@src/hooks/store';

import { getAllPaymentLinks } from '../api';
import { getCustomers } from '../types/guidelineTypes';
import { IData } from '../types/paymentlinkType';

export const useAllpaymentLinks = ({ searchText, itemsPerPage, page, sort }: getCustomers) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useDispatch();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<IData[]>([]);

    const getData = useCallback(async () => {
        setIsLoading(true);
        const data: any = await getAllPaymentLinks({
            userId: id,
            userType: role,
            searchText,
            itemsPerPage,
            page,
            sort,
        });
        if (data) {
            setTableData(data.data);
            setCount(data.recordsTotal);
        }
        setRefresh(false);
        setIsLoading(false);
    }, [id, itemsPerPage, page, role, searchText, sort]);

    useEffect(() => {
        getData();
    }, [getData, refresh]);

    return { isLoading, tableData, count, setRefresh };
};
