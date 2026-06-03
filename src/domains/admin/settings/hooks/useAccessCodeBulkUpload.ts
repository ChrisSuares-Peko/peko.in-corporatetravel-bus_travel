import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import useFileDownloader from '@src/hooks/useFileDownloader';
import { showToast } from '@src/slices/apiSlice';

// import { resetData, setBulkProductsData } from '../slices/bulkProducts';
// import {BulkProductsUploadResponse} from '../types/products';
import { AccessCodeBulkExcelTemplateApi, BulkAccessCodeExcelUploadApi } from '../api/accessCode';
import {
    AccessCodeBulkExcelTemplateResponse,
    BulkAccessCodeUploadPayload,
    BulkAccessCodeUploadResponse,
} from '../types/accessCode';

export function useAccessCodeBulkUpload(handleCancel: () => void) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [isTempLoading, setTempIsLoading] = useState(false);
    const { handleDownloadLink } = useFileDownloader();

    const getProductBulkUploadTemplate = useCallback(async () => {
        setTempIsLoading(true);
        const response: AccessCodeBulkExcelTemplateResponse | false =
            await AccessCodeBulkExcelTemplateApi({ userId: id, userType: role });
        if (response && response.accessCodeTemplateUrl) {
            handleDownloadLink(response.accessCodeTemplateUrl);
        }
        setTempIsLoading(false);
    }, [handleDownloadLink, id, role]);

    const BulkUpload = async (payload: BulkAccessCodeUploadPayload) => {
        setIsLoading(true);
        const response: BulkAccessCodeUploadResponse | false = await BulkAccessCodeExcelUploadApi({
            ...payload,
            userId: id,
            userType: role,
        });
        if (response) {
            dispatch(showToast({ variant: 'success', description: 'Bulk upload success' }));
            handleCancel();
            return true;
        }
        return setIsLoading(false);
    };

    return { getProductBulkUploadTemplate, BulkUpload, isLoading, isTempLoading };
}
