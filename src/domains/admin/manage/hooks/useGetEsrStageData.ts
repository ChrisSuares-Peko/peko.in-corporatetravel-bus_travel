import { useCallback, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { EsrStageDataResp } from '@components/molecular/esrCommonFolder/types/types';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import { getStageDetails } from '../api/esrApi';

export default function useGetEsrStageData(stateData: any) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<EsrStageDataResp>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getStageData = useCallback(
        async (docId: any, stageId: any) => {
            setIsLoading(true);
            const result: any | false = await getStageDetails({
                userId: id,
                userType: role,
                id: docId,
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
        if (stateData.docId && stateData.stageId) {
            getStageData(stateData.docId, stateData.stageId);
        } else {
            dispatch(
                showToast({ description: 'Something went wrong try again', variant: 'error' })
            );
            navigate(paths.admin.manage);
        }
    }, [getStageData, navigate, stateData, dispatch]);

    return { data, isLoading };
}
