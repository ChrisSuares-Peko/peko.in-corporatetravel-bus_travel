import { useCallback, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { downloadTicket } from '../Api';

export default function useTicketDownloadApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [ticket, setTicket] = useState();
    const download = useCallback(
        async (orderId: number) => {
            const data = await downloadTicket({
                userId: id,
                userType: role,
                orderId,
            });

            return data;
        },
        [id, role]
    );
    return { isLoading, download };
}
