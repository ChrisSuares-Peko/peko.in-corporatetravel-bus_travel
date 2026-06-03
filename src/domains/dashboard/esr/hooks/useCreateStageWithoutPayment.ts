import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { createStageDataApi } from '../api/esr';
import { createEsrTypes } from '../types/types';

export default function useCreateStageWithoutPayment() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const createEsrStage = useCallback(
        async (payload: createEsrTypes) => {
            setIsLoading(true);
            const result: any | false = await createStageDataApi({
                userId: id,
                userType: role,
                ...payload,
            });

            if (result) {
                navigate(paths.esr.registrationAssessment, {
                    state: {
                        stageId: payload.stageId,
                        fiscalYear: payload.fiscalYear,
                    },
                });
            }
            setIsLoading(false);
        },
        [id, navigate, role]
    );

    return { isLoading, createEsrStage };
}
