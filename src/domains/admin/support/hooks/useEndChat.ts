import { useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { updateTicketStatus } from '../api';
import { ticketUpdateResponse } from '../types/type';

export const useEndChat = (chatId: number | null) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState<ticketUpdateResponse | false>();

    const handleTicketStatusUpdate = async (payload: any) => {
        setLoading(true);
        const response: false | ticketUpdateResponse = await updateTicketStatus({
            isClosed: payload,
            userId: id,
            userType: role,
            chatId,
        });
        if (response) {
            setLoading(false);
            return true;
        }
        setLoading(false);
        return false;
    };
    return { handleTicketStatusUpdate, responseData, loading };
};
