import { useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getRedirectURL } from '../api';
import { GetRedirectURLRes } from '../types/types';

export default function useGetRedirectURL() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [IFrameRes, setIFrameRes] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);

    const handleGetRedirectURL = async (redirectType: string, landingUrl?: string) => {
        setIsLoading(true);
        const data: GetRedirectURLRes | false = await getRedirectURL({
            userId: id,
            userType: role,
            redirectType,
            landingUrl: landingUrl || '',
        });
        if (data) {
            setIFrameRes(data);
            setIsLoading(false);
            return data;
        }
        setIsLoading(false);
        return false;
    };

    return { data: IFrameRes, isLoading, handleGetRedirectURL };
}
