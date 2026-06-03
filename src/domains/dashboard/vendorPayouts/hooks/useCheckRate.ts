/* eslint-disable consistent-return */
import { useState, useEffect } from 'react';

import { SuccessGenericResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import { checkRate } from '../api';

export default function useCheckRate(
    deliveryMode: string,
    country: string,
    totalAmount: number,
    shouldFetch: boolean // Add this flag to control API call
) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [loading, setLoading] = useState(false); // Initialize as false
    const [rateData, setRateData] = useState<SuccessGenericResponse<any> | null>(null);

    useEffect(() => {
        if (!shouldFetch) return; // Skip fetching if shouldFetch is false

        let isMounted = true;
        setLoading(true);

        const fetchRateData = async () => {
            try {
                const payload = {
                    userId: id,
                    userType: role,
                    deliveryMode,
                    country,
                    totalAmount,
                };
                const data = await checkRate(payload);
                if (isMounted) {
                    setRateData(data);
                }
            } catch (error) {
                console.error('Error fetching rate data:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (role && id && deliveryMode && country && totalAmount) {
            console.log(country);
            fetchRateData();
        } else {
            setLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [role, id, deliveryMode, country, totalAmount, shouldFetch]);

    return { rateData, loading };
}
