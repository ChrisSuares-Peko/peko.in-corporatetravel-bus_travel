import { UserPayload } from '@customtypes/general';

export interface GetIFrameURLPayload {
    userId: number;
    userType: string;
    redirectType: string;
    landingUrl?: string;
}

export type GetRedirectURLRes = {
    redirectUrl: string;
};

export interface useOrderHistoryApiProps {
    searchText?: string | null;
    page: number;
    pageSize: number;
}
export interface OrderHistoryRequestPayload extends UserPayload, useOrderHistoryApiProps {}
export interface InsuranceOrder {
    id: number;
    transactionDate: string;
    transactionID: string;
    paymentMode: string;
    policyName: string;
    policyPremium: number;
    policyTenure: string;
    policydocument: string;
    insuranceStatus: string;
    statusMessage: string;
    createdAt: string;
    updatedAt: string;
    credentialId: number;
}
export interface OrderHistoryResponse {
    recordsTotal: number;
    rows: InsuranceOrder[];
}
