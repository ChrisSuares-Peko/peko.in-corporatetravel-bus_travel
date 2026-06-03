import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getOrderDetails } from '../api';
import { DocumentData } from '../types/documentType';

export default function useGetOrderDetails(docID: number) {
    const [reload, setReload] = useState<boolean>(false);
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [ordersList, setOrdersList] = useState<any>();
    const [status, setStatus] = useState<
        'PICKUP' | 'ASSIGNED' | 'PROCESSING' | 'DISPATCHED' | 'COMPLETED'
    >('PICKUP');
    const [isLoading, setIsLoading] = useState(true);

    const handleGetOrderDetails = useCallback(async () => {
        if (docID === 0) return;
        const data: DocumentData | false = await getOrderDetails({
            userId: id,
            userType: role,
            id: docID,
        });
        if (data) {
            const listData = data as DocumentData;
            const docData = [
                {
                    id: 1,
                    pickUpAddress: listData.address,
                    type: listData.documentType,
                    submissionCountry: listData.submissionCountry,
                    issuedCountry: listData.issuedCountry,
                    totalAmount: listData.amount,
                    transactionId: listData.transactionId,
                    corporateTxnId: listData.transaction?.corporateTxnId,
                },
            ];
            setStatus(listData.status);
            setOrdersList(docData);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [docID, id, role]);

    useEffect(() => {
        if (reload === true) {
            setReload(false);
        } else {
            handleGetOrderDetails();
        }
    }, [handleGetOrderDetails, reload]);

    return { ordersList, status, isLoading, setReload };
}
