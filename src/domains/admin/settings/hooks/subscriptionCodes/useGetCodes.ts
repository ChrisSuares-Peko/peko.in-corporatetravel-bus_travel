import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getAllActivationCodes, updateStatus } from '../../api/subscriptionCode';
import {
    AllSubscriptionCodeResponse,
    CodesFilterType,
    SubscriptionCode,
} from '../../types/subscriptionCodes';

const useGetCodes = (payload: CodesFilterType) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<SubscriptionCode[]>();

    const getDataFromApi = useCallback(async () => {
        setIsLoading(true);

        const data: AllSubscriptionCodeResponse | false = await getAllActivationCodes({
            userId: id,
            userType: role,
            ...payload,
        });
        if (data) {
            setTableData(data.rows);
            setCount(data.count);
        }
        setRefresh(false);
        setIsLoading(false);
    }, [id, role, payload]);

    const updateActiveStatus = useCallback(
        async (rowId: number, status: boolean) => {
            setIsLoading(true);
            const data = await updateStatus({
                userId: id,
                userType: role,
                rowId,
                status,
            });
            if (data) {
                setRefresh(true);
            }
            setIsLoading(false);
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
        setRefresh,
        updateActiveStatus,
    };
};

export default useGetCodes;
