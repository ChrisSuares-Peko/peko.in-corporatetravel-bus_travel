import { useState } from 'react';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { updateOrderDetails } from '../api/order';
import { UpdateOrderRequestPayload } from '../types/types';

interface useBasicInfoApiProps {
    handleCancel?: () => void;
    handleOtpClose?: () => void;
    handleResetOtp?: () => void;
}

export default function useCancelRefundUpdate({
    handleCancel,
    handleOtpClose,
    handleResetOtp,
}: useBasicInfoApiProps) {
    const [isLoading, setIsLoading] = useState<boolean>();

    const dispatch = useAppDispatch();

    // eslint-disable-next-line consistent-return
    const handleUpdateOrder = async (payload: UpdateOrderRequestPayload) => {
        setIsLoading(true);
        const response: {} | false = await updateOrderDetails(payload);
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
            return true;
        }
        setIsLoading(false);
        if (handleOtpClose) {
            if (handleResetOtp) {
                handleResetOtp();
            }
            // handleOtpClose();
            return false;
        }
    };

    return {
        isLoading,
        handleUpdateOrder,
    };
}
