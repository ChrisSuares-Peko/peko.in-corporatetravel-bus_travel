import { DropDown } from '@customtypes/general';

import { ProfileImage } from '../slices/employeeSlices';

export interface InfoCardProps {
    icon: string;
    title: string;
    value: number | undefined | string;
    isCurrency: boolean;
    bgColor: string;
    reference?: React.MutableRefObject<null>;
}

export interface CardProps {
    icon: string;
    title: string;
    link: string;
    isActive: boolean;
    reference?: React.MutableRefObject<null>;
}

export interface ActivityData {
    title: string;
    description: string;
    date: string;
    type: string;
    isLoading?: boolean;
}

export interface AnnouncementDataType {
    id: string;
    key: string;
    date: string;
    subject: string;
    excludedEmployees: string[];
    status: string;
    details?: string;
}

export interface EmployeePayload {
    userId: number;
    userType: string;
    searchText: string;
    page: number;
    limit: number;
    status: 'active' | 'past';
    sortField?: string;
    sortOrder?: string;
}

export interface Employee {
    corporateUser: string;
    fullName: string;
    profileImage: string;
    dateOfBirth: string;
    gender: string;
    mobileNo: string;
    personalEmail: string;
    personalAddress: string;
    nationality: string;
    isGccNationality: string | boolean;
    emergencyContactName: string;
    emergencyContactRelation: string;
    emergencyContactNo: string;
    qualification?: string;
    experienceInYear?: string;
    experienceInMonth?: string;
    maritialStatus?: string;
    employeeInformation: {
        probation: string;
        designation: any;
        dateOfJoin: string;
        employeeId: string;
        workingHours: number;
        department: { departmentName: string; id: string };
        workingDays: number;
        status: string;
        reportingStaff: string;
        schedule?: string;
        jobType: string;
        employeeType?: string;
    };
    salaryInformation: {
        basicPay: number;
        travelAllowances: number | null;
        homeAllowances: number | null;
        medicalAllowances: number | null;
        otherAllowances: number | null;
        other: number | null;
    };
    employeeDocuments: {
        name: string;
        url: string;
        expiryDate: string;
    }[];
    bankDetails: {
        beneficiaryName: string;
        accountNumber: string;
        swiftCode?: string; // Optional if needed
        bankName: string;
        ibanNumber: string;
        bankBranch?: string; // Optional if needed
        accountType?: string | null; // Optional if needed
    };

    createdAt: string;
    updatedAt: string;
    workSchedule: {
        days: {
            monday: boolean;
            tuesday: boolean;
            wednesday: boolean;
            thursday: boolean;
            friday: boolean;
            saturday: boolean;
            sunday: boolean;
        };
        startTime: string;
        endTime: string;
        breakTimeHrs: number;
        overTime?: string; // Optional if needed
    };
    offBoardingInformation?: {
        lastWorkingDay: string;
        resignationLetter: string;
        noticePeriod: number;
        offBoardingType: string;
        reasonForOffBoarding: string;
    };
    emergencyNo: string;
    id: string;
}
export interface UpdateEmployee {
    corporateUser: string;
    fullName: string;
    profileImage: string;
    dateOfBirth: string;
    gender: string;
    mobileNo: string;
    personalEmail: string;
    email: string;
    personalAddress: string;
    nationality: string;
    isGccNationality: string | boolean;
    emergencyContactName: string;
    emergencyContactRelation: string;
    emergencyContactNo: string;
    qualification?: string;
    experienceInYear?: string;
    experienceInMonth?: string;
    maritialStatus?: string;
    employeeInformation: {
        probation: string;
        designation: any;
        dateOfJoin: string;
        employeeId: string;
        workingHours: number;
        department: { departmentName: string; _id: string };
        workingDays: number;
        status: string;
        reportingStaff: string;
        schedule?: string;
        jobType: string;
        employeeType?: string;
    };
    salaryInformation: {
        basicPay: number;
        travelAllowances: number | null;
        homeAllowances: number | null;
        medicalAllowances: number | null;
        otherAllowances: number | null;
        other: number | null;
        totalIncrements: number | null;
    };
    employeeDocuments: {
        name: string;
        url: string;
        expiryDate: string;
    }[];
    bankDetails: {
        beneficiaryName: string;
        accountNumber: string;
        swiftCode?: string; // Optional if needed
        bankName: string;
        ibanNumber: string;
        bankBranch?: string; // Optional if needed
        accountType?: string | null; // Optional if needed
        routingCode?: string;
    };

    createdAt: string;
    updatedAt: string;
    workSchedule: {
        days: {
            monday: boolean;
            tuesday: boolean;
            wednesday: boolean;
            thursday: boolean;
            friday: boolean;
            saturday: boolean;
            sunday: boolean;
        };
        startTime: string;
        endTime: string;
        breakTimeHrs: number;
        overTime?: string; // Optional if needed
    };
    offBoardingInformation?: {
        lastWorkingDay: string;
        resignationLetter: string;
        noticePeriod: number;
        offBoardingType: string;
        reasonForOffBoarding: string;
    };
    emergencyNo: string;
    _id: string;
}
export interface EmployeeListResponse {
    count: number;
    rows: Employee[];
}

export interface ListResponse {
    data: Employee[];
}

export type EmployeeTableData = {
    name: string;
    employeeId: string;
    employeeMail: string;
    image: string;
    designation: string;
    joinDate: string;
    status: string;
    phone: string;
    department: { departmentName: string };
    // department: string;
    id: string;
    isSelected?: boolean;
    lastWorkingDay?: string;
};

export type DeletePayload = {
    userId: number;
    userType: string;
    idToDelete: string;
};

export type DeleteResponse = {
    message: string;
    data: Employee;
};

export type CreateResponse = {
    message: string;
    data: Employee;
    status: boolean;
};

export type CreatePayload = {
    profileImage?: ProfileImage | null;
    sendWelcomeEmail: boolean;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    mobileNo: string;
    personalEmail: string;
    emergencyNo: number | string;
    emergencyContactName: string;
    emergencyContactRelation: string;
    isGccNationality: string | boolean;
    nationality?: string;
    employeeInformation: {
        dateOfJoin: string;
        employeeId: string;
        department: string;
        reportingStaff: string;
        workingHours: number;
        workingDays?: string;
        designation: string;
        jobType: string;
    };
    salaryInformation: {
        basicPay: string;
        travelAllowances: string;
        homeAllowances: string;
        medicalAllowances: string;
        otherAllowances: string;
        other: string;
    };
    employeeDocuments: {
        name: string;
        url: {
            base64: string;
            format: string;
        };
        expiryDate?: string;
    }[];
    bankDetails: {
        beneficiaryName: string;
        accountNumber: string;
        bankName: string;
        swiftCode: string;
        ibanNumber: string;
    };

    userType?: string;
    userId?: number;
};

export type FetchEmployeePayload = {
    sortField?: string;
    sortOrder?: string;
    userType: string;
    userId: number;
    employeeID: string;
};

export type EmployeeGetResponse = {
    status: string;
    message: string;
    data: Employee;
};

export type CountriesResponse = {
    countries: DropDown;
};

export type UpdatePayload = {
    profileImage?: ProfileImage | null;
    id: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    mobileNo: string;
    personalEmail: string;
    emergencyNo: number | string;
    emergencyContactName: string;
    emergencyContactRelation: string;
    isGccNationality: string | boolean;
    nationality?: string;
    employeeInformation: {
        dateOfJoin: string;
        employeeId: string;
        department: string;
        reportingStaff: string;
        workingHours: number;
        workingDays: string;
    };
    salaryInformation: {
        basicPay: string;
        travelAllowances: string;
        homeAllowances: string;
        medicalAllowances: string;
        otherAllowances: string;
        other: string;
    };
    employeeDocuments?: {
        name: string;
        url: {
            base64: string;
            format: string;
        };
        expiryDate?: string;
    }[];
    bankDetails: {
        beneficiaryName: string;
        accountNumber: string;
        bankName: string;
        swiftCode: string;
        ibanNumber: string;
    };

    userType?: string;
    userId?: number;
};
export type UpdatePayloadNew = {
    profileImage?: ProfileImage;
    id: string;
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    mobileNo?: string;
    personalEmail?: string;
    emergencyNo?: number | string;
    emergencyContactName?: string;
    emergencyContactRelation?: string;
    isGccNationality?: string | boolean;
    nationality?: string;
    employeeInformation?: {
        dateOfJoin?: string;
        employeeId?: string;
        department?: string;
        reportingStaff?: string;
        workingHours?: number;
        workingDays?: string;
    };
    salaryInformation?: {
        basicPay?: string;
        travelAllowances?: string;
        homeAllowances?: string;
        medicalAllowances?: string;
        otherAllowances?: string;
        other?: string;
    };
    employeeDocuments?: {
        name?: string;
        url?: {
            base64?: string;
            format?: string;
        };
        expiryDate?: string;
    }[];
    bankDetails?: {
        beneficiaryName?: string;
        accountNumber?: string;
        bankName?: string;
        swiftCode?: string;
        ibanNumber?: string;
    };

    userType?: string;
    userId?: number;
};

export type UpdateResponse = {
    status: boolean;
    responseCode: string;
    message: string;
    data: {
        corporateUser: string;
        fullName: string;
        profileImage: string;
        dateOfBirth: string;
        gender: string;
        mobileNo: string;
        personalEmail: string;
        personalAddress: string;
        employeeInformation: {
            dateOfJoin: string;
            employeeId: string;
            department: string;
            reportingStaff: string;
            workingDays: number;
            workingHours: number;
            status: string;
        };
        salaryInformation: {
            basicPay: number;
            travelAllowances: number;
            homeAllowances: number;
            medicalAllowances: number;
            otherAllowances: number;
            other: number;
        };
        employeeDocuments: {
            name: string;
            url: string;
            expiryDate: string;
        }[];
        bankDetails: {
            accountNumber: string;
            swiftCode: string;
            bankName: string;
            ibanNumber: string;
            beneficiaryName: string;
        };
        createdAt: string;
        updatedAt: string;
        workSchedule: {
            startTime: string;
            endTime: string;
            breakTimeHrs: number;
            days: {
                monday: boolean;
                tuesday: boolean;
                wednesday: boolean;
                thursday: boolean;
                friday: boolean;
                saturday: boolean;
                sunday: boolean;
            };
            overTime: string;
        };
        emergencyContactName: string;
        emergencyContactRelation: string;
        emergencyNo: string;
        isGccNationality: boolean;
        nationality: string;
        id: string;
    };
};

export type GetReportingStaffPayload = {
    userId: number;
    userType: string;
    searchText: String;
};

interface ReportingStaff {
    fullName: string;
    _id: string;
}

export interface EmployeesResponse {
    employees: ReportingStaff[];
}

export type staffSelect = {
    key: number;
    value: string;
    label: string;
};

export type DocumentUpload = {
    name: string;
    url: {
        base64: string;
        format: string;
    };
    expiryDate?: string;
};

export type exportEmployeeDataPayload = {
    userId: number;
    userType: string;
    employeeIds: string[];
    employeeStatus: string;
};

export type exportEmployeeDataResponse = {
    buffer: {
        type: string;
        data: number[]; // Assuming data is an array of numbers
    };
    fileType: string;
};

export type filterStates = {
    search: string;
    start: number;
    length: number;
    year: number;
    month: number;
};

export interface BulkUploadPayload {
    userId?: number;
    userType?: string;
    file: any;
}

export interface EmployeeData {
    jsonData: {
        fullName: string;
        dateOfBirth: string;
        gender: string;
        mobileNo: number;
        emergencyNo: number;
        personalEmail: string;
        emergencyContactName: string;
        emergencyContactRelation: string;
        isGccNationality: boolean;
        nationality: string;
        dateOfJoin: string;
        employeeId: number;
        designation: string;
        department: string;
        reportingStaff: string;
        workingDays: number;
        workingHours: number;
        workLocation: string;
        // status: string;
        basicPay: number;
        accountName: string;
        accountNumber: number;
        swiftCode: string;
        bankName: string;
        bankBranch: string;
        ibanNumber: number;
        accountType: string;
        beneficiaryName: string;
        corporateUser: string;
        validated: boolean;
        errors: string[];
    }[];
}

interface InitialStateDataType {
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
    jobType: string;
    schedule: string;
    workingDays: string;
    workingHours: string;
    workLocation: string;
    // status: string;
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
    corporateUser: string;

    validated: boolean;
    errors: string[];
}

export interface BulkEmployeeUploadResponse {
    status: boolean;
    CountOfDocs: string;
    responseCode: string;
    message: string;
    jsonData: InitialStateDataType[];
}

export type BulkUploadCreatePayload = {
    userId?: number;
    userType?: string;
    jsonData: {
        fullName: string;
        dateOfBirth: string;
        gender: string;
        mobileNo: string;
        emergencyNo: string;
        personalEmail: string;
        emergencyContactName: string;
        emergencyContactRelation: string;
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
    }[];
};

export type excelTemplatePayload = {
    userId?: number;
    userType?: string;
};

export type GetExcelTemplateResponse = {
    status: boolean;
    responseCode: string;
    message: string;

    buffer: {
        type: string;
        data: number[];
    };
};
type ResignationLetterPayload = {
    base64: string;
    format: string;
};
export type OffBoardEmployeePayload = {
    userId?: number;
    userType?: string;
    employeeId?: number;
    id?: number;
    lastWorkingDay?: string;
    noticePeriod?: string;
    offBoardingType?: string;
    offBoardingDate?: string;
    reasonForOffBoarding?: string;
    resignationLetter?: ResignationLetterPayload;
};
