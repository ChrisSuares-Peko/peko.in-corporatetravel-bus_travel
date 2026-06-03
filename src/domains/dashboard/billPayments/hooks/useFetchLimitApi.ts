import { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { getLimit } from '../api';
import { GetLimitResponse } from '../types';

export function useFetchLimitApi(path: string) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [limitData, setLimitData] = useState<GetLimitResponse>();
    const navigate = useNavigate();
    const getBillLimit = useCallback(async () => {
        const data: GetLimitResponse | false = await getLimit({
            userId: id,
            userType: role,
            path,
        });
        if (data) {
            setLimitData(data);
        } else {
            navigate(paths.dashboard.serviceNotAvailable);
        }
        setIsLoading(false);
    }, [id, role, path, navigate]);

    useEffect(() => {
        getBillLimit();
    }, [getBillLimit]);

    return { limitData, isLoading };
}
