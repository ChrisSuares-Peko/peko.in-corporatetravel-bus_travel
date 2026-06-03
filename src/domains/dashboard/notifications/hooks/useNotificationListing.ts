import { useState, useCallback, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { notificationListing } from '../api';
import { NotificationData, NotificationsResponse } from '../types';

export const useNotificationListingApi = (
    fromDate: string,
    toDate: string,
    page: number,
    search: string
) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);

    const [tableDetails, setTableDetails] = useState<NotificationData[]>([]);
    const [count, setCount] = useState<number>();

    const [isLoading, setIsLoading] = useState(true);

    const getNotificationList = useCallback(async () => {
        setIsLoading(true);
        const data: NotificationsResponse | false = await notificationListing({
            userId: id,
            userType: role,
            fromDate,
            toDate,
            page,
            search,
        });

        if (data) {
            const listingData = data;

            const arr = listingData;

            setTableDetails(arr.data);
            setCount(listingData.recordsTotal);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [fromDate, id, role, toDate, page, search]);
    useEffect(() => {
        getNotificationList();
    }, [getNotificationList]);

    return { data: tableDetails, isLoading, count, getNotificationList };
};
