import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getAllAlerts } from '../api';
import { Alert, AllAlertsResponse } from '../types';

export default function useAlertsApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [allAlerts, setAllAlerts] = useState<Alert[]>();
    const [isLoading, setIsLoading] = useState(true);

    const getDashboardCounts = useCallback(async () => {
        const data: AllAlertsResponse | false = await getAllAlerts({
            userId: id,
            userType: role,
        });
        if (data) {
            setAllAlerts(data.alerts);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, role]);

    useEffect(() => {
        getDashboardCounts();
    }, [getDashboardCounts]);

    return { alerts: allAlerts, isLoading };
}
