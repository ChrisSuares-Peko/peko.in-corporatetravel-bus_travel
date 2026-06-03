import { useState } from 'react';

import { SurchargeResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { getSurcharge } from '@src/services/surcharge';

export default function GetSurcharge() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [surchargeDetails, setSurchargeDetails] = useState<SurchargeResponse>();
    const [isLoading, setIsLoading] = useState(true);

    const getSurchargeData = async (amount: number | string, accessKey: string) => {
        const data: SurchargeResponse | false = await getSurcharge({
            userId: id,
            userType: role,
            amount: Number(amount),
            accessKey,
        });
        if (data) {
            const walletDetailData = data as SurchargeResponse;
            setSurchargeDetails(walletDetailData);
            setIsLoading(false);
            return data;
        }
        return null;
    };

    return { getSurchargeData, surchargeData: surchargeDetails, isLoading };
}
