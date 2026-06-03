import { useState } from 'react';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { setPendingRequests } from '@src/slices/connectSlice';

import { putRequest } from '../api';

type PutRequest = {
    requestId: string;
    status: 'ACCEPTED' | 'REJECTED';
};

export default function usePutRequest() {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const handlePutRequest = async ({ requestId, status }: PutRequest) => {
        setIsLoading(true);
        const response: any = await putRequest({ requestId, status });
        if (response) {
            dispatch(setPendingRequests(response?.pendingRequests ?? 0));
            dispatch(
                showToast({
                    variant: 'success',
                    description: `Request ${status === 'ACCEPTED' ? 'Accepted' : 'Rejected'}`,
                })
            );
        }
        setIsLoading(false);
        return response;
    };
    return { handlePutRequest, isLoading };
}
