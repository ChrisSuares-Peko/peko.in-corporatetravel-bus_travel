import { useState } from 'react';

import { useAppSelector } from '@src/hooks/store';
import useUserInfo from '@src/hooks/useUserInfo';

import { stopWhatsAppBilling } from '../api';

export function useStopWhatsappBillingApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const { getUserServicesData } = useUserInfo();

    const stopBilling = async () => {
        setIsLoading(true);

        const response = await stopWhatsAppBilling({
            userId: id,
            userType: role,
        });

        if (response) {
            getUserServicesData();
            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };

    return { stopBilling, isLoading };
}
