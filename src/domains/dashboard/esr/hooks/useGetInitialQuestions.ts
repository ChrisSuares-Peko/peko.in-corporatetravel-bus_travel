import { useState, useCallback, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { getQuestionUsingStageID } from '../api/esr';
import { ESRProcessData, Stage } from '../types/types';

export const useGetInitialQuestions = (stateData: any) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [stageData, setStageData] = useState<Stage>();
    const [fisicalYear, setFisicalYear] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const getQuestions = useCallback(
        async (stageId: string) => {
            setIsLoading(true);
            const data: ESRProcessData | false = await getQuestionUsingStageID({
                userId: id,
                userType: role,
                stageId,
            });

            if (data) {
                setStageData(data.stages[0]);
            }
            setIsLoading(false);
        },
        [id, role]
    );

    useEffect(() => {
        if (stateData && stateData.stageId && stateData.fiscalYear) {
            setFisicalYear(stateData.fiscalYear);
            getQuestions(stateData.stageId);
        } else {
            navigate(`${paths.dashboard.accounting}/${paths.esr.index}`);
        }
    }, [getQuestions, navigate, stateData]);
    return { fisicalYear, stageData, isLoading };
};
