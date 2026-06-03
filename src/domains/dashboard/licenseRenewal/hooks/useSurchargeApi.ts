import { useCallback, useEffect, useState } from 'react';

import { SurchargeResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { getSurcharge } from '@src/services/surcharge';
import { accessKeys } from '@utils/accessKeys';

export default function GetSurcharge(amount: number) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [surchargeDetails, setSurchargeDetails] = useState<SurchargeResponse>();

    const getSurchargeData = useCallback(async () => {
        const data: SurchargeResponse | false = await getSurcharge({
            userId: id,
            userType: role,
            amount: Number(amount),
            accessKey: accessKeys.dubaiDED,
        });
        if (data) {
            const walletDetailData = data as SurchargeResponse;
            setSurchargeDetails(walletDetailData);
        }
    }, [id, role, amount]);

    useEffect(() => {
        getSurchargeData();
    }, [getSurchargeData]);

    return { surchargeData: surchargeDetails };
}
