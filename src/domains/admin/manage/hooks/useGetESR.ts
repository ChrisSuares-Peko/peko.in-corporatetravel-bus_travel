import { useCallback, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { getAllData, updateData } from '../api/esrApi';
import { getESR, EsrRecord, ESRModalData } from '../types/ESR';

const useGetESR = (payload: getESR) => {
    const dispatch = useDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [tableData, setTableData] = useState<EsrRecord[]>([]);
    const [count, setCount] = useState<number>(0);

    const fetchESRData = useCallback(async () => {
        setIsLoading(true);
        const data: false | EsrRecord | EsrRecord[] = await getAllData({
            userId: id,
            userType: role,
            ...payload,
        });
        if (data && Array.isArray(data)) {
            setTableData(data);
            setCount(data.length);
        }
        setRefresh(false);
        setIsLoading(false);
    }, [id, role, payload]);

    const updateESR = useCallback(
        async (payloadData: ESRModalData) => {
            setIsLoading(true);
            const data: {} | false = await updateData({
                userId: id,
                userType: role,
                ...payloadData,
            });
            if (data) {
                dispatch(
                    showToast({
                        description: 'Status updated successfully',
                        variant: 'success',
                    })
                );
                setRefresh(true);
                return true;
            }
            setIsLoading(false);
            return false;
        },
        [dispatch, id, role]
    );

    useEffect(() => {
        fetchESRData();
    }, [fetchESRData, refresh]);

    return {
        isLoading,
        tableData,
        count,
        updateESR,
        setRefresh,
    };
};

export default useGetESR;
