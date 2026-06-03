export type OrderDatatype = {
    id: string;
    credential: string;
    email: string;
    mobileNo: string;
    partnerName: string;
    action: JSX.Element;
};

export type Credential = {
    username: string;
    role: string;
    name: string;
    registeredBy: any; // Change this to the appropriate type if known
    passwordProtection: number;
};

export type Data = {
    id: number;
    email: string;
    mobileNo: string;
    name: string;
    firstName: string | null;
    lastName: string | null;
    designation: string | null;
    website: string | null;
    country: string | null;
    city: string | null;
    sector: string | null;
    poBox: string | null;
    countryCode: string;
    contactPersonName: string | null;
    companyName: string;
    companySize: string | null;
    contactPersonEmail: string | null;
    contactPersonPhone: string | null;
    tradeLicenseNo: string | null;
    activity: string | null;
    tradeLicenseExpiry: string | null;
    tradeLicenseDoc: string | null;
    trnCertificate: string | null;
    trnNo: string | null;
    issuingAuthority: string | null;
    referralCode: string | null;
    kycRemarks: string | null;
    kycStatus: string;
    latLng: string | null;
    logo: string | null;
    isActive: number;
    registeredBy: string | null;
    isMFA: number;
    sendMfaCodeToEmail: number;
    sendMfaCodeToPhone: number;
    sendMfaCodeToAuthApp: number;
    totpSecret: string | null;
    landlineNo: string | null;
    backupCodes: string | null;
    monthlyReport: string | null;
    weeklyReport: string | null;
    dailyReport: string | null;
    eidDoc: string | null;
    trnExpiry: string | null;
    createdAt: string;
    updatedAt: string;
    packageId: number;
    credentialId: number;
    credential: Credential;
    balance: string;
    partnerId: number | null;
    partner?: {
        id: number | null;
        name: string | null;
    };
    partnerName?: string;
};

export type ApiResponse = {
    draw: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: Data[];
};
export type updateStatus = {
    corporateId?: string | number;
    isActive: any;
};
export type categorySearch = {
    searchText: string;
};
export type activeResponse = {
    data: string;
};
export type categoryResponse = {
    data: categoryData[];
};
export type categoryData = {
    id: number | string;
    username: string;
    name: string;
};

export type getCorporateUsers = {
    searchText: string;
    page: number;
    itemsPerPage: number;
    partnerId: string | number;
    type?: string;
    sort?: string;
    sortField?: string;
};

export type updateData = {
    id?: number;
    contactPersonName: string;
    name: string;
    activity?: string;
    city: string;
    email: string;
    kycStatus: string;
    mobileNo: string;
    packageId: string;
    passwordProtection: boolean;
    designation: string;
    tradeLicenseNo?: string;
    tradeLicenseExpiry: string | null;
    trnNo?: string;
    trnExpiry: string | null;
};

export type kycResponse = {
    kycType: kycTypes[];
};

export type kycTypes = {
    value: string;
    label: string;
};
export type packagesResponse = {
    data: packagesTypes[];
};

export type packagesTypes = {
    id: string;
    packageName: string;
};
