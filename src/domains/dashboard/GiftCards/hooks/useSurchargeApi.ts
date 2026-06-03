import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';
import { getSurcharge } from '@src/services/surcharge';
import { accessKeys } from '@utils/accessKeys';

// import { getSurcharge } from '../api';

import { SurchargeResponse } from '../types/types';

export default function GetSurcharge() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [surchargeDetails, setSurchargeDetails] = useState<SurchargeResponse>();
    const [isLoading, setIsLoading] = useState(true);
    const formData = useAppSelector(state => state.reducer.giftcardCheckout.formDetails);
    const { product } = formData;
    const amount = Number(product);
    const getSurchargeData = useCallback(async () => {
        try {
            const data: SurchargeResponse | false = await getSurcharge({
                userId: id,
                userType: role,
                amount,
                accessKey: accessKeys.giftCards,
            });

            if (data) {
                const walletDetailData = data as SurchargeResponse;
                setSurchargeDetails(walletDetailData);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Failed to fetch surcharge :', error);
        } finally {
            setIsLoading(false);
        }
    }, [id, role, amount]);

    useEffect(() => {
        getSurchargeData();
    }, [getSurchargeData]);

    return { surchargeData: surchargeDetails, isLoading };
}
