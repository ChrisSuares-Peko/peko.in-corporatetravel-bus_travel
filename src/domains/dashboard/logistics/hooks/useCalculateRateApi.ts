import { useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { calculateRate } from '../api';
import { ICalculateRateResponse, shipmentDetailsMin } from '../types';

export const useCalculateRateApi = () => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [resultData, setResultData] = useState({});
    const { originAddress, destinationAddress } = useAppSelector(state => state.reducer.logistics);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculateRate = async (shipmentDetails: shipmentDetailsMin) => {
        setIsLoading(true);
        const response: ICalculateRateResponse | false = await calculateRate({
            userId: id,
            userType: role,
            originAddress,
            destinationAddress,
            ...shipmentDetails,
        });
        if (response) {
            const result = {
                TaxAmount: response.TaxAmount,
                TotalAmount: response.TotalAmount,
                TotalAmountBeforeTax: response.TotalAmountBeforeTax,
                type: response.serviceType,
            };

            setResultData(result);
            setIsLoading(false);
            return result;
        }
        setIsLoading(false);
        return false;
    };

    return { data: resultData, isLoading, handleCalculateRate };
};
