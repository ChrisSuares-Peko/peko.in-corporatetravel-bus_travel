import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { getDashboardData } from '../api';
import { setpaymentLinkKybStatus } from '../slices/InvoicesSlices';
import { DashboardApiResponse } from '../types';

export default function useDashboard() {
    const { id, role } = useAppSelector(store => store.reducer.auth);

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<DashboardApiResponse>();
    const dispatch = useAppDispatch();
    const dashboardData = useCallback(async () => {
        const response: DashboardApiResponse | false = await getDashboardData({
            userId: id,
            userType: role,
        });

        if (response) {
            dispatch(setpaymentLinkKybStatus(response.paymentLinkKYB));
            setData(response);
            setIsLoading(false);
        }
    }, [id, role, dispatch]);

    useEffect(() => {
        dashboardData();
    }, [dashboardData]);

    return { data, isLoading };
}
