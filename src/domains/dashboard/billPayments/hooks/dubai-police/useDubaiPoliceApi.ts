import { useCallback, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getBalanceApi } from '../../api/dubaiPolice';
import { DubaiPoliceBalanceResponse, dubaiPoliceOptional } from '../../types/dubaiPolice';

export function useDubaiPolice() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [limitData, setLimitData] = useState<DubaiPoliceBalanceResponse>();

    const getBalance = useCallback(
        async (accountNo: string, flexiKey: string, optional: dubaiPoliceOptional) => {
            const data: DubaiPoliceBalanceResponse | false = await getBalanceApi({
                userId: id,
                userType: role,
                accountNo,
                flexiKey,
                optional,
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
