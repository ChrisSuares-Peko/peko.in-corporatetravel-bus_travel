import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { getAllCards, updateDefaultCard } from '../../api/subscription';
import { GetAllSavedCardsResponse, SavedCardData } from '../../types/subscription';

export default function useSavedCards(
    setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>
) {
    const [isLoading, setIsLoading] = useState(true);
    const [allCards, setAllCards] = useState<SavedCardData[]>();
    const [defaultCard, setDefaultCard] = useState<SavedCardData>();
    const dispatch = useAppDispatch();

    const getAllSavedCards = useCallback(async () => {
        setIsLoading(true);
        const data: GetAllSavedCardsResponse | false = await getAllCards();
        if (data) {
            setAllCards(data.allUserCards);
            setDefaultCard(data.defaultCard);
        }
        setIsLoading(false);
    }, []);

    const changeDefaultCard = useCallback(
        async (selectedCardId: number | null) => {
            if (selectedCardId === null) {
                dispatch(
                    showToast({
                        variant: 'error',
                        description: 'Please select a card.',
                    })
                );
                return;
            }

            setIsLoading(true);
            const data = await updateDefaultCard(selectedCardId);
            if (data) {
                getAllSavedCards();
                setOpenDrawer(false);
                dispatch(
                    showToast({
                        variant: 'success',
                        description: data.message,
                    })
                );
            }
            setIsLoading(false);
        },
        [getAllSavedCards, setOpenDrawer, dispatch]
    );

    useEffect(() => {
        getAllSavedCards();
    }, [getAllSavedCards]);

    return {
        allCards,
        defaultCard,
        isLoading,
        changeDefaultCard,
    };
}
