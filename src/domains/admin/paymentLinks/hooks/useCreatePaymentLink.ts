import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/hooks';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import { CreateLink, ResendLink } from '../api';

export default function useCreatePaymentLink() {
    const navigate = useNavigate();
    const { id, role } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const createPaymentLink = async (payload: any) => {
        setIsLoading(true);

        const resp: any = await CreateLink({
            userId: id,
            userType: role,
            ...payload,
        });

        if (resp) {
            dispatch(
                showToast({
                    description: `Payment link generated`,
                    variant: 'success',
                })
            );
            navigate(`${paths.systemUser.paymentLinks}/create-payment-link/created`, {
                state: {
                    paymentLink: resp.paymentLink,
                    Details: {
                        id: resp.orderId,
                        paymentDetails: { total: payload?.total?.value },
                    },
                    paymentLinkForm: {
                        createdAt: resp.createdAt,
                        expireyDate: resp.expiryDate,
                        orderId: resp.orderId,
                        customerName: resp.customerName,
                    },
                    paymentLinkPayload: {
                        amount: payload?.total?.value,
                    },
                },
            });
        } else {
            dispatch(
                showToast({
                    description: `Something went wrong, try again`,
                    variant: 'error',
                })
            );
        }
        return setIsLoading(false);
    };

    const resendPaymentLink = async (payload: any) => {
        setIsLoading(true);

        const resp: any = await ResendLink({
            userId: id,
            userType: role,
            ...payload,
        });

        if (resp) {
            dispatch(
                showToast({
                    description: `Payment link resend successfully`,
                    variant: 'success',
                })
            );
        } else {
            dispatch(
                showToast({
                    description: `Something went wrong, try again`,
                    variant: 'error',
                })
            );
        }
        return setIsLoading(false);
    };

    return { createPaymentLink, resendPaymentLink, loading: isLoading };
}
