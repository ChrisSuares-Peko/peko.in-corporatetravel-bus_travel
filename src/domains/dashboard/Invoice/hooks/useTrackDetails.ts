import { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';

import { getInvoice } from '../api';

export default function useTrackDetails(Invoiceid: number) {
    const { id, role } = useAppSelector(store => store.reducer.auth);
    const [invoiceId, setInvoiceId] = useState('');

    const [data, setData] = useState<any>();
    const [dataSource, setDataSource] = useState<any[]>([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const getInvoiceDetails = useCallback(async () => {
        setIsLoading(true);
        const payload = {
            userId: id,
            userType: role,
            invoiceId: Invoiceid,
        };

        const resp: any = await getInvoice(payload);
        if (resp) {
            const parsedResp = {
                id: resp.id,
                recipientDetails: JSON.parse(resp.recipientDetails),
                invoiceDetails: JSON.parse(resp.invoiceDetails),
                productDetails: JSON.parse(resp.productDetails),
                paymentDetails: JSON.parse(resp.paymentDetails),
                comments: resp.comments,
                termsConditions: resp.termsConditions,
                updatedAt: resp.updatedAt,
                createdAt: resp.createdAt,
                invoiceId: resp.invoiceId,
                paymentMode: resp.paymentMode,
                status: resp.status,
                dueDate: resp.dueDate,
                amount: resp.amount,
                paymentLink: resp.paymentLink,
            };
            setData(parsedResp);

            if (parsedResp.productDetails) {
                const arr = parsedResp?.productDetails?.map((product: any, index: number) => ({
                    key: index.toString(),
                    name: {
                        firstRow: product.item,
                        secondRow: '', // Add the appropriate value here if needed
                    },
                    quantity: product.quantity,
                    price: product.price,
                    amount: product.price * product.quantity,
                }));
                setDataSource([...arr]);
            }
        }
        setIsLoading(false);
    }, [id, role, Invoiceid]);

    useEffect(() => {
        getInvoiceDetails();
    }, [getInvoiceDetails]);
    return { trackerData: data, dataSource, Loading: isLoading, invoiceId };
}
