import { useCallback, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import { getStageDetails } from '../api/esr';
import { Stage } from '../types/types';

export default function useGetEsrStageData(stateData: any) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<Stage>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getStageData = useCallback(
        async (fiscalYear: any, stageId: any) => {
            setIsLoading(true);
            const result: Stage | false = await getStageDetails({
                userId: id,
                userType: role,
                fiscalYear,
                stageId,
            });
            if (result) {
                setData(result);
            }
            setIsLoading(false);
        },
        [id, role]
    );
    useEffect(() => {
        if (stateData.fiscalYear && stateData.stageId) {
            getStageData(stateData.fiscalYear, stateData.stageId);
        } else {
            dispatch(
                showToast({ description: 'Something went wrong try again', variant: 'error' })
            );
            navigate(`${paths.dashboard.accounting}/${paths.esr.index}`);
        }
    }, [getStageData, navigate, stateData, dispatch]);

    return { data, isLoading };
}
