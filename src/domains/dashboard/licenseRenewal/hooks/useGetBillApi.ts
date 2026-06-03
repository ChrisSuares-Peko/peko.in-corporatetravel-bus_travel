import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { SuccessGenericResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { getBillDetails, getLimit } from '../api';
import { FetchBillApiResponse, GetBalancePayload, GetLimitResponse } from '../types';

export function useGetBillApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const getBalance = async (payload: GetBalancePayload) => {
        setIsLoading(true);
        const limitResponse: SuccessGenericResponse<GetLimitResponse> | false = await getLimit({
            userId: id,
            userType: role,
        });
        if (limitResponse && limitResponse.status) {
            const balanceResponse: SuccessGenericResponse<FetchBillApiResponse> | false =
                await getBillDetails({
                    userId: id,
                    userType: role,
                    voucherId: payload.voucherId,
                    flexiKey: limitResponse.data.flexiKey,
                    typeKey: limitResponse.data.typeKey,
                });
            if (balanceResponse && balanceResponse.status) {
                const data = {
                    ...limitResponse.data,
                    ...balanceResponse.data,
                };
                setIsLoading(false);
                navigate(paths.licenseRenewal.details, { state: data });
            }
            setIsLoading(false);
        }
        setIsLoading(false);
    };

    return { getBalance, isLoading };
}
