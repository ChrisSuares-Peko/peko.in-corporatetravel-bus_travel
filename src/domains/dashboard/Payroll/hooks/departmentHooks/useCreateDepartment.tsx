import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { createDepartmentAPI } from '../../api/departmentApi';

export function useCreateDepartmentApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const createDepartment = async (postData: any) => {
        setIsLoading(true);

        const response = await createDepartmentAPI({
            userId: id,
            userType: role,
            postData,
        });

        if (response) {
            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };
    return { createDepartment, isLoading };
}
