import { useCallback, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getAgentAndExchangerate } from '../api/BeneficiaryRegistrationApis';
import { AgentAndExchangeRateResponse, ExchangeRateType } from '../types/types';

export function useGetAgentAndExchangeRate() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [exchangeRate, setExchangeRate] = useState<ExchangeRateType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const fetchChargeAndExchangerate = useCallback(
        async (deliveryMode: string, destinationCountry: string, settlementCurrency: string) => {
            setIsLoading(true);
            const data: AgentAndExchangeRateResponse | false = await getAgentAndExchangerate({
                userId: id,
                userType: role,
                deliveryMode,
                destinationCountry,
                settlementCurrency,
            });
            if (data) {
                const exchangeRateData = data as AgentAndExchangeRateResponse;
                const arr = exchangeRateData?.map(exchange => ({
                    destinationCountry: exchange.destinationCountry ?? '',
                    receivingAgent: exchange.receivingAgent ?? '',
                    payingCurrency: exchange.payingCurrency ?? '',
                    specialPayingGroup: exchange.specialPayingGroup ?? '',
                    groupDescription: exchange.groupDescription ?? '',
                    settlementRate: exchange.settlementRate ?? '',
                }));
                setExchangeRate(arr);
                setIsLoading(false);
                return arr || [];
            }
            setIsLoading(false);
            return [];
        },
        [id, role]
    );

    return { exchangeRate, fetchChargeAndExchangerate, isLoading };
}
