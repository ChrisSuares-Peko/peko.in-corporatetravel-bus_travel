import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import { beneficiaryUpdate } from '../api/BeneficiaryRegistrationApis';
import { BeneficiaryFormType, BeneficiaryTableRow } from '../types/types';

export function useUpdateBeneficiary(handleCancel?: () => void) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const updateBeneficiaryById = useCallback(
        async (values: BeneficiaryFormType, bId: BeneficiaryTableRow) => {
            const beneficiaryData = values.beneficiaryInformation;

            const payload = {
                beneficiaryData,
                bId,
                userId: id,
                userType: role,
            };

            const data = await beneficiaryUpdate(payload);

            if (data) {
                navigate(`/${paths.dashboard.vendorPayouts}/${paths.vendorPayouts.beneficiary}`);
                dispatch(
                    showToast({
                        variant: 'success',
                        description: 'Beneficiary updated successfully',
                    })
                );
                // dispatch(resetBeneficiary());  // reset slice once the user is updated
                if (handleCancel) handleCancel();
            } else {
                dispatch(
                    showToast({
                        variant: 'error',
                        description: 'Failed to update the beneficiary. Please try again.',
                    })
                );
            }
        },
        [id, role, navigate, dispatch, handleCancel]
    );

    return { updateBeneficiaryById };
}
