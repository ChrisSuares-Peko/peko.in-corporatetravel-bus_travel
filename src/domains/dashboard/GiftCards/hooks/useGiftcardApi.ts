import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getAllGiftcards } from '../api';
import { GiftcardsTableData, GiftcardListResponse } from '../types/types';

export default function useGiftcardApi(
    searchText: string,
    page: number,
    limit: number,

    category: string,
    offset: number
) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [tableData, setTableData] = useState<GiftcardsTableData>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>();
    const [rowCount, setRowCount] = useState<number>();

    const getGiftCardList = useCallback(async () => {
        const data: GiftcardListResponse | false = await getAllGiftcards({
            userId: id,
            userType: role,
            accessKeys: ['quickcilver', 'youGotAGift'],
            searchText,
            limit,
            page,
            category,
            offset,
        });

        if (data) {
            const giftCards = data.rows.map(giftCard => ({
                name: giftCard.name ?? '',
                description: giftCard.description ?? '',
                image: giftCard.image ?? '',
                id: giftCard.id ?? '',
            }));
            setTableData(giftCards);

            setCount(data.count);
            setRowCount(data.rows.length);

            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, role, searchText, limit, page, category, offset]);

    useEffect(() => {
        getGiftCardList();
    }, [getGiftCardList]);

    return { data: tableData, isLoading, count, rowCount };
}
