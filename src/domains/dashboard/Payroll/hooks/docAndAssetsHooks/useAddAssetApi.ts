import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { createAsset } from '../../api/docAndAssetsApi/index';
import { UserPayload, assetResponse, createAssetPayload } from '../../types/docAndAssetsTypes';

export default function useAssetCreate(handleCancel?: () => void) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [responseData, setResponseData] = useState<assetResponse | false>();
    const dispatch = useAppDispatch();

    const handleAssetCreation = async (payload: createAssetPayload & UserPayload) => {
        const response: false | assetResponse = await createAsset({
            ...payload,
            userId: id,
            userType: role,
        });
        if (response) {
            dispatch(
                showToast({
                    description: 'Asset added succesfully',
                    variant: 'success',
                })
            );
            if (handleCancel) handleCancel();
            setResponseData(response);
        }
    };
    return { handleAssetCreation, responseData };
}
