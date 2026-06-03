import { useState, useCallback, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { GetKybDetails } from '../api/kyb';
import { SubmittedKYBDetailsResponse } from '../types/kyb';

export const useGetKYBDetailsApi = () => {
    const { role, id } = useAppSelector(state => state.reducer.auth);

    const [kybData, setKybData] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const getKYBData = useCallback(async () => {
        setIsLoading(true);
        const data: SubmittedKYBDetailsResponse | false = await GetKybDetails({
            userId: id,
            userType: role,
        });
        if (data) {
            const arr = data?.rows[0];
            setKybData(arr);
        }
        setIsLoading(false);
    }, [id, role]);
    useEffect(() => {
        getKYBData();
    }, [getKYBData]);

    return {
        kybData,
        isLoading,
    };
};
