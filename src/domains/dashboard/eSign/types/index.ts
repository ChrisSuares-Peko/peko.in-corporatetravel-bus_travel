export interface SignerInfo {
    sequence: string;
    signer_id: string;
    document_id: string;
    page_number: string[];
    signer_name: string;
    signer_email: string;
    signer_mobile: string;
    signer_ref_id: string;
    signer_position: string[];
    reference_doc_id: string;
}

export interface HistoryTableItem {
    id: number;
    docket_id: string;
    document_id: string;
    docket_title: string;
    docket_description: string;
    expiry_date: string;
    sequentialSignature: boolean;
    signers_info: SignerInfo[];
    initiator_email: string;
    document_url: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    credentialId: number;
    credential: {
        id: number;
        name: string;
    };
}

export interface OrderHistoryApiPayload {
    page: number;
    searchText: string;
    pageSize: number;
}
export interface OrderHistoryApiResponse {
    recordsTotal: number;
    rows: HistoryTableItem[];
}
export interface OrderDetailsApiPayload {
    id: number;
}
export interface OrderDetailsApiResponse extends HistoryTableItem {
    documentBase64: string;
}

export interface SignerDetailsTypes {
    signer_name: string;
    signer_email: string;
    signer_mobile: string;
    sequence: string;
    page_number: string[];
    signer_position: string[];
    signer_id?: string;
    status?: string;
}
export interface ESignDocState {
    docket_title: string;
    expiry_date: string | undefined;
    docket_description: string;
    reminder: boolean;
    reminder_interval: string;
    document_url?: string;
    documentBase64: string;
    sequentialSignature: boolean;
    signers_info: SignerDetailsTypes[];
    initiator_email: string;
    isDisabled: boolean;
    status?: string;
    pageNumbers?: number | null;
    id?: string | number;
    doc_expiry_date?: string;
    termsofUse: boolean;
}

export interface signRequestApiPayload {
    docket_title: string;
    expiry_date?: string | undefined;
    docket_description?: string | undefined;
    reminder: boolean;
    reminder_interval?: string | undefined;
    documentBase64: string;
    sequentialSignature: boolean;
    signers_info: SignerDetailsTypes[];
    initiator_email: string;
}
export interface signRequestApiResponse extends ESignDocState {}

export interface resendInvitationApiPayload {
    id: string | number;
    signer_id: string;
    name: string;
    email: string;
}
export interface resendInvitationApiResponse {}

export interface eSignResponse {
    count: number;
    lastESignAddedDate?: string;
}
