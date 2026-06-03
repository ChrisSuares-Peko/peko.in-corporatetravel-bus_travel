import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import {
    updateEmployeeBankDetails,
    updateEmployeeInformation,
    updateEmployeePersonalInfo,
    updateEmployeeSalaryDetails,
    updateExitInformation,
} from '../../api/employeeApi';
import { UpdatePayloadNew } from '../../types/types';

export function useUpdateEmployeeApiNew() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();

    const showSuccessToast = () => {
        dispatch(
            showToast({
                variant: 'success',
                description: 'Employee details updated successfully',
            })
        );
        return true;
    };

    const showFailureToast = () => {
        dispatch(
            showToast({
                variant: 'error',
                description: 'Employee details not updated. Please try again',
            })
        );
    };

    const updateBankDetails = async (payload: UpdatePayloadNew) => {
        setIsLoading(true);
        const response = await updateEmployeeBankDetails({
            ...payload,
            userId: id,
            userType: role,
        });
        if (response) {
            showSuccessToast();
            return true;
        }
        showFailureToast();
        setIsLoading(false);
        return false;
    };

    const updateSalaryDetails = async (payload: UpdatePayloadNew) => {
        setIsLoading(true);
        const response = await updateEmployeeSalaryDetails({
            ...payload,
            userId: id,
            userType: role,
        });
        if (response) {
            // message.success(response.message);
            showSuccessToast();
            return true;
        }
        dispatch(
            showToast({
                variant: 'error',
                description: 'Basic Salary cannot update ,an increment is already given',
            })
        );

        setIsLoading(false);
        return false;
    };
    const updateEmployeeInfo = async (payload: UpdatePayloadNew) => {
        setIsLoading(true);
        const response = await updateEmployeeInformation({
            ...payload,
            userId: id,
            userType: role,
        });
        if (response) {
            showSuccessToast();
            return true;
        }
        showFailureToast();
        setIsLoading(false);
        return false;
    };
    // const updateEmployeePersonalDetails = async (payload: UpdatePayloadNew) => {
    //     setIsLoading(true);
    //     const response = await updateEmployeePersonalInfo({
    //         ...payload,
    //         userId: id,
    //         userType: role,
    //     });
    //     if (response) {
    //         showSuccessToast();
    //         return true;
    //     }
    //     showFailureToast();
    //     setIsLoading(false);
    //     return false;
    // };

    const updateEmployeePersonalDetails = async (payload: UpdatePayloadNew) => {
        setIsLoading(true);
        try {
            const response = await updateEmployeePersonalInfo({
                ...payload,
                userId: id,
                userType: role,
            });

            if (response.success) {
                showSuccessToast();
                return true;
            }
            dispatch(
                showToast({
                    variant: 'error',
                    description:
                        response.errorMessage ||
                        'Failed to update the employee details due to an unexpected issue.Please try again later',
                })
            );
        } catch (error) {
            console.error('Error updating personal details', error);
            showFailureToast();
        } finally {
            setIsLoading(false); // Ensure loading is turned off after the operation
        }
        return false;
    };

    const updateExitInfo = async (payload: UpdatePayloadNew) => {
        setIsLoading(true);
        const response = await updateExitInformation({
            ...payload,
            userId: id,
            userType: role,
        });
        if (response) {
            showSuccessToast();
            return true;
        }
        showFailureToast();
        setIsLoading(false);
        return false;
    };
    return {
        updateBankDetails,
        updateSalaryDetails,
        updateEmployeeInfo,
        updateEmployeePersonalDetails,
        updateExitInfo,
        isLoading,
    };
}
