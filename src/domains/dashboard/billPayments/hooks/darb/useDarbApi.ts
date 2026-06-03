import { useCallback, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getBalanceApi } from '../../api/darb';
import { GetLimitResponse } from '../../types';

export function useDarbApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [limitData, setLimitData] = useState<GetLimitResponse>();

    const getBalance = useCallback(
        async (eid: string, trafficNo: string, flexiKey: string) => {
            const data: any | false = await getBalanceApi({
                userId: id,
                userType: role,
                eid,
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
