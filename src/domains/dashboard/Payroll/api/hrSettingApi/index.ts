import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    GetPayrollSettingType,
    LeaveSettingsType,
    PayrollSettingType,
    WpsSettings,
} from '../../types/HrSetting';

export const payrollSetting = async (
    payload: PayrollSettingType & { userId: number; userType: string }
) => {
    try {
        const { userId, userType, ...restPayload } = payload;
        const resp: SuccessGenericResponse<GetPayrollSettingType> = await ApiClient.post(
            `${userType}/${userId}/payroll/hr-settings/payroll-settings`,
            restPayload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const leavesummary = async (
    payload: LeaveSettingsType & { userId: number; userType: string }
) => {
    try {
        const { userId, userType, ...restPayload } = payload;
        const resp: SuccessGenericResponse<LeaveSettingsType> = await ApiClient.post(
            `${userType}/${userId}/payroll/hr-settings/leave-settings`,
            {
                ...restPayload,
                userId,
                userType,
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getLeaveSummary = async (payload: UserPayload) => {
    try {
        const { userId, userType } = payload;
        const resp: SuccessGenericResponse<LeaveSettingsType> = await ApiClient.get(
            `${userType}/${userId}/payroll/hr-settings/leave-settings`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        console.error(err, 'hello error');
        return false;
    }
};

export const getPayrollSettings = async (payload: UserPayload) => {
    try {
        const { userId, userType } = payload;
        const resp: SuccessGenericResponse<GetPayrollSettingType> = await ApiClient.get(
            `${userType}/${userId}/payroll/hr-settings/payroll-settings`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        console.error(err, 'hello error');
        return false;
    }
};

export const createWPSSetting = async (
    payload: WpsSettings & { userId: number; userType: string }
) => {
    try {
        const { userId, userType, ...restPayload } = payload;
        const resp: SuccessGenericResponse<WpsSettings> = await ApiClient.post(
            `${userType}/${userId}/payroll/hr-settings/wps-settings`,
            restPayload
        );
        return resp;
    } catch (err) {
        return false;
    }
};

export const getWpsSettings = async (payload: UserPayload) => {
    try {
        const { userId, userType } = payload;
        const resp: SuccessGenericResponse<WpsSettings> = await ApiClient.get(
            `${userType}/${userId}/payroll/hr-settings/wps-settings`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        console.error(err, 'hello error');
        return false;
    }
};
