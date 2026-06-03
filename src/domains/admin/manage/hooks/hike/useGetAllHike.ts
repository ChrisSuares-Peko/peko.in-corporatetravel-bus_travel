import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { getAllHikeData, updateHike } from '../../api/hike';

export default function useGetAllHike({ searchText, itemsPerPage, page, sort, sortField }: any) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<any[]>();
    const dispatch = useAppDispatch();

    const getHike = useCallback(async () => {
        setIsLoading(true);
        const data: any | false = await getAllHikeData({
            userId: id,
            userType: role,
            searchText,
            itemsPerPage,
            page,
            sort,
            sortField,
        });

        if (data) {
            setTableData(data.rows);
            setCount(data.recordsTotal);
        }
        setRefresh(false);
        setIsLoading(false);
    }, [id, itemsPerPage, page, role, searchText, sort, sortField]);

    const updateActiveStatusHike = useCallback(
        async (payload: any) => {
            setIsLoading(true);
            const data: any | false = await updateHike({
                userId: id,
                userType: role,
                ...payload,
            });
            if (data) {
                setRefresh(true);
            }
            setIsLoading(false);
        },
        [id, role]
    );

    useEffect(() => {
        getHike();
    }, [getHike, refresh]);

    return { tableData, loading: isLoading, count, setRefresh, updateActiveStatusHike };
}
