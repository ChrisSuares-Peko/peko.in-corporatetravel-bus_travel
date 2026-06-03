import { useCallback, useEffect, useState } from 'react';

import { SubscriptionAddOnResponse, subscriptionHistoryResponse } from '@customtypes/general';
import { getAddonDetails, getSubscriptionHistory } from '@src/services/subscription';

const useGetAddonDetails = (accessKey: string, accessCode: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [addonData, setAddonsData] = useState<SubscriptionAddOnResponse>();
    const [purchaseData, setPurchaseData] = useState<subscriptionHistoryResponse>();

    const getDetails = useCallback(async () => {
        setIsLoading(true);
        const data: SubscriptionAddOnResponse | false = await getAddonDetails(accessKey);

        if (data) {
            setAddonsData(data);
        }
        setIsLoading(false);
    }, [accessKey]);

    const getPurchaseHistory = useCallback(async () => {
        setIsLoading(true);
        const data: subscriptionHistoryResponse | false = await getSubscriptionHistory(accessCode);

        if (data) {
            setPurchaseData(data);
        }
        setIsLoading(false);
    }, [accessCode]);

    useEffect(() => {
        getDetails();
        getPurchaseHistory();
    }, [getDetails, getPurchaseHistory]);

    return { addonData, isLoading, purchaseData };
};

export default useGetAddonDetails;
