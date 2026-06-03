import { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { getFareRulesAPI } from '../api';
import {} from '../types/searchAirports';
import { IFareRules, IFareRulesData } from '../types/fareRules';

export const useGetFareRules = () => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const { offerId, conversationId } = useAppSelector(state => state.reducer.airline.bookingData);
    const [searchData, setSearchData] = useState<IFareRulesData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const getFareRulesHandler = useCallback(async () => {
        let data: IFareRules | false = false;
        setIsLoading(true);
        if (offerId && conversationId) {
            data = await getFareRulesAPI({
                userId: id,
                userType: role,
                postData: {
                    offerId,
                    conversationId,
                },
            });
        }
        const res = await data;
        if (res) {
            setSearchData(res.data);
            setIsLoading(false);
        }
    }, [conversationId, id, offerId, role]);

    useEffect(() => {
        getFareRulesHandler();
    }, [getFareRulesHandler]);

    useEffect(() => {
        if (!offerId || !conversationId) {
            const timeout = setTimeout(() => {
                navigate(paths.dashboard.corporateTravel);
            }, 3000);

            return () => clearTimeout(timeout);
        }
        return undefined;
    }, [offerId, conversationId, navigate]);

    return { fareRules: searchData, isLoading };
};
