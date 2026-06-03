import { useCallback } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { UpdateSystemUser, UpdateSystemUserPassword } from '../api';
import { UserData, updatePassword, updateProfile } from '../types';

const UseUpdateProfile = () => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const updateUserProfile = useCallback(
        async (payload: updateProfile) => {
            const data: UserData | false = await UpdateSystemUser({
                userId: id,
                userType: role,
                ...payload,
            });

            if (data) {
                return true;
            }
            return false;
        },
        [id, role]
    );
    const updateUserPassword = useCallback(
        async (payload: updatePassword) => {
            const data: UserData | false = await UpdateSystemUserPassword({
                userId: id,
                userType: role,
                ...payload,
            });
            if (data) {
                return true;
            }
            return false;
        },
        [id, role]
    );

    return { updateUserPassword, updateUserProfile };
};

export default UseUpdateProfile;
