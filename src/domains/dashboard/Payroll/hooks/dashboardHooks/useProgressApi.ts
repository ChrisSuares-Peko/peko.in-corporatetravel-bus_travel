/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { progress } from '../../api/dashBoardIndex';
import { setPayrollProgress } from '../../slices/payrollAuth';
import { progressResponse } from '../../types/dashboardTypes';

export function useProgressApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const getProgress = useCallback(async () => {
        const data: progressResponse | false = await progress({
            userId: id,
            userType: role,
        });

        if (data) {
            dispatch(setPayrollProgress(data));
        } else {
            navigate(paths.dashboard.serviceNotAvailable);
        }
        setIsLoading(false);
    }, [id, role, dispatch]);

    useEffect(() => {
        getProgress();
    }, [getProgress]);
    return { isLoading };
}
