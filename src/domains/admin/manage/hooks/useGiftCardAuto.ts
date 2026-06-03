import { useCallback, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { autoUpdate, autoUpdateStatus } from '../api/giftCards';
import {
    GiftCardsBody,
    IAutoUpdateResponse,
    IAutoUpdateStatusResponse,
    autoUpdatePayload,
} from '../types/giftCards';

export default function useGiftCardsAutoUpdate() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [responseData, setResponseData] = useState<GiftCardsBody | {}>();
    const [isLoading, setIsLoading] = useState(false);

    const handleGiftCardsAutoUpdate = async (payload: autoUpdatePayload) => {
        setIsLoading(true);
        const response: false | IAutoUpdateResponse = await autoUpdate({
            ...payload,
            userId: id,
            userType: role,
            status: true,
        });

        setResponseData(response);
        setIsLoading(false);
        return response;
    };

    const handleGiftCardsAutoUpdateStatus = useCallback(
        async (updatedData: autoUpdatePayload) => {
            setIsLoading(true);
            const response: IAutoUpdateStatusResponse | false = await autoUpdateStatus({
                userId: id,
                userType: role,
                status: updatedData.status,
                serviceOperatorId: updatedData.serviceOperatorId,
                otp: updatedData.otp,
                scope: updatedData.scope,
            });
            setResponseData(response);
            setIsLoading(false);
            return response;
        },
        [id, role]
    );

    return { handleGiftCardsAutoUpdate, responseData, isLoading, handleGiftCardsAutoUpdateStatus };
}
