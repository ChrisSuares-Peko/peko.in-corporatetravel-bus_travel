import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { getAllKybDetails } from '../../api/vendorPayout';
import { CorporateRecordsResponse, GetAllKybDetailsPayload } from '../../types/vendorPayout';

export default function useGetAllKybApi({
    searchText,
    itemsPerPage,
    pageSize,
    page,
}: GetAllKybDetailsPayload) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<any[]>();
    const dispatch = useAppDispatch();

    const getKybs = useCallback(async () => {
        setIsLoading(true);
        const data: CorporateRecordsResponse | false = await getAllKybDetails({
            userId: id,
            userType: role,
            itemsPerPage,
            pageSize,
            page,
            searchText,
        });

        if (data) {
            setTableData(data.rows);
            setCount(data.recordsTotal);
        }
        setRefresh(false);
        setIsLoading(false);
    }, [id, itemsPerPage, page, pageSize, searchText, role]);

    useEffect(() => {
        getKybs();
    }, [getKybs, refresh]);

    return { tableData, loading: isLoading, count, setRefresh };
}
