export interface InfoCardProps {
    icon: string;
    title: string;
    value: string;
    bgColor: string;
}

export interface CardProps {
    icon: string;
    title: string;
    link: string;
    isActive: boolean;
}

export interface ActivityData {
    success: boolean;
    description: string;
}

export type UserPayload = {
    userId: number;
    userType: string;
};

export type taxAmount = {
    serviceAmount: number;
};

export type taxPayload = {
    page: number;
    searchText: string;
    pageSize: number;
};
export type historyResponse = {
    recordsTotal: number;
    rows: Record[];
};

export type Record = {
    id: number;
    companyName: string;
    tradeLicenseDoc: TradeLicenseDoc[]; // Array of dynamically named objects
    corporateGovernanceDoc: string;
    emiratesIDDoc: string;
    passportDoc: string;
    taxPeriod: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
    selfDeclaration: number;
    amount: string;
    quantity: number | null;
    status: string;
    remarks: string | null;
    taxCertificateDoc: string | null;
    createdAt: string;
    updatedAt: string;
    credentialId: number;
    credential: Credential;
};
export type TradeLicenseDoc = {
    [key: string]: string; // Dynamically named keys
};

export type Credential = {
    id: number;
    name: string;
};

export type useFilterCommon = {
    searchText: string;
    page: number;
    itemsPerPage: number;
    partnerId?: string | number;
    sort?: 'ASC' | 'DESC';
};

export type updatePayload = {
    id: number;
    tradeLicenseDoc: any[];
    corporateGovernanceDoc: string;
    emiratesIDDoc: string;
    passportDoc: string;
    taxPeriod: string;
    contactPerson: string;
    companyName: string;
    phoneNumber: string;
    email: string;
    selfDeclaration: number | boolean;
    quantity: number;
    amount: number;
    accessKey: string;
};
