import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getEmployeeCount } from '../../api/dashBoardIndex';
import { employeeCountResponse } from '../../types/dashboardTypes';

export default function useGetEmployeeCount() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(0);
    const [date, setDate] = useState<string>();

    const getSignCount = useCallback(async () => {
        setIsLoading(true);
        const data: employeeCountResponse | false = await getEmployeeCount({
            userId: id,
            userType: role,
        });

        if (data) {
            setCount(data.count);
            setDate(data.lastEmployeeAddedDate);
        }
        setRefresh(false);
        setIsLoading(false);
    }, [id, role]);

    useEffect(() => {
        getSignCount();
    }, [getSignCount, refresh]);

    return { isLoading, count, setRefresh, date };
}
