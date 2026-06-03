import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { createBusinessProfile } from '../api';

export function useCreateBusinessProfileApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const BusinessProfile = async () => {
        setIsLoading(true);

        const response = await createBusinessProfile({
            userId: id,
            userType: role,
        });

        if (response) {
            setIsLoading(false);
            return true;
        }
        setIsLoading(false);
        navigate(paths.dashboard.serviceNotAvailable);
        return false;
    };
    return { BusinessProfile, isLoading };
}
