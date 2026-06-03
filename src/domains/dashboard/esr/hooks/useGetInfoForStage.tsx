import { useState, useCallback, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { formattedDateOnly } from '@utils/dateFormat';

import { getStageData } from '../api/esr';
import { ViewData } from '../types/types';

export const useGetInfoForStage = (stateData: any) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [stageStepData, setStageStepData] = useState<ViewData>();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const getData = useCallback(
        async (fisicalYear: string, stageNo: string) => {
            setIsLoading(true);
            const data: any | false = await getStageData({
                userId: id,
                userType: role,
                fisicalYear,
                stageNo,
            });

            if (data) {
                console.log('🚀 ~ data:', data);
                setStageStepData({
                    certificate: data?.certificate || '',
                    stageNo: data.stageNo,
                    fiscalyear: data?.registrationId?.fiscalYear,
                    date: formattedDateOnly(new Date(data?.updatedAt)),
                    remarks: data?.remarks || 'N/A',
                    stageTitle: data?.stageTitle,
                    status: data.status,
                });
            } else {
                navigate(`${paths.dashboard.accounting}/${paths.esr.index}`);
            }
            setIsLoading(false);
        },
        [id, navigate, role]
    );
    useEffect(() => {
        if (stateData && stateData.stageId && stateData.fiscalYear) {
            getData(stateData.fiscalYear, stateData.stageId);
        } else {
            navigate(`${paths.dashboard.accounting}/${paths.esr.index}`);
        }
    }, [getData, navigate, stateData]);
    return { stageStepData, isLoading };
};
