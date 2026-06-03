import { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';

import { getInvoice } from '../api';
import { InvoiceResponse } from '../types';

export default function useGetInvoiceDetails(invoice: any) {
    const { id, role } = useAppSelector(store => store.reducer.auth);
    const [invoiceId, setInvoiceId] = useState('');
    const [data, setData] = useState<
        | {
              id: number;
              recipientDetails: any;
              invoiceDetails: any;
              productDetails: any;
              paymentDetails: any;
              comments: string;
              termsConditions: string;
              updatedAt: string;
              createdAt: string;
              invoiceId: number;
          }
        | undefined
    >();
    const [dataSource, setDataSource] = useState<any[]>([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const getInvoiceDetails = useCallback(async () => {
        const payload = {
            userId: id,
            userType: role,
            invoiceId: invoice,
        };
        const resp: InvoiceResponse | false = await getInvoice(payload);

        if (resp) {
            const parsedResp = {
                id: resp.id,
                recipientDetails: JSON.parse(resp.recipientDetails),
                invoiceDetails: JSON.parse(resp.invoiceDetails),
                productDetails: JSON.parse(resp.productDetails),
                paymentDetails: JSON.parse(resp.paymentDetails),
                paymentMode: resp.paymentMode,
                comments: resp.comments,
                termsConditions: resp.termsConditions,
                updatedAt: resp.updatedAt,
                createdAt: resp.createdAt,
                invoiceId: resp.invoiceId,
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
    }, [id, role, invoice]);

    useEffect(() => {
        // setInvoiceId(state.state);
        getInvoiceDetails();
        // } else {
        //     navigate(`${paths.dashboard.invoicing}`);
        // }
    }, [getInvoiceDetails]);
    return { data, dataSource, isLoading, invoiceId };
}
