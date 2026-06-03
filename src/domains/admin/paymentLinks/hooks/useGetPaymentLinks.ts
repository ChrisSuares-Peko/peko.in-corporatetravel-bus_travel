import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getAllPaymentLinks } from '../api';

export default function useGetPaymentLinks({ searchText, itemsPerPage, page, sort }: any) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [paymentLinksList, setPaymentLinksList] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<string | number>();

    const [isLoading, setIsLoading] = useState(false);

    const getPaymentLinksList = useCallback(async () => {
        setIsLoading(true);
        const data: any | false = await getAllPaymentLinks({
            userId: id,
            userType: role,
            searchText,
            itemsPerPage,
            page,
            sort,
        });
        setIsLoading(false);
        if (data.data && data.data.length) {
            const tableFormatedDate = data.data.map((link: any) => {
                const { sentPayload } = link;
                return {
                    createdAt: link.createdAt ?? '',
                    customerName: `${sentPayload.firstName} ${sentPayload.lastName}` ?? '',
                    amount: sentPayload?.total?.value ?? '',
                    currency: sentPayload?.total?.currencyCode ?? '',
                    expiryDate: sentPayload?.invoiceExpiryDate ?? '',
                    status: link.status ?? '',
                    client_url: link.client_url ?? '',
                    email: sentPayload.email ?? '',
                    invoiceId: link.invoiceId ?? '',
                };
            });
            setPaymentLinksList(tableFormatedDate);
            setTotalCount(data.recordsTotal);
        }
    }, [id, itemsPerPage, page, role, searchText, sort]);

    useEffect(() => {
        getPaymentLinksList();
    }, [getPaymentLinksList, refresh]);

    return {
        isLoading,
        paymentLinksList,
        getPaymentLinksList,
        totalCount,
        setRefresh,
    };
}
