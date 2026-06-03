import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { SalaryStatementApiResponse } from '../../types/salaryProfileTypes/employeeSalaryProfile';
import {
    employeeSalaryListingPayload,
    employeeSalaryListingResponse,
    exportSalaryDatapPayload,
    exportSalaryDataResponse,
} from '../../types/salaryProfileTypes/employeeSalaryTable';

export const employeeSalaryListing = async (payload: employeeSalaryListingPayload) => {
    try {
        const res: SuccessGenericResponse<employeeSalaryListingResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payroll/salary/statement`,
            {
                params: {
                    year: Number(payload.year),
                    month: Number(payload.month),
                    searchText: payload.searchText,
                    sort: payload.sort,
                    page: payload.page,
                    filter: payload.filter,
                    limit: 10,
                },
            }
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const employeeSalaryResponseListing = async (payload: employeeSalaryListingPayload) => {
    try {
        const res: SuccessGenericResponse<SalaryStatementApiResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payroll/salary/statement`,
            {
                params: {
                    year: Number(payload.year),
                    month: Number(payload.month),
                    searchText: payload.searchText,
                    sort: payload.sort,
                    page: payload.page,
                    filter: payload.filter,
                    limit: 10,
                },
            }
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const ExportSalaryData = async (payload: exportSalaryDatapPayload) => {
    try {
        const resp: SuccessGenericResponse<exportSalaryDataResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payroll/salary/statement/excel?month=${payload.month}&year=${payload.year}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
