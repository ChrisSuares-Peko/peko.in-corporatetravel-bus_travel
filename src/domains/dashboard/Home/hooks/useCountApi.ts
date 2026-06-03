import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getTotalSpentCounts } from '../api';
import { TotalSpentResponse } from '../types';

export default function useCountApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [spentData, setSpentData] = useState<TotalSpentResponse>({
        totalCashback: 0,
        totalSpend: 0,
        totalSpendCurrentMonth: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const getDashboardCounts = useCallback(async () => {
        const data: TotalSpentResponse | false = await getTotalSpentCounts({
            userId: id,
            userType: role,
        });
        if (data) {
            setSpentData({
                totalCashback: data.totalCashback ?? 0,
                totalSpend: data.totalSpend ?? 0,
                totalSpendCurrentMonth: data.totalSpendCurrentMonth ?? 0,
            });
        }
        setIsLoading(false);
    }, [id, role]);

    useEffect(() => {
        getDashboardCounts();
    }, [getDashboardCounts]);

    return { data: spentData, isLoading };
}
