import { useCallback } from 'react';

import { projectNamePayload } from '@customtypes/general';

import { checkProjectExist } from '../api';

export default function useCheckProjectExist() {
    const checkProject = useCallback(async (payload: projectNamePayload) => {
        const result = await checkProjectExist(payload);
        // Assume result.status indicates project existence
        if (result) {
            return false;
        }
        return true;
    }, []);

    return { checkProject };
}
