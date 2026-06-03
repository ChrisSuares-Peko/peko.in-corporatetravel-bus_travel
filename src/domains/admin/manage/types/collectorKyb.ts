export type collectorKybListResponse = {
    recordsTotal: number;
    rows: Records[];
};
export type Records = {
    id: number;
    supplierCode: number;
    supplierEmail: string;
    kybStatus: 'REQUESTED' | 'APPROVED' | 'REJECTED';
    rejectReason: string;
    createdAt: string;
    updatedAt: string;
    corporateUserId: number;
    corporateUser: {
        id: number;
        name: string;
        mobileNo: string;
        credentialId: number;
        credential: Credential;
    };
    documents: {
        Trade_License?: string;
        Article_Of_Association?: string;
        Emirates_ID?: string;
        Passport?: string;
        Bank_Letter?: string;
    };
};
export type Credential = {
    id: number;
    username: string;
};

export type DocumentData = {
    tradeLicenseDoc_1?: string;
    tradeLicenseDoc_2?: string;
};

export type collectorKybListPayload = {
    page: number;
    searchText: string;
    pageSize: number;
    type?: string;
    sort?: string;
    sortField?: string;
};

export type ChangeStatusPayload = {
    status: string;
    corporateUserId: number;
};
