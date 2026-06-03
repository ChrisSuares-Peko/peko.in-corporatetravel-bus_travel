import { useState, useCallback, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { getStageData } from '../api/esr';
import { EsrStageDataResp } from '../types/types';

export const useGetStageData = (stateData: any) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [stageStepData, setStageStepData] = useState<EsrStageDataResp>();
    const [resubmit, setResubmit] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const getData = useCallback(
        async (fisicalYear: string, stageNo: string) => {
            setIsLoading(true);
            const data: EsrStageDataResp | false = await getStageData({
                userId: id,
                userType: role,
                fisicalYear,
                stageNo,
            });

            if (data) {
                setStageStepData(data);
            } else {
                navigate(`${paths.dashboard.accounting}/${paths.esr.index}`);
            }
            setIsLoading(false);
        },
        [id, navigate, role]
    );
    useEffect(() => {
        if (stateData && stateData?.stageId && stateData?.fiscalYear) {
            getData(stateData.fiscalYear, stateData.stageId);
            setResubmit(stateData?.resubmit || false);
        } else {
            navigate(`${paths.dashboard.accounting}/${paths.esr.index}`);
        }
    }, [getData, navigate, stateData]);
    return { stageStepData, isLoading, resubmit };
};
