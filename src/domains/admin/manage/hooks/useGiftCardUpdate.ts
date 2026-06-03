import { useCallback, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { createGiftCards, putUpdateGiftCards } from '../api/giftCards';
import { GiftCardsBody, GiftCardsWithoutID } from '../types/giftCards';

export default function useGiftCardsUpdate() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();
    const [responseData, setResponseData] = useState<GiftCardsBody | {}>();
    const [isLoading, setIsLoading] = useState(false);

    const handleGiftCardsCreation = async (payload: GiftCardsWithoutID) => {
        setIsLoading(true);
        const response: false | GiftCardsBody = await createGiftCards({
            ...payload,
            userId: id,
            userType: role,
        });

        if (response) {
            dispatch(
                showToast({
                    description: `Gift card added successfully `,
                    variant: 'success',
                })
            );
        }

        setResponseData(response);
        setIsLoading(false);
        return response;
    };

    const updateGiftCardsDetails = useCallback(
        async (updatedData: GiftCardsBody) => {
            setIsLoading(true);
            const response: {} | false = await putUpdateGiftCards({
                userId: id,
                userType: role,
                ...updatedData,
            });

            if (response) {
                dispatch(
                    showToast({
                        description: `Gift card updated successfully `,
                        variant: 'success',
                    })
                );
            }

            setResponseData(response);
            setIsLoading(false);
            return response;
        },
        [dispatch, id, role]
    );

    return { handleGiftCardsCreation, responseData, isLoading, updateGiftCardsDetails };
}
