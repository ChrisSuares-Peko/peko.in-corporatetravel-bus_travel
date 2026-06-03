import { useCallback, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { createReferal, updatereferal } from '../api/refferalCode';
import { Referral, newReferal } from '../types/refferalCode';

const UseUpdateReferalCodes = () => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);

    const updateCurrentreferal = useCallback(
        async (payload: newReferal) => {
            setIsLoading(true);
            const data: Referral | false = await updatereferal({
                userId: id,
                userType: role,
                ...payload,
            });
            if (data) {
                return true;
            }
            setIsLoading(false);
            return false;
        },
        [id, role]
    );
    const createNewReferal = useCallback(
        async (payload: newReferal) => {
            setIsLoading(true);
            const data: Referral | false = await createReferal({
                userId: id,
                userType: role,
                ...payload,
            });
            if (data) {
                return true;
            }
            setIsLoading(false);
            return false;
        },
        [id, role]
    );

    return { isLoading, createNewReferal, updateCurrentreferal };
};

export default UseUpdateReferalCodes;
