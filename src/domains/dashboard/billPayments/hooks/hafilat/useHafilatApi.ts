import { useCallback, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getBalanceApi } from '../../api/haflat';
import { HaflatBalanceResponse } from '../../types/haflat';

export function useHafilatApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [limitData, setLimitData] = useState<HaflatBalanceResponse>();

    const getBalance = useCallback(
        async (trafficNo: string, flexiKey: string) => {
            const data: HaflatBalanceResponse | false = await getBalanceApi({
                userId: id,
                userType: role,
                trafficNo,
                flexiKey,
            });
            if (data) {
                setLimitData(data);
                return data;
            }
            setIsLoading(false);
            return false;
        },
        [id, role]
    );

    return { limitData, isLoading, getBalance };
}
