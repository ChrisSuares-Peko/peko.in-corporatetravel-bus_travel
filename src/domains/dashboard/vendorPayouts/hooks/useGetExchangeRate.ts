import { useCallback, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getAgentChargeAndExchangerate } from '../api/BeneficiaryRegistrationApis';
import { ChargeAndExchangeRateResponse } from '../types/types';

export function useGetChargeAndExchangeRate() {
    const { role, id } = useAppSelector(state => state.reducer.auth);

    const [isLoading, setIsLoading] = useState(false);

    const fetchChargeAndExchangerate = useCallback(
        async (
            deliveryMode: string,
            destinationCountry: string,
            targetCurrency: string,
            sourceAmount: string,
            settlementCurrency: string
        ) => {
            setIsLoading(true);
            const data: ChargeAndExchangeRateResponse | false = await getAgentChargeAndExchangerate(
                {
                    userId: id,
                    userType: role,
                    deliveryMode,
                    destinationCountry,
                    targetCurrency,
                    sourceAmount,
                    settlementCurrency,
                }
            );
            if (data) {
                const exchangeRate = data.exchangeRate.data[0];
                const charge = data.chargeSlab.data[0];
                setIsLoading(false);
                return {
                    exchangeRate,
                    charge,
                };
            }
            setIsLoading(false);
            return null;
        },
        [id, role]
    );

    return { fetchChargeAndExchangerate, isLoading };
}
