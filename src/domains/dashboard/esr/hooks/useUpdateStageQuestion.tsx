import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { submitAnswers } from '../api/esr';
import { Stage } from '../types/types';

export default function useUpdateStageQuestion() {
    const navigate = useNavigate();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const updateAnswer = useCallback(
        async (stageData: Stage & { fisicalYear: string | undefined }) => {
            setIsLoading(true);
            const resp: any | false = await submitAnswers({
                userId: id,
                userType: role,
                stageData,
            });
            if (resp) {
                navigate(
                    `${paths.dashboard.accounting}/${paths.esr.index}/${paths.esr.stageSuccess}`,
                    { state: { title: stageData.stageTitle } }
                );
                console.log(resp);
            }
            setIsLoading(false);
        },
        [id, navigate, role]
    );
    return { updateAnswer, btnLoading: isLoading };
}
