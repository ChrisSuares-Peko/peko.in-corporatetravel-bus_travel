import { useCallback } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { holidayUpdate } from '../../api/dashBoardIndex';
import { EventData, holidayUpdatePayload } from '../../types/dashboardTypes';

export function useUpdateHoliday() {
    const { role, id } = useAppSelector(state => state.reducer.auth);

    const updateHoliday = useCallback(
        async (payload: holidayUpdatePayload) => {
            const data: EventData | false = await holidayUpdate({
                ...payload,
                start: payload.start,
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
    return { updateHoliday };
}
