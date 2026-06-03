import { useState, useCallback, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getDataUsingFisicalYear } from '../api/esr';
import { FisicalYearResp } from '../types/types';

export const useGetDataByFisicalYear = (fisicalYear: string) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [yearData, setYearData] = useState<FisicalYearResp>();
    const [isLoading, setIsLoading] = useState(false);

    const getData = useCallback(async () => {
        setIsLoading(true);
        const data: FisicalYearResp | false = await getDataUsingFisicalYear({
            userId: id,
            userType: role,
            fisicalYear,
        });

        if (data) {
            setYearData(data);
        }
        setIsLoading(false);
    }, [fisicalYear, id, role]);
    useEffect(() => {
        getData();
    }, [getData]);
    return { yearData, isLoading };
};
