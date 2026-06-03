import { useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { updateWccCredit } from '../api';

export function useUpdateWccCredit() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);

    const BusinessProfile = async (projectId: string, amount: number) => {
        setIsLoading(true);

        const response = await updateWccCredit({
            userId: id,
            userType: role,
            id: projectId,
            amount,
            action: 'ADD',
        });

        if (response) {
            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };
    return { BusinessProfile, isLoading };
}
