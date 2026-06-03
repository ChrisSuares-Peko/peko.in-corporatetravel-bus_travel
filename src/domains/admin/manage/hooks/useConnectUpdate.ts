import { useCallback, useEffect, useState } from 'react';

import { commonSelectType } from '@customtypes/general';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { createConnect, getConnectCategory, putUpdateConnect } from '../api/connect';
import { ApiResponseConnectCategory, ConnectBody, ConnectWithoutID } from '../types/connect';

export default function useConnectUpdate() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [responseData, setResponseData] = useState<ConnectBody | {}>();
    const [categories, setCategories] = useState<commonSelectType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handleConnectCreation = async (payload: ConnectWithoutID) => {
        setIsLoading(true);
        const response: false | ConnectBody = await createConnect({
            ...payload,
            userId: id,
            userType: role,
        });

        if (response !== false) {
            dispatch(
                showToast({
                    description: `Serivce provider created successfully`,
                    variant: 'success',
                })
            );
        }

        setResponseData(response);
        setIsLoading(false);
        return response;
    };

    const updateConnectDetails = useCallback(
        async (vendorUpdatedData: ConnectBody) => {
            setIsLoading(true);
            const response: {} | false = await putUpdateConnect({
                userId: id,
                userType: role,
                ...vendorUpdatedData,
            });

            if (response !== false) {
                dispatch(
                    showToast({
                        description: `Serivce provider updated successfully`,
                        variant: 'success',
                    })
                );
            }

            setResponseData(response);
            setIsLoading(false);
            return response;
        },
        [dispatch, id, role]
    );

    const getData = useCallback(async () => {
        setIsLoading(true);
        const data: ApiResponseConnectCategory | false = await getConnectCategory();
        if (data) {
            setCategories(
                data.connectCategory.map(item => ({
                    oName: item.label,
                    oValue: item.value,
                }))
            );
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    return { handleConnectCreation, responseData, isLoading, updateConnectDetails, categories };
}
