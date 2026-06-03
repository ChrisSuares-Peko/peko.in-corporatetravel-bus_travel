import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { getAllBeneficiaries, getLastFiveBeneficiaries } from '../../api/beneficiary';
import { setData } from '../../slices/beneficiary';
import { AllBeneficiariesResponse, UseGetBeneficiariesProps } from '../../types';

export default function useGetBeneficiary({ accesskey }: UseGetBeneficiariesProps) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const { tableData, isLoading } = useAppSelector(state => state.reducer.beneficiary);
    const dispatch = useAppDispatch();

    const getBeneficiariesList = useCallback(async () => {
        dispatch(setData({ tableData: [], isLoading: true }));
        const data: AllBeneficiariesResponse | false = !accesskey
            ? await getLastFiveBeneficiaries({ userId: id, userType: role })
            : await getAllBeneficiaries({ userId: id, userType: role, accesskey });

        dispatch(
            setData({
                tableData: data && data.data.length > 0 ? data.data : [],
                isLoading: false,
            })
        );
    }, [id, role, dispatch, accesskey]);

    useEffect(() => {
        getBeneficiariesList();
    }, [getBeneficiariesList]);

    return {
        tableData,
        isLoading,
    };
}
