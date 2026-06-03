import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { createIncrement } from '../../../api/employeeSalaryApi/incrementApi/index';
// import { createIncrementPayload } from '../../../types/salaryProfileTypes/incrementTypes/index';

export default function useIncrementCreate(handleCancel?: () => void) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();
    const handleIncrementCreation = async (values: any) => {
        const payload = {
            ...values,
            attachment: values.attachment
                ? {
                      base64: values.attachment,
                      format: values.attachmentFormat,
                  }
                : null,
        };
        const data = await createIncrement({
            ...payload,
            userId: id,
            userType: role,
        });
        if (data && data.data) {
            dispatch(
                showToast({
                    description: data.message,
                    variant: 'success',
                })
            );
            if (handleCancel) handleCancel();
        }
        return data;
    };
    return { handleIncrementCreation };
}
