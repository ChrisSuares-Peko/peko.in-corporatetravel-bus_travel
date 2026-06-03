export type UserPayload = {
    id?: number;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    trnNo: string;
    credentialId: number;
};

export type Credential = {
    username: string;
    name: string;
};

export type RowData = {
    id: number;
    createdAt: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    trnNo: string;
    credential: Credential;
};

export type Data = {
    count: number;
    rows: RowData[];
};

export type RootObject = {
    data: Data;
};

export type customerDetails = {
    value: number;
    label: string;
    email: string;
    mobileNo: string;
};

export type corporateData = {
    customerDetails: customerDetails[];
};

export type customerCredential = {
    name: string;
    username: string;
};

export type getOneData = {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    trnNo: string;
    createdAt: string;
    updatedAt: string;
    credentialId: number;
    corporateUserId: number;
    credential: Credential;
};

export type corporateDetails = {
    value: number;
    label: string;
    email: string;
    mobileNo: string;
};

export type corporateResponse = {
    corporateDetails: corporateDetails[];
};
