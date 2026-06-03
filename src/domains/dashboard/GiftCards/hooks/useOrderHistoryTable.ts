/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';

import { debounce } from 'lodash';

import { useAppSelector } from '@src/hooks/store';

import { getOrderHistoryTable } from '../api';
import { GiftCardOrderTypes } from '../types/employee';
import { OrderHistoryListResponse, OrderHistoryTableData } from '../types/types';

export const useOrderHistoryTable = (
    draw: number,
    start: number,
    length: number,
    search: string
) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [tableData, setTableData] = useState<OrderHistoryTableData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>();
    const [previousSearch, setPreviousSearch] = useState(search);
    const getOrderHistoryList = useCallback(async () => {
        setIsLoading(true);
        const data: OrderHistoryListResponse | false = await getOrderHistoryTable({
            userId: id,
            userType: role,
            draw,
            start,
            length,
            search,
        });

        if (data) {
            const orderHistoryData = data as OrderHistoryListResponse;

            const arr = orderHistoryData?.result?.map(orderHistory => {
                const orderResponse = JSON.parse(orderHistory.order.orderResponse);
                let orderType = orderResponse?.body?.orderType;
                if (orderType === GiftCardOrderTypes.BULKPURCHASE) {
                    orderType = 'Bulk Purchase';
                } else if (orderType === GiftCardOrderTypes.BUYFOREMPLOYEE) {
                    orderType = 'Buy for Employee';
                } else if (orderType === GiftCardOrderTypes.BUYFOROTHER) {
                    orderType = 'Buy for other';
                } else {
                    orderType = 'N/A';
                }
                return {
                    txnId: orderHistory.order.corporateTxnId ?? '',
                    date: orderHistory.order.transactionDate ?? '',
                    giftCardName: orderResponse.selectedCard.name ?? '',
                    paymentMode: orderHistory.order.paymentMode ?? '',
                    status: orderHistory.order.status ?? '',
                    amount: orderHistory.order.amountInAed ?? '',
                    orderType: orderType ?? '',
                    quantity: orderResponse?.body?.number_of_items ?? '-',
                };
            });
            setCount(orderHistoryData.totalData);
            setTableData(arr);
            setIsLoading(false);
        }
        setIsLoading(false);
    }, [draw, id, length, role, search, start]);

    const debouncedGetOrderHistoryList = useCallback(
        debounce(() => {
            getOrderHistoryList();
            setPreviousSearch(search);
        }, 500),
        [getOrderHistoryList, search]
    );

    useEffect(() => {
        if (previousSearch !== search) {
            debouncedGetOrderHistoryList();
        } else {
            getOrderHistoryList();
        }
        return () => {
            debouncedGetOrderHistoryList.cancel();
        };
    }, [getOrderHistoryList, search, debouncedGetOrderHistoryList, length, start]);

    return { data: tableData, isLoading, count };
};
