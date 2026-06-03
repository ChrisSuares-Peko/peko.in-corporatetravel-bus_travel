import { useCallback, useEffect, useState } from 'react';

import { getRequests } from '../api';

export function useGetRequests() {
    const [requests, setRequests] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const data = await getRequests();
        const preData = data.filter((it: any) => it.status === 'PENDING');
        setRequests(preData);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { requests, isLoading, refresh: fetchData };
}
