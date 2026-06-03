import { useState } from 'react';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { updateReturnOrderDetails } from '../api/order';
import { UpdateOrderRequestPayload } from '../types/types';

interface useBasicInfoApiProps {
    handleCancel?: () => void;
    handleOtpClose?: () => void;
}

export default function useReturnRequestUpdate({
    handleCancel,
    handleOtpClose,
}: useBasicInfoApiProps) {
    const [isLoading, setIsLoading] = useState<boolean>();

    const dispatch = useAppDispatch();

    const handleUpdateOrder = async (payload: UpdateOrderRequestPayload) => {
        setIsLoading(true);
        const response: {} | false = await updateReturnOrderDetails(payload);
        if (response) {
            if (handleCancel && handleOtpClose) {
                handleOtpClose();
                handleCancel();
                dispatch(
                    showToast({
                        description: 'Order status updated successfully',
                        variant: 'success',
                    })
                );
            }
        } else if (handleOtpClose) {
            handleOtpClose();
        }
        setIsLoading(false);
    };

    return {
        isLoading,
        handleUpdateOrder,
    };
}
