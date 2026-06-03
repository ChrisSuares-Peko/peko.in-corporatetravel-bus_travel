import { useCallback } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { holiday } from '../../api/dashBoardIndex';
import { EventData, holidayPayload } from '../../types/dashboardTypes';

export function useAddHoliday() {
    const { role, id } = useAppSelector(state => state.reducer.auth);

    const addHoliday = useCallback(
        async (payload: holidayPayload) => {
            const data: EventData | false = await holiday({
                ...payload,
                userId: id,
                userType: role,
            });

            if (data) {
                return true;
            }
            return false;
        },
        [id, role]
    );
    return { addHoliday };
}
