export interface LeaveRequestFormType {
    employeeId: string;
    typeOfLeave: string;
    leaveCount: string;
    start: string;
    end: string;
    leaveSupportingDocs: string;
    supportingDocFormat: string;
}

export type leavePayload = {
    id: string;
    userId: number;
    userType: string;
};

export type addLeavePayload = {
    employeeId: string;
    userId: number;
    userType: string;
    start: string;
    end: string;
    leaveCount: string;
    typeOfLeave: string;
    leaveSupportingDocs: Docs | null | string;
    supportingDocFormat: string;
};

export type updateLeavePayload = {
    leaveId: string;
    userId: number;
    userType: string;
    start: string;
    end: string;
    leaveCount: string;
    typeOfLeave: string;
    leaveSupportingDocs: Docs | null | string;
    supportingDocFormat: string;
};

export type Docs = {
    base64: string;
    format: string;
};

export type availableLeaveResponse = {
    availableLeaves: leaves[];
};

export type leaves = {
    count: number | string;
    value: string;
    label: string;
};

export type singleLeavePayload = {
    userId: number;
    userType: string;
    leaveId?: string;
};

export type singleLeaveResponse = {
    leaveData: LeaveData;
};

export type LeaveData = {
    corporateUser: number;
    employee: string;
    managerEmail: string;
    start: string;
    end: string;
    leaveHours: number;
    leaveCount: number;
    typeOfLeave: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    leaveSupportingDocs: string;
};

export type leaveData = {
    leaveData: leaveResponse[];
    totalCount: number;
};

export type leaveResponse = {
    corporateUser: string;
    createdAt: string;
    employee: {
        fullName: string;
        id: string;
    };
    end: string;
    id: string;
    leaveCount: number;
    leaveHours: number;
    leaveSupportingDocs: string;
    managerEmail: string;
    start: string;
    typeOfLeave: string;
    updatedAt: string;
};

export type LeaveTableRow = {
    id: string;
    leaveType: string;
    from: string;
    to: string;
    totalDays: number;
    file: string;
    leaveSupportingDocs: string;
    action: any;
    employeeId: string;
    employeeName: string;
};

export type leaveListPayload = {
    userType: string;
    userId: number;
    start: number;
    length: number;
    search: string;
    year: number;
    month: number;
};

export interface LeaveTakenSummaryData {
    title: string;
    value: number;
    icon: string;
}

export type GetTakenLeavePayload = {
    userId: number;
    userType: string;
    eId: string | undefined;
};

export type GetTakenLeaveResponse = {
    takenLeaves: {
        [key: string]: number;
    };
};

export type EmployeeLeaveListingPayload = {
    userId: number;
    userType: string;
    eId: string | undefined;
    page: number;
    limit: number;
    year: number;
    month: number | string;
};

export type leaveListingResponse = {
    count: number;
    rows: LeaveData[];
};
export type leaveTableType = {
    leaveType: string;
    from: string;
    to: string;
    totalDays: number;
    file: string;
    action: any;
    id: string;
    employeeId: string;
};

export type LeaveDeletePayload = {
    userId: number;
    userType: string;
    rId: string | undefined;
};
export type leaveDataPayload = {
    userId: number;
    userType: string;
    eId: string | undefined;
};
