import { useCallback, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import { useAppSelector } from '@src/hooks/store';

import { getAllCouponCodeData, updateCouponCodeStatus } from '../api/couponCode';
import { getCoupon, updateStatus } from '../types/couponCode';

const useGetCouponCodes = (payload: getCoupon) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<any[]>();
    const dispatch = useDispatch();
    const getDataFromApi = useCallback(async () => {
        setIsLoading(true);
        const data = await getAllCouponCodeData({
            userId: id,
            userType: role,
            ...payload,
        });
        if (data) {
            setTableData(data.data);
            setCount(data.recordsTotal);
        }
        setRefresh(false);
        setIsLoading(false);
    }, [id, role, payload]);

    const updateActiveStatus = useCallback(
        async ({ couponId, status }: updateStatus) => {
            setIsLoading(true);
            const data = await updateCouponCodeStatus({
                userId: id,
                userType: role,
                couponId,
                status,
            });
            if (data) {
                setRefresh(true);
            }
        },
        [id, role]
    );

    useEffect(() => {
        getDataFromApi();
    }, [getDataFromApi, refresh]);

    return {
        isLoading,
        tableData,
        count,
        updateActiveStatus,
        // deleteDoc,
        setRefresh,
    };
};

export default useGetCouponCodes;
