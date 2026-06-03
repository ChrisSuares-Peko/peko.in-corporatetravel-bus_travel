/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { SuccessGenericResponse } from '@customtypes/general';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import useFileDownloader from '@src/hooks/useFileDownloader';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import {
    BulkCreateApi,
    BulkExcelTemplateApi,
    BulkExcelUploadApi,
    getBulkBeneficiaryOtp,
} from '../../api/etisalat';
import { resetData, setBulkData } from '../../slices/beneficiary';
import {
    BulkUploadResponse,
    UseGetBeneficiariesProps,
    BulkExcelTemplateResponse,
} from '../../types/etisalat';

export default function useEtiSalatBulkUpload({
    openOtpModal,
    closeOtpModal,
    limitData,
    serviceData,
}: UseGetBeneficiariesProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isExcelUploading, setIsExcelUploading] = useState(false);
    const [isTemplateFileLoading, setIsTemplateFileLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [buttonLoader, setButtonLoader] = useState(false);
    const [BulkisOtpSending, setBulkIsOtpSending] = useState(false);
    const { handleDownloadLink } = useFileDownloader();

    const getetiSalatBulkUploadTemplate = useCallback(async () => {
        setIsTemplateFileLoading(true);
        const response: BulkExcelTemplateResponse | false = await BulkExcelTemplateApi({
            userId: id,
            userType: role,
            accessKey: serviceData?.accessKey || '',
        });
        if (response && response?.productsTemplateUrl) {
            handleDownloadLink(response?.productsTemplateUrl);
        }
        setIsTemplateFileLoading(false);
    }, [handleDownloadLink, id, role]);

    const BulkUpload = async (file: File) => {
        setIsExcelUploading(true);
        const response: BulkUploadResponse | false = await BulkExcelUploadApi({
            userId: id,
            userType: role,
            file,
            accessKey: limitData?.accessKey!,
            flexiKey: limitData?.flexiKey,
            typeKey: limitData?.typeKey,
        });
        if (response) {
            setIsExcelUploading(false);
            if (response.jsonData?.length === 0) {
                dispatch(
                    showToast({
                        variant: 'warning',
                        description: 'Please add atleast one Postpaid Data in your excel file',
                    })
                );
                return;
            }
            dispatch(setBulkData(response?.jsonData));
            dispatch(
                showToast({
                    variant: 'success',
                    description: 'Please review the Uploaded Data',
                })
            );
            navigate(
                `/${paths.billPayments.index}/${serviceData?.url}/${paths.billPayments.bulkUpload}`
            );
        } else {
            dispatch(
                showToast({ variant: 'error', description: 'Bulk upload failed.Please try again' })
            );
        }
        setIsExcelUploading(false);
    };

    const BulkCreate = async (payload: any) => {
        setOtpLoading(true);
        setButtonLoader(true);
        const response: SuccessGenericResponse<BulkUploadResponse> | false = await BulkCreateApi({
            ...payload,
            userId: id,
            userType: role,
        });
        if (response) {
            if (response.status === false) {
                dispatch(
                    showToast({ variant: 'error', description: 'Please review the Uploaded Data' })
                );
                navigate(paths.billPayments.bulkUpload);
            } else {
                dispatch(resetData());
                if (closeOtpModal) closeOtpModal();
                dispatch(
                    showToast({
                        variant: 'success',
                        description: 'Postpaid Benificiaries created successfully',
                    })
                );
                navigate(`/${paths.billPayments.index}/${serviceData?.url}`);
            }
        }
        setOtpLoading(false);
        setButtonLoader(false);
    };

    const sendBulkOtpApi = async () => {
        setBulkIsOtpSending(true);
        const data: SuccessGenericResponse<{}> | false = await getBulkBeneficiaryOtp({
            userId: id,
            userType: role,
        });
        if (data && data.status) {
            if (openOtpModal) {
                openOtpModal();
            }
        }
        setBulkIsOtpSending(false);
    };

    return {
        isTemplateFileLoading,
        getetiSalatBulkUploadTemplate,
        isExcelUploading,
        BulkUpload,
        BulkCreate,
        isLoading,
        otpLoading,
        sendBulkOtpApi,
        BulkisOtpSending,
        buttonLoader,
    };
}
