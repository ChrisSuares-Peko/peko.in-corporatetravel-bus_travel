export type DashboardPayload = {
    userType: string;
    userId: number;
};

export type chartPayload = {
    userType: string;
    userId: number;
    year: string;
};
export type emailPayload = {
    userType: string;
    userId: number;
    holidayId: string;
};

export type chartResponse = {
    chartData: chartData[];
};
export type chartData = {
    id: number;
    month: string;
    totalSalary: number;
};

export type holidayPayload = {
    userType: string;
    userId: number;
    title: string;
    isAllDay: boolean;
    start: string;
    end: string;
    category: string;
    sendPriorEmail: boolean;
    isEmailSent: boolean;
};

export type getHoliday = {
    userType: string;
    userId: number;
    start: string;
    end: string;
};

export type dashboardResponse = {
    totalSalary: number;
    lastMonthSalary: number;
    activeEmployees: number;
    nextMonthSalary: number;
    upcomingActivities: activities[];
};
export type activities = {
    title: string;
    body: string;
    start: string;
    type: string;
};

export type upcomingActivitiesResponse = {
    upcomingActivities: upcoming[];
};
export type upcoming = {
    title: string;
    start: string;
    end: string;
    id: string;
    sendPriorEmail: boolean;
    isEmailSent: boolean;
    activityType: string;
};
export type calendarActivitiesResponse = {
    calendarActivities: calendarActivitiesType[];
};
export type calendarActivitiesType = {
    title: string;
    isAllDay: boolean;
    start: string; // Assuming this is a string representation of date
    end: string; // Assuming this is a string representation of date
    category: string;
    id: string;
    activityType: string;
};
export type EventData = {
    corporateUser: string;
    title: string;
    isAllDay: boolean;
    start: string;
    end: string;
    category: string;
    sendPriorEmail: boolean;
    isEmailSent: boolean;
    createdAt: string;
    updatedAt: string;
    id: string;
};

export type employeeResponse = {
    employees: employeeTypes[];
};
export type employeeTypes = {
    fullName: string;
    labe: string;
    employeeInformation: {
        dateOfJoin: string;
        employeeId: string;
        designation: string;
        department: string;
        workLocation: string;
        schedule: string;
        status: string;
    };
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
        workHrs: number;
    };
    id: string;
};

export type employeePayload = {
    userId: number;
    userType: string;
    month?: string;
    year?: string;
};

export type progressResponse = {
    departmentAndEmployees: boolean;
    progress: string;
    holidays: boolean;
    hrSettings: boolean;
    setUpWps: boolean;
};

export type holidayPaload = {
    userId: number;
    userType: string;
    start: string;
    end: string;
};

export type getHolidayResponse = {
    holidays: allHolidays[];
};

export type allHolidays = {
    corporateUser: number;
    title: string;
    isAllDay: boolean;
    start: string;
    end: string;
    category: string;
    sendPriorEmail: boolean;
    isEmailSent: boolean;
    createdAt: string;
    updatedAt: string;
    id: string;
};
export type holidayDeletePayload = {
    userId: number;
    userType: string;
    holidayId: string | undefined;
};
type HolidayData = {
    corporateUser: string;
    title: string;
    isAllDay: boolean;
    start: string; // Date in ISO 8601 format
    end: string; // Date in ISO 8601 format
    category: string;
    sendPriorEmail: boolean;
    isEmailSent: boolean;
    createdAt: string; // Date in ISO 8601 format
    updatedAt: string; // Date in ISO 8601 format
    id: string;
};

export type holidayDeleteResponse = {
    status: boolean;
    responseCode: string;
    message: string;
    data: HolidayData;
};
export type holidayUpdatePayload = {
    userId?: number;
    userType?: string;
    holidayId?: string | undefined;
    title: string;
    isAllDay: boolean;
    start: string;
    end: string;
    category: string;
    sendPriorEmail: boolean;
};
export type holidayUpdateResponse = {
    corporateUser: string;
    title: string;
    isAllDay: boolean;
    start: string;
    end: string;
    category: string;
    sendPriorEmail: boolean;
    isEmailSent: boolean;
    createdAt: string;
    updatedAt: string;
    id: string;
};
export type announcementDeletePayload = {
    userId: number;
    userType: string;
    announcementId: string | undefined;
};
export type announcementDeleteResponse = {
    status: boolean;
    responseCode: string;
    message: string;
    data: {};
};

export interface employeeCountResponse {
    count: number;
    lastEmployeeAddedDate: string;
}
