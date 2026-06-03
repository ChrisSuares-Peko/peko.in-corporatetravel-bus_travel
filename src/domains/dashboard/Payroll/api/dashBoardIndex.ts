import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    DashboardPayload,
    EventData,
    calendarActivitiesResponse,
    chartPayload,
    chartResponse,
    dashboardResponse,
    emailPayload,
    employeeCountResponse,
    employeePayload,
    employeeResponse,
    getHolidayResponse,
    holidayDeletePayload,
    holidayDeleteResponse,
    holidayPaload,
    holidayPayload,
    holidayUpdatePayload,
    holidayUpdateResponse,
    progressResponse,
    upcomingActivitiesResponse,
} from '../types/dashboardTypes';

export const getDashboardDetails = async (payload: DashboardPayload) => {
    try {
        const resp: SuccessGenericResponse<dashboardResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payroll/dashBoard`
        );

        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const chartDetails = async (payload: chartPayload) => {
    try {
        const resp: SuccessGenericResponse<chartResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payroll/dashBoard/chart?year=${payload.year}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const sendEmail = async (payload: emailPayload) => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/payroll/holiday/sendEmail/${payload.holidayId}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getEmployees = async (payload: employeePayload) => {
    try {
        // const resp: SuccessGenericResponse<employeeResponse> = await ApiClient.get(
        //     `${payload.userType}/${payload.userId}/payroll/employee/current-employees?searchText=`
        // );
        const { userType, userId, month, year } = payload;
        const params: any = {
            searchText: '',
        };
        if (month !== undefined && year !== undefined) {
            params.month = month;
            params.year = year;
        }

        const resp: SuccessGenericResponse<employeeResponse> = await ApiClient.get(
            `${userType}/${userId}/payroll/employee/current-employees`,
            {
                params,
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const upcomingActivities = async (payload: DashboardPayload) => {
    try {
        const resp: SuccessGenericResponse<upcomingActivitiesResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payroll/calendarActivities/upcoming?limit=7`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const calendarActivities = async (payload: DashboardPayload) => {
    try {
        const resp: SuccessGenericResponse<calendarActivitiesResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payroll/calendarActivities`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const holiday = async (payload: holidayPayload) => {
    const reqbody = {
        title: payload.title,
        isAllDay: payload.isAllDay,
        start: payload.start,
        end: payload.end,
        category: payload.category,
        sendPriorEmail: payload.sendPriorEmail,
        isEmailSent: payload.sendPriorEmail,
    };
    try {
        const resp: SuccessGenericResponse<EventData> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/payroll/holiday`,
            reqbody
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const progress = async (payload: DashboardPayload) => {
    try {
        const resp: SuccessGenericResponse<progressResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payroll/dashBoard/progress`
        );

        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getHoliday = async (payload: holidayPaload) => {
    try {
        const resp: SuccessGenericResponse<getHolidayResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payroll/holiday?start=${payload.start}&end=${payload.end}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const deleteHoliday = async (payload: holidayDeletePayload) => {
    try {
        const res: SuccessGenericResponse<holidayDeleteResponse> = await ApiClient.delete(
            `${payload.userType}/${payload.userId}/payroll/holiday/${payload.holidayId}`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};
export const holidayUpdate = async (payload: holidayUpdatePayload) => {
    try {
        const resp: SuccessGenericResponse<holidayUpdateResponse> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/payroll/holiday/${payload.holidayId}`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getEmployeeCount = async ({ userType, userId }: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<employeeCountResponse> = await ApiClient.get(
            `${userType}/${userId}/payroll/employee/count`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
