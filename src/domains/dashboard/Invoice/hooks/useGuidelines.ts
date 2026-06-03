import { useCallback, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { SuccessGenericResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import { addGuideline, getPayentLink, getTemplate, paymentLink, updateGuideline } from '../api';
import { setPaymentLink, setpaymentLinkForm } from '../slices/InvoicesSlices';
import { Row, Rows, guidelineRequest } from '../types/guidelineTypes';
import { getpaymentlinkPayload } from '../types/paymentlinkType';

export default function useGuidelines(invoiceId?: number) {
    const { id, role } = useAppSelector(store => store.reducer.auth);
    const { Details } = useAppSelector(state => state.reducer.invoices);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<Row[]>([]);
    const [guideline, setGuideline] = useState<Rows[]>([]);

    const guidelineAdd = useCallback(
        async (payload: guidelineRequest & getpaymentlinkPayload) => {
            setIsLoading(true);

            if (Details?.paymentMode === 'payment link') {
                try {
                    const res: any = await paymentLink({
                        userId: id,
                        userType: role,
                        ...payload,
                    });

                    if (res && res.paymentLink) {
                        dispatch(setPaymentLink(res.paymentLink));
                        dispatch(setpaymentLinkForm(res));

                        const response: any = await addGuideline({
                            userId: id,
                            userType: role,
                            ...payload,
                        });

                        if (response) {
                            navigate(`/${paths.invoice.index}/${paths.invoice.success}`);
                        }
                    } else {
                        dispatch(
                            showToast({
                                description: 'Failed to generate payment link',
                                variant: 'error',
                            })
                        );
                    }
                } catch (error) {
                    dispatch(
                        showToast({
                            description: 'An error occurred while creating payment link',
                            variant: 'error',
                        })
                    );
                }
            } else {
                // If payment mode is not 'payment link', directly call addGuideline API
                try {
                    const response: any = await addGuideline({
                        userId: id,
                        userType: role,
                        ...payload,
                    });

                    if (response) {
                        // Show success message and navigate
                        dispatch(
                            showToast({
                                description: 'Guideline added successfully',
                                variant: 'success',
                            })
                        );
                        navigate(`/${paths.invoice.index}`);
                    }
                } catch (error) {
                    dispatch(
                        showToast({
                            description: 'An error occurred while adding guideline',
                            variant: 'error',
                        })
                    );
                }
            }

            setIsLoading(false);
        },
        [Details?.paymentMode, dispatch, id, navigate, role]
    );

    const guidelineUpdate = useCallback(
        async (payload: guidelineRequest) => {
            setIsLoading(true);
            const response: SuccessGenericResponse<any> | false = await updateGuideline({
                userId: id,
                userType: role,
                ...payload,
            });

            if (response !== false) {
                if (response.status) {
                    dispatch(
                        showToast({
                            description: 'Guideline updated successfully',
                            variant: 'success',
                        })
                    );
                }
            }
            setIsLoading(false);
        },
        [dispatch, id, role]
    );

    const templateData = useCallback(async () => {
        const response: any = await getTemplate({
            userId: id,
            userType: role,
        });

        if (response) {
            setData(response.rows);
        }
    }, [id, role]);

    // const guidelineData = useCallback(async () => {
    //     // setIsLoading(true);
    //     const response: any = await getAllGuidelines({
    //         userId: id,
    //         userType: role,
    //         invoiceId,
    //     });

    //     if (response) {
    //         setGuideline(response.rows);
    //     }
    //     // setIsLoading(false);
    // }, [id, invoiceId, role]);

    const generatePaymentLink = useCallback(
        async (invoiceid: number) => {
            setIsLoading(true);
            const response: any = await getPayentLink({
                userId: id,
                userType: role,
                invoiceId: invoiceid,
            });

            if (response) {
                dispatch(setPaymentLink(response.link));
                dispatch(setpaymentLinkForm(response));
                navigate(`/${paths.invoice.index}/${paths.invoice.success}`);
                setIsLoading(false);
            }
        },
        [dispatch, id, navigate, role]
    );

    useEffect(() => {
        templateData();
    }, [templateData]);

    // useEffect(() => {
    //     guidelineData();
    // }, [guidelineData]);

    return { guidelineAdd, data, guideline, guidelineUpdate, generatePaymentLink, isLoading };
}
