import { GetLimitResponse } from '.';

export type BulkExcelTemplateResponse = {
    productsTemplateUrl: string;
};

export type CommonPayload = {
    userId: number;
    userType: string;
};

export type BulkData = {
    name: string;
    accountNo: string;
    optional1: string;
    credentialId: number;
    status: boolean;
    errors: string[];
};

export type SendBulkOtpPayload = CommonPayload & {
    userType: string;
    userId: number;
};

export interface UseGetBeneficiariesProps {
    openOtpModal?: () => void;
    closeOtpModal?: () => void;
    limitData?: GetLimitResponse;
    serviceData?: any;
}

export interface BulkUploadResponse {
    jsonData: BulkData[];
    bulkCreated: boolean;
}
