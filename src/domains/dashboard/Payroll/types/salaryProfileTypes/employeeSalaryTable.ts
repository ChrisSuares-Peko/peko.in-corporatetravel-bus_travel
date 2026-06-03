export type employeeSalaryListingPayload = {
    userId: number;
    userType: string;
    year: string | number;
    month: string | number;
    searchText: string;
    sort: string;
    page: number;
    limit: number;
    filter: string;
};

export type employeeSalaryListingResponse = {
    count: number;
    salaryCycle: SalaryCycle;
    totalPayableSum: number;
    rows: employeeDetails[];
};
export type SalaryCycle = {
    SalaryCycleStart: string;
    SalaryCycleEnd: string;
    SalaryCycleDays: number;
};
type employeeDetails = {
    corporateUser: string;
    employee: Employee;
    year: number;
    month: number;
    salaryCycleStart: string;
    salaryCycleEnd: string;
    salaryCycleDays: number;
    leaveCount: number;
    leaveDeduction: number;
    attendancePercentage: number;
    salaryInformation: SalaryInformation;
    workSchedule: WorkSchedule;
    gratuityContribution: number;
    reimbursements: any[];
    totalReimbursement: number;
    totalPayable: number;
    others: number;
    department: {
        _id: string;
        departmentName: string;
    };
    status: boolean;
    paySlipEmailSent: boolean;
    message: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    totalOtherDeduction: number;
    totalBonus: number;
    totalOvertime: number;
    totalIncentive: number;
    monthlySalary: number;
};

type EmployeeInformation = {
    dateOfJoin: string;
    employeeId: string;
    designation: string;
    workLocation: string;
    status: string;
};

type offBoardingInformation = {
    lastWorkingDay: string;
    resignationLetter: string;
    noticePeriod: number;
    offBoardingType: string;
    reasonForOffBoarding: string;
};

type WorkSchedule = {
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
};

type SalaryInformation = {
    basicPay: number | 0;
    travelAllowances: number;
    homeAllowances: number;
    medicalAllowances: number;
    otherAllowances: number;
    other: number;
};

type Employee = {
    corporateUser: string;
    fullName: string;
    profileImage: string;
    dateOfBirth: string;
    gender: string;
    mobileNo: string;
    personalEmail: string;
    personalAddress: string;
    employeeInformation: EmployeeInformation;
    offBoardingInformation?: offBoardingInformation;
    emergencyNo?: string;
    id: string;
};

export type salarytableType = {
    id: string;
    name: string;
    employeeId: string;
    role: string;
    basicSalary: string | number;
    others: string | number;
    totalSalary?: string;
    totalDeduction?: string | number;
    status: string;
    action: string;
    email: string;
    image: string;
    department: string;
    salaryId: string;
    eId: string;
    employeeStatus?: string;
    lastWorkingDay?: string;
};

export interface SalaryCycleType {
    salaryCycleStart: string;
    salaryCycleEnd: string;
    salaryCycleDays: number;
}
export type filterState = {
    searchText: string;
    sort: string;
    page: number;
    filter: string;
    year: number;
    month: string | number;
    limit: number;
};
export type filteredState = {
    sort: string;
    page: number;
    itemsPerPage: number;
    filter: string;
    from: string;
    to: string;
};
interface SalaryInfo {
    corporateUser: string;
    employee: string;
    year: number;
    month: number;
    salaryCycleStart: string;
    salaryCycleEnd: string;
    salaryCycleDays: number;
    leaveCount: number;
    leaveDeduction: number;
    attendancePercentage: number;
    totalIncentive: number;
    totalBonus: number;
    totalOvertime: number;
    totalPayable: number;
    totalOtherDeduction: number;
    salaryInformation: {
        basicPay: number;
        travelAllowances: number;
        homeAllowances: number;
        medicalAllowances: number;
        otherAllowances: number;
        other: number;
    };
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
        overTime: string;
    };
    gratuityContribution: number;
    reimbursements: any[]; // You might want to define a type for reimbursements if it follows a specific structure
    totalReimbursement: number;

    status: boolean;
    paySlipEmailSent: boolean;
    message: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
    id: string;
}

interface EmployeeDetails {
    _id: string;
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
        designation: string;
        department: {
            departmentName: string;
            id: string;
        };
        workLocation: string;
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
    employeeDocuments: any[]; // Define a type for employee documents if needed
    bankDetails: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        bankBranch: string;
        ibanNumber: string;
        accountType: string | null;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
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
        overTime: string;
        workHrs?: number; // Optional property
    };
    emergencyNo: string;
}

interface LeaveSummary {
    leaveCount: number;
    leaveType: string;
}

export type SalaryProfileResponse = {
    salaryInfo: SalaryInfo;
    employee: EmployeeDetails;
    leaveSummary: LeaveSummary[];
};
type employeePayload = {
    userType: string;
    userId: number;
};
export type SalaryProfilePayload = employeePayload & {
    employeeId: string | undefined;
};

// export salary data payslip
export type exportSalaryDatapPayload = {
    userType: string;
    userId: number;
    month: number | string;
    year: number | string;
};
export type exportSalaryDataResponse = {
    buffer: {
        type: 'Buffer';
        data: [];
    };
};
