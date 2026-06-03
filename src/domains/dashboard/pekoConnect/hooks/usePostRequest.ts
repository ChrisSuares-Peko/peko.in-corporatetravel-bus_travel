import { useState } from 'react';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { postRequest } from '../api';

type PostRequest = {
    receiverId: string;
    message: string;
};

export default function usePostRequest() {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const handlePostRequest = async ({ receiverId, message }: PostRequest) => {
        setIsLoading(true);
        const response: any = await postRequest({ receiverId, message });
        if (response) {
            dispatch(
                showToast({ variant: 'success', description: 'Connection request has been sent.' })
            );
        }
        setIsLoading(false);
    };
    return { handlePostRequest, isLoading };
}
