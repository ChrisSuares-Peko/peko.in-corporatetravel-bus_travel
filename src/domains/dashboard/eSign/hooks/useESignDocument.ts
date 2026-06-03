import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import { OrderDetailsApi, resendInvitationApi, signRequestApi } from '../api';
import { setESignDocData } from '../slices/eSignDocSlice';
import {
    OrderDetailsApiResponse,
    resendInvitationApiResponse,
    signRequestApiPayload,
    signRequestApiResponse,
} from '../types';
import { getFutureDate } from '../utils';

export function useESignDocument() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const { id: docId, signers_info } = useAppSelector(state => state.reducer.eSignDoc);

    const [isLoading, setIsLoading] = useState(false);
    const eSignDocument = async ({ expiry_date, ...params }: signRequestApiPayload) => {
        const updatedExpiry = expiry_date === '' ? getFutureDate(90) : expiry_date;
        setIsLoading(true);
        const data: signRequestApiResponse | false = await signRequestApi({
            userId: id,
            userType: role,
            expiry_date: updatedExpiry,
            ...params,
        });
        setIsLoading(false);
        if (data) {
            return true;
        }
        return false;
    };

    const resendInvitation = async (index: number, name: string, email: string) => {
        setIsLoading(true);
        const data: resendInvitationApiResponse | false = await resendInvitationApi({
            userId: id,
            userType: role,
            id: docId!,
            signer_id: signers_info[index].signer_id!,
            name,
            email,
        });
        if (data) {
            dispatch(
                showToast({ description: 'Invitation resent successfully.', variant: 'success' })
            );
        }
        setIsLoading(false);
    };

    const getOrderDetails = async (docId2: number) => {
        setIsLoading(true);
        const data: OrderDetailsApiResponse | false = await OrderDetailsApi({
            userId: id,
            userType: role,
            id: docId2,
        });
        if (data) {
            data.documentBase64 = `data:application/pdf;base64,${data.documentBase64}`;
            dispatch(setESignDocData({ ...data, isDisabled: true }));
            setIsLoading(false);
            return true;
        }
        setIsLoading(false);
        navigate(`${paths.dashboard.moreServices}/${paths.eSign.index}/${paths.eSign.historyPage}`);
        return false;
    };

    return { isLoading, eSignDocument, resendInvitation, getOrderDetails };
}
