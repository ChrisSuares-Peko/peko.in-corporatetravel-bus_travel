type EmployeeValidationError = {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    mobileNo: string | number;
    emergencyNo: string;
    personalEmail: string;
    emergencyContactName: string;
    emergencyContactRelation: string;
    isGccNationality: boolean | string;
    nationality: string;
    personalAddress: string;
    dateOfJoin: string;
    employeeId: number;
    designation: string;
    department: string;
    reportingStaff: string;
    workingDays: string;
    workingHours: string;
    workLocation: string;
    status: string;
    basicPay: string;
    travelAllowances: string;
    homeAllowances: string;
    medicalAllowances: string;
    otherAllowances: string;
    other: string;
    accountName: string;
    accountNumber: string;
    swiftCode: string;
    bankName: string;
    bankBranch: string;
    ibanNumber: string;
    accountType: string;
    beneficiaryName: string;
    corporateUser: string;
    validated: boolean;
    errors: string[];
};

type InitialStateDataType = {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    mobileNo: string;
    emergencyNo: any;
    personalEmail: string;
    emergencyContactName: any;
    emergencyContactRelation: any;
    isGccNationality: boolean;
    nationality: string;
    personalAddress?: string;
    dateOfJoin: string;
    employeeId: number;
    designation: string;
    department: string;
    reportingStaff: string;
    workingDays: string;
    workingHours: string;
    workLocation: string;
    // status: string;
    schedule: string;
    jobType: string;
    basicPay: string;
    travelAllowances: string;
    homeAllowances: string;
    medicalAllowances: string;
    otherAllowances: string;
    other: string;
    accountName: string;
    accountNumber: string;
    swiftCode: string;
    bankName: string;
    bankBranch: string;
    ibanNumber: string;
    accountType: string;
    beneficiaryName: string;

    routingCode: string;
    validated: boolean;
    errors: string[];
    corporateUser?: string;
};

export type OffBoardRequestFormType = {
    lastWorkingDay: string;
    noticePeriod: string;
    offBoardingType: string;
    reasonForOffBoarding: string;
    resignationLetter: string;

    offBoardingDate: string;
};

export type ValidationResponse = {
    // data: {
    //     jsonData: InitialStateDataType[];
    // };
    status: boolean;
    responseCode: string;
    message: string;
    data: {
        jsonData: InitialStateDataType[];
    };
};

export type ApproveSalary = {
    userType?: string;
    userId?: number;
    payingDate: string;
    sendPayslip: boolean;
};

export type ApproveSalaryResponse = {
    status: boolean;
    responseCode: string;
    message: string;
    data: {};
};

export type validateEmployeeInformationPayload = {
    userId?: number;
    userType?: string;
    personalEmail?: string;
    mobileNo?: string;
    employeeId?: string;
    dateOfJoin?: string;
};

export type getEmployeeDocsPayload = {
    userId?: number;
    userType?: string;
    employeeId: string;
    page: number;
    limit: number;
};
export type getEmployeeAssetPayload = {
    userId?: number;
    userType?: string;
    employeeId: string;
    page: number;
    limit: number;
};

export type EmployeeDocument = {
    name: string;
    url: string;
    _doc?: { url: string };
    expiryDate: string;
    _id: string;
    employeeId?: string;
};

export type FetchDocumentsByEmployeeIdResponse = {
    status: boolean;
    message: string;
    data: EmployeeDocument[];
    responseCode: string;
};
