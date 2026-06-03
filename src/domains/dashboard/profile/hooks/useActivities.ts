import { useCallback, useEffect, useState } from 'react';

import { DropDown } from '@customtypes/general';

import { getActivities } from '../api/general';
import { ActivityResponse } from '../types';

export default function useActivities() {
    const [activityList, setActivityList] = useState<DropDown>();

    const fetchActivities = useCallback(async () => {
        const data: ActivityResponse | false = await getActivities();
        if (data) {
            setActivityList(data.companyActivity);
        }
    }, []);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    return { activityList };
}
