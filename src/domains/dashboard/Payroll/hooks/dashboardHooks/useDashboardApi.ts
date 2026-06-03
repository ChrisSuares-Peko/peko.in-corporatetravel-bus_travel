import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getDashboardDetails } from '../../api/dashBoardIndex';
import { activities, dashboardResponse } from '../../types/dashboardTypes';

export function useDashboardApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);

    const [details, setDetails] = useState<dashboardResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [activityData, setActivityData] = useState<activities[]>([]);

    const getDashboardData = useCallback(async () => {
        setIsLoading(true);
        const data: dashboardResponse | false = await getDashboardDetails({
            userId: id,
            userType: role,
        });

        if (data) {
            setDetails(data);
            const upcomingActivities = data.upcomingActivities as activities[];
            setActivityData(upcomingActivities.slice(0, 6));
        }
        setIsLoading(false);
    }, [id, role]);
    useEffect(() => {
        getDashboardData();
    }, [getDashboardData]);
    return { isLoading, data: details, activities: activityData };
}
