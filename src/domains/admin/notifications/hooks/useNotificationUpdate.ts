import { useCallback, useEffect, useState } from 'react';

// import { commonSelectType } from '@customtypes/general';
import { DropDown, SuccessGenericResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import { createNotification, getAllCorporates, putUpdateNotification } from '../api';
import { CorporateListResponse, NotificationData, NotificationDataWithoutId } from '../types';

export default function useNotificationUpdate(searchText: string) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [responseData, setResponseData] = useState<NotificationData | {}>();
    const [corporates, setCorporateList] = useState<DropDown>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleNotificationCreation = async (payload: NotificationDataWithoutId) => {
        setIsLoading(true);
        const response: false | SuccessGenericResponse<NotificationData> = await createNotification(
            {
                ...payload,
                userId: id,
                userType: role,
            }
        );

        setResponseData(response);
        setIsLoading(false);
        return response;
    };

    const updateNotificationDetails = useCallback(
        async (vendorUpdatedData: NotificationData) => {
            setIsLoading(true);
            const response: SuccessGenericResponse<NotificationData> | false =
                await putUpdateNotification({
                    userId: id,
                    userType: role,
                    ...vendorUpdatedData,
                });
            setResponseData(response);
            setIsLoading(false);
            return response;
        },
        [id, role]
    );

    const getCorporateList = useCallback(async () => {
        setIsLoading(true);
        const data: CorporateListResponse | false = await getAllCorporates({
            userId: id,
            userType: role,
            searchText,
        });
        setIsLoading(false);
        if (data) {
            const { result } = data;
            const arr = result.map(corporate => ({
                label: `${corporate.name} ${corporate?.username}`,
                value: corporate.username,
            }));

            setCorporateList(arr);
        }
    }, [id, role, searchText]);

    useEffect(() => {
        getCorporateList();
    }, [getCorporateList]);

    return {
        handleNotificationCreation,
        responseData,
        isLoading,
        updateNotificationDetails,
        corporates,
    };
}
