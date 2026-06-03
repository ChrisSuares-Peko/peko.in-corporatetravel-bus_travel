import { useState, useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { getHikeOrderHistoryTable } from '../api/orders';
import { OrderHistoryListResponse, SelectedHike } from '../types';

interface HikeHistoryTableItem {
    date: string;
    hikes?: Array<{
        name: string;
        quantity: number;
        price: number;
        totalPrice: number;
        employees?: Array<{
            name: string;
            employeeId: string;
        }>;
    }>;
    totalAmount: string;
    status: string;
}

export const useGetHikeHistoryApi = () => {
    const dispatch = useAppDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState<{ data: HikeHistoryTableItem[]; total: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getHikeHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getHikeOrderHistoryTable({
                userId: id,
                userType: role,
                search: searchText,
                start: page,
                length: pageSize,
            });

            if (!response) {
                dispatch(
                    showToast({
                        description: 'Something went wrong while fetching hike history',
                        variant: 'error',
                    })
                );
                return;
            }

            const transformedData: HikeHistoryTableItem[] = (
                response as OrderHistoryListResponse
            ).result.map(item => {
                const orderResponse = JSON.parse(item.order.orderResponse);
                return {
                    date: item.order.transactionDate,
                    hikes: orderResponse.selectedHikes.map((hike: SelectedHike) => ({
                        name: hike.hikeName,
                        quantity: hike.quantity,
                        price: hike.price,
                        totalPrice: hike.totalPrice,
                        employees: hike.employees || [],
                    })),
                    totalAmount: item.order.amountInAed,
                    status: item.order.status,
                };
            });

            console.log(transformedData);

            setData({
                data: transformedData,
                total: (response as OrderHistoryListResponse).totalData,
            });
        } catch (err) {
            dispatch(
                showToast({
                    description: 'Something went wrong while fetching hike history',
                    variant: 'error',
                })
            );
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }, [id, role, searchText, page, pageSize, dispatch]);

    useEffect(() => {
        getHikeHistory();
    }, [getHikeHistory]);

    return {
        hikeHistoryData: data?.data || [],
        total: data?.total || 0,
        isLoading,
        page,
        setPage,
        pageSize,
        setPageSize,
        searchText,
        setSearchText,
    };
};
