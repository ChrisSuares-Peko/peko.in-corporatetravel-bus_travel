import { useCallback, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import { submitStage1Steps } from '../api/esr';

export default function useUpdateStepsForStage1() {
    const navigate = useNavigate();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(0);
    const dispatch = useDispatch();
    const updateAnswer = useCallback(
        async (stageData: any & { fisicalYear: string | undefined }) => {
            setIsLoading(true);
            const resp: any | false = await submitStage1Steps({
                userId: id,
                userType: role,
                stageData,
            });

            console.log(resp, 'resp');
            console.log(stageData.stepNo, 'stepno');
            if (resp && stageData.stepNo === 7) {
                navigate(
                    `${paths.dashboard.accounting}/${paths.esr.index}/${paths.esr.stageSuccess}`
                );
                console.log(resp);
            } else if (resp && stageData.save) {
                dispatch(
                    showToast({
                        description: 'Saved Successfully',
                        variant: 'success',
                    })
                );
                setIsLoading(false);
                return;
            } else if (resp) {
                setCurrent(current + 1);
            } else {
                dispatch(
                    showToast({
                        description: 'Something went wrong,Please try again later.',
                        variant: 'error',
                    })
                );
            }
            setIsLoading(false);
        },
        [current, dispatch, id, navigate, role]
    );
    return { updateAnswer, btnLoading: isLoading, current, setCurrent };
}
