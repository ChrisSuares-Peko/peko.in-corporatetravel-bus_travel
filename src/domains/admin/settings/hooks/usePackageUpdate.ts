import { useCallback, useState } from 'react';

import { useDispatch } from 'react-redux';

import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { createPackage, putUpdatePackage } from '../api/package';
import { PackageWithoutID, Packages } from '../types/package';

export default function usePackageUpdate() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [responseData, setResponseData] = useState<Packages | {}>();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const handlePackageCreation = async (payload: PackageWithoutID) => {
        setIsLoading(true);
        if (!payload.partnerId) {
            payload = {
                ...payload,
                partnerId: null,
            };
        }
        const response: false | Packages = await createPackage({
            ...payload,
            userId: id,
            userType: role,
        });

        if (response) {
            dispatch(
                showToast({
                    description: `Package added successfully`,
                    variant: 'success',
                })
            );
        }

        setResponseData(response);
        setIsLoading(false);
        return response;
    };

    const updatePackageDetails = useCallback(
        async (vendorUpdatedData: Packages) => {
            setIsLoading(true);
            if (!vendorUpdatedData.partnerId) {
                vendorUpdatedData = {
                    ...vendorUpdatedData,
                    partnerId: null,
                };
            }
            const response: {} | false = await putUpdatePackage({
                userId: id,
                userType: role,
                ...vendorUpdatedData,
            });
            if (response) {
                dispatch(
                    showToast({
                        description: `Package updated successfully`,
                        variant: 'success',
                    })
                );
            }
            setResponseData(response);
            setIsLoading(false);
            return response;
        },
        [id, role, dispatch]
    );

    return { handlePackageCreation, responseData, isLoading, updatePackageDetails };
}
