import { useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { editDepartmentAPI } from '../../api/departmentApi';
import { departmentEditPayload } from '../../types/departmentTypes/departmentTypes';

export function useEditDepartmentApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);

    const editDepartment = async (payload: departmentEditPayload) => {
        setIsLoading(true);

        const response = await editDepartmentAPI({
            userId: id,
            userType: role,
            ...payload,
        });

        if (response) {
            setIsLoading(false);
            return true;
        }
        setIsLoading(false);
        return false;
    };
    return { editDepartment, isLoading };
}
