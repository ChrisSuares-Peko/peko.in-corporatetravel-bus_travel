import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { deleteDocument } from '../../api/docAndAssetsApi/index';
import { DocResponse } from '../../types/docAndAssetsTypes';

interface useDeleteDocumentApiProps {
    handleCancel: () => void;
}

export const useDeleteDocumentApi = ({ handleCancel }: useDeleteDocumentApiProps) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();

    const deleteDocumentData = async (
        documentId: string | undefined,
        employeeId: string | undefined
    ) => {
        setIsLoading(true);
        const data: DocResponse | false = await deleteDocument({
            userId: id,
            userType: role,
            documentId,
            employeeId,
        });
        if (data) {
            dispatch(
                showToast({
                    description: 'Document deleted successfully',
                    variant: 'success',
                })
            );
            handleCancel();
        }
        setIsLoading(false);
    };

    return { deleteDocumentData, deleteLoader: isLoading };
};
