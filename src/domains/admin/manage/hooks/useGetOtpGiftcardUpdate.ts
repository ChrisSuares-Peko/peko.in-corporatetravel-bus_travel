import { useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getOtp } from '../api/giftCards';

export const useGetOtpApi = () => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);

    const fetchOtp = async () => {
        setIsLoading(true);
        const data = await getOtp({
            userId: id,
            userType: role,
        });
        if (data) {
            return true;
        }
        return false;
    };
    return { fetchOtp, isLoading };
};
