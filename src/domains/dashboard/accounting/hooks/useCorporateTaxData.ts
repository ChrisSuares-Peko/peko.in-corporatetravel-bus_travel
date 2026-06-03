import { useCallback, useEffect, useState } from 'react';

import { SuccessGenericResponse } from '@customtypes/general';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { getCorporateTaxAmount, updateCorporateTax } from '../api';
import { setAmount } from '../slices/accountingSlice';
import { taxAmount, updatePayload } from '../types/types';

export default function useCorporateTaxData() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [amount, setAmountData] = useState<number>();
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useAppDispatch();

    const getAmount = useCallback(async () => {
        const data: taxAmount | false = await getCorporateTaxAmount({
            userId: id,
            userType: role,
        });
        if (data !== false) {
            dispatch(setAmount(data.serviceAmount));
            setAmountData(data.serviceAmount);
        }
        setIsLoading(false);
        return data;
    }, [dispatch, id, role]);

    const updateDetails = useCallback(
        async (payload: updatePayload) => {
            setIsLoading(true);
            const data: SuccessGenericResponse<any> | false = await updateCorporateTax({
                userId: id,
                userType: role,
                ...payload,
            });
            if (data) {
                if (data.status) {
                    dispatch(
                        showToast({
                            description: 'Corporate Tax Registration updated successfully',
                            variant: 'success',
                        })
                    );
                }
                setIsLoading(false);
                return true;
            }

            setIsLoading(false);
            return false;
        },
        [id, role, dispatch]
    );

    useEffect(() => {
        getAmount();
    }, [getAmount]);

    return { isLoading, amount, updateDetails };
}
