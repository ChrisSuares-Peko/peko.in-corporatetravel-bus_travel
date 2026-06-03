import { useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { PlanType } from '../../plans/types';
import { createProjectAPI } from '../api';
import { PlanMode } from '../types';

interface CreateProjectParams {
    name: string;
    plan: PlanMode;
    duration: PlanType;
}

export function useCreateProjectApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);

    const createProject = async ({ name, plan, duration }: CreateProjectParams) => {
        setIsLoading(true);

        const response = await createProjectAPI({
            userId: id,
            userType: role,
            name,
            plan,
            duration,
        });

        if (response) {
            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };
    return { createProject, isLoading };
}
