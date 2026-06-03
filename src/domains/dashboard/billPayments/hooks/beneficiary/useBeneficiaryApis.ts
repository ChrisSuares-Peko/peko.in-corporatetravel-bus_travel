import { useCallback, useState } from 'react';

import { SuccessGenericResponse } from '@customtypes/general';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import {
    AddBeneficiaryApi,
    updateBeneficiaryApi,
    deleteBeneficiaryApi,
    getAllBeneficiaries,
    getLastFiveBeneficiaries,
    getBeneficiaryOtp,
    updateBeneficiaryStatusApi,
} from '../../api/beneficiary';
import { setData } from '../../slices/beneficiary';
import {
    AllBeneficiariesResponse,
    BeneficiaryFormValues,
    UseGetBeneficiariesProps,
    addEditBeneficiaryPayload,
    deleteBeneficicaryPayload,
    updateBeneficiaryStatusPayload,
} from '../../types';

export default function useGetBeneficiaries({
    accesskey,
    openOtpModal,
    closeOtpModal,
    closeAddModal,
    closeConfirmationModal,
    formRefName,
}: UseGetBeneficiariesProps) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [buttonLoader, setButtonLoader] = useState(false);
    const [isOtpSending, setIsOtpSending] = useState(false);
    const { refresh, tableData, isLoading } = useAppSelector(state => state.reducer.beneficiary);
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

    const sendOtpApi = async (beneficiaryActionType: string, values?: BeneficiaryFormValues) => {
        setIsOtpSending(true);
        const data: SuccessGenericResponse<{}> | false = await getBeneficiaryOtp({
            userId: id,
            userType: role,
            beneficiaryActionType,
            accountNo: values?.accountNo,
            accessKey: values?.accessKey,
            beneficiaryId: values?.beneficiaryId,
        });
        if (data && data.status) {
            if (openOtpModal && closeConfirmationModal) {
                closeConfirmationModal();
                openOtpModal();
            }
        }
        setIsOtpSending(false);
    };

    const addBeneficiary = async (payload: addEditBeneficiaryPayload) => {
        setButtonLoader(true);
        const data: SuccessGenericResponse<AllBeneficiariesResponse> | false =
            await AddBeneficiaryApi(payload);
        if (data && data.status) {
            dispatch(setData({ refresh: !refresh, isLoading: false }));
            getBeneficiariesList();
            if (closeOtpModal && closeAddModal) {
                closeOtpModal();
                closeAddModal();
                formRefName?.current?.resetForm();
                dispatch(
                    showToast({
                        description: data.message || 'Beneficiary added successfully',
                        variant: 'success',
                    })
                );
            }
        }
        setButtonLoader(false);
    };

    const updateBeneficicary = async (payload: addEditBeneficiaryPayload) => {
        setButtonLoader(true);
        const data: SuccessGenericResponse<AllBeneficiariesResponse> | false =
            await updateBeneficiaryApi(payload);
        if (data && data.status) {
            dispatch(setData({ refresh: !refresh, isLoading: false }));
            getBeneficiariesList();
            if (closeOtpModal && closeAddModal) {
                closeOtpModal();
                closeAddModal();
                formRefName?.current?.resetForm();
                dispatch(
                    showToast({
                        description: data.message || 'Beneficiary updated successfully',
                        variant: 'success',
                    })
                );
            }
        }
        setButtonLoader(false);
    };

    const deleteBeneficicary = async (payload: deleteBeneficicaryPayload) => {
        setButtonLoader(true);
        const data: SuccessGenericResponse<AllBeneficiariesResponse> | false =
            await deleteBeneficiaryApi(payload);
        setButtonLoader(false);
        if (data && data.status) {
            dispatch(setData({ refresh: !refresh, isLoading: false }));
            getBeneficiariesList();
            if (closeAddModal && closeOtpModal) {
                closeOtpModal();
                closeAddModal();
                dispatch(
                    showToast({
                        description: 'Beneficiary deleted successfully',
                        variant: 'success',
                    })
                );
                return true;
            }
            return true;
        }
        return false;
    };
    const updateBeneficiaryStatus = async (payload: updateBeneficiaryStatusPayload) => {
        setButtonLoader(true);
        const data: SuccessGenericResponse<AllBeneficiariesResponse> | false =
            await updateBeneficiaryStatusApi(payload);
        setButtonLoader(false);
        if (data && data.status) {
            return true;
        }
        return false;
    };
    return {
        tableData,
        isLoading,
        refresh,
        buttonLoader,
        sendOtpApi,
        addBeneficiary,
        updateBeneficicary,
        deleteBeneficicary,
        updateBeneficiaryStatus,
        isOtpSending,
    };
}
