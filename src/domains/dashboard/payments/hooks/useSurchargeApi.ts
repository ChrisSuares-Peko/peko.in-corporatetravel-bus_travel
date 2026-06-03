import { SurchargeResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { getSurcharge } from '@src/services/surcharge';

import { earningCashbackPayload } from '../types';

export function useSurchageApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const paymentState = useAppSelector(state => state.reducer.payment);

    const getEarningCashback = async (data: earningCashbackPayload) => {
        const surchargeData: SurchargeResponse | false = await getSurcharge({
            userId: id,
            userType: role,
            amount: Number(data.billAmount),
            accessKey: data?.accessKey,
        });

        if (surchargeData) {
            return Number(surchargeData.corporateCashback);
        }
        return Number(paymentState.earningCashbackAmount);
    };
    return { getEarningCashback };
}
