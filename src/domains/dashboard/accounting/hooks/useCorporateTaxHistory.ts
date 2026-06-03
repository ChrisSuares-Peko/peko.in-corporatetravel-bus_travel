import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { getCorporateTaxHistory } from '../api';
import { Record, historyResponse, taxPayload } from '../types/types';

export default function useGetCorporateTaxHistory({ searchText, pageSize, page }: taxPayload) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<Record[]>();
    const dispatch = useAppDispatch();

    const getTax = useCallback(async () => {
        setIsLoading(true);
        const data: historyResponse | false = await getCorporateTaxHistory({
            userId: id,
            userType: role,
            searchText,
            pageSize,
            page,
        });

        if (data) {
            setTableData(data.rows);
            setCount(data.recordsTotal);
        }
        setRefresh(false);
        setIsLoading(false);
    }, [id, page, pageSize, role, searchText]);

    useEffect(() => {
        getTax();
    }, [getTax, refresh]);

    return { tableData, isLoading, count, setRefresh };
}
