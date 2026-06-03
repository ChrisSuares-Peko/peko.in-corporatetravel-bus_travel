import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import {
    chagneStatusSubCorporate,
    createSubCorporate,
    deleteSubCorporate,
    resendInvitation,
    updateSubCorporate,
    validateCreateSubCorporate,
} from '../../api/userManagement';
import { FormValues, SubCorporate } from '../../types/userManagement';
import { serviceCategories } from '../../utils';

interface userCrudProps {
    reloadTable: () => void;
    handleCancel: () => void;
    selectedRow?: SubCorporate;
}
export default function useCrud({ handleCancel, reloadTable, selectedRow }: userCrudProps) {
    const { services } = useAppSelector(state => state.reducer.subscriptions);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const [isInitialSubmit, setIsInitialSubmit] = useState(true);

    const validateBeforeCreateSubUser = async (values: FormValues) => {
        setIsLoading(true);

        const data: {} | false = await validateCreateSubCorporate({
            ...values,
        });

        if (data) {
            setIsInitialSubmit(false);
        }
        setIsLoading(false);
    };

    const createSubUser = async (values: FormValues & { services: { [key: string]: boolean } }) => {
        const serviceObj = values.services;
        const atleastOne = Object.values(serviceObj).some(value => value === true);
        if (!atleastOne) {
            dispatch(
                showToast({
                    variant: 'error',
                    description: 'Please select atleast one service',
                })
            );
            return;
        }
        setIsLoading(true);
        delete values.confirmemail;
        const serviceList = Object.keys(serviceObj)
            .map(key => ({
                label: key,
                hasAccess: serviceObj[key],
            }))
            .filter(permission => permission.hasAccess);

        const data = await createSubCorporate({
            ...values,
            name: values.name.trim(),
            services: serviceList,
        });

        if (data) {
            handleCancel();
            reloadTable();
            dispatch(
                showToast({
                    variant: 'success',
                    description: data.message,
                })
            );
        }
        setIsLoading(false);
    };

    const updateServiceAccess = async (values: { [key: string]: boolean }, subUserId: number) => {
        const atleastOne = Object.values(values).some(value => value === true);

        if (!atleastOne) {
            dispatch(
                showToast({
                    variant: 'error',
                    description: 'Please select atleast one service',
                })
            );
            return;
        }
        setIsLoading(true);

        const payload = Object.keys(values)
            .map(key => ({
                label: key,
                hasAccess: values[key],
            }))
            .filter(permission => permission.hasAccess);

        const data = await updateSubCorporate({
            services: payload,
            subUserId,
        });

        if (data) {
            dispatch(
                showToast({
                    variant: 'success',
                    description: data.message,
                })
            );
            handleCancel();
            reloadTable();
        }
        setIsLoading(false);
    };

    const deleteSubUser = async (subUserId: number) => {
        setIsLoading(true);
        const data = await deleteSubCorporate(subUserId);

        if (data) {
            reloadTable();
            dispatch(
                showToast({
                    variant: 'success',
                    description: data.message,
                })
            );
        }
        handleCancel();
        setIsLoading(false);
    };

    const blockSubUser = async (subUserId: number, status: string) => {
        setIsLoading(true);
        const data: {} | false = await chagneStatusSubCorporate({ subUserId, status });

        if (data) {
            reloadTable();
            dispatch(
                showToast({
                    variant: 'success',
                    description: 'User status updated successfully',
                })
            );
        }
        handleCancel();
        setIsLoading(false);
    };

    const resendInvite = async (subUserId: number) => {
        setIsLoading(true);
        const data: {} | false = await resendInvitation(subUserId);

        if (data) {
            dispatch(showToast({ description: 'Resend successfully', variant: 'success' }));
        }
        setIsLoading(false);
    };

    const corporateServices = serviceCategories
        .filter(category =>
            category.accessKeys.every(key => services?.userAccessibleServices.includes(key))
        )
        .map(category => category.label);

    const initialValues = !selectedRow
        ? {}
        : selectedRow.services.reduce((acc: { [key: string]: boolean }, service) => {
              acc[service.label] = service.hasAccess;
              return acc;
          }, {});

    return {
        validateBeforeCreateSubUser,
        isInitialSubmit,
        setIsInitialSubmit,
        createSubUser,
        updateServiceAccess,
        deleteSubUser,
        blockSubUser,
        resendInvite,
        isLoading,
        corporateServices,
        initialValues,
    };
}
