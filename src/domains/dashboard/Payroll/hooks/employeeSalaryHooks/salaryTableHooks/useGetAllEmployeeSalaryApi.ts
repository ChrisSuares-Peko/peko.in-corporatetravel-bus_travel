import { useState, useCallback, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { employeeSalaryListing } from '../../../api/employeeSalaryApi/employeeSalary';
import {
    employeeSalaryListingResponse,
    salarytableType,
} from '../../../types/salaryProfileTypes/employeeSalaryTable';

export const useGetEmployeeSalaryApi = (
    searchText: string,
    sort: string,
    page: number,
    limit: number,
    filter: string,
    year: number | string,
    month: number | string
) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [employeeRows, setEmployeeRows] = useState<salarytableType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>();
    const [salaryCycle, setSalaryCycle] = useState<any>(null);
    const [salaryArray, setSalaryArray] = useState<any>(null);

    const getEmployeeSalaryList = useCallback(async () => {
        setIsLoading(true);
        const data: employeeSalaryListingResponse | false = await employeeSalaryListing({
            userId: id,
            userType: role,
            year,
            month,
            searchText,
            sort,
            page,
            limit,
            filter,
        });
        if (data) {
            const arr = data?.rows?.map(item => ({
                id: item.id,
                name: item.employee.fullName ?? '',
                employeeId: item.employee.employeeInformation.employeeId ?? '',
                role: item.employee.employeeInformation.designation ?? '',
                basicSalary: `AED ${formatNumberWithLocalString(item?.salaryInformation?.basicPay || 0)}`,
                monthlySalary: `AED ${formatNumberWithLocalString(item?.monthlySalary || 0)}`,
                others: `AED ${formatNumberWithLocalString(item?.others || 0)}`,
                totalSalary: `AED ${formatNumberWithLocalString(item?.totalPayable || 0)}`,
                totalDeduction: `AED ${formatNumberWithLocalString(item.totalOtherDeduction + item.leaveDeduction || 0)}`,
                status: item.paymentStatus,
                action: '' ?? '',
                email: item.employee.personalEmail ?? '',
                image: item.employee.profileImage,
                department: item.department.departmentName,
                salaryId: item.id,
                eId: item.employee.id,
                employeeStatus: item.employee.employeeInformation.status,
                lastWorkingDay: item.employee.offBoardingInformation?.lastWorkingDay,
            }));

            setCount(data.count);
            // console.log("data from hook !!",data)
            setEmployeeRows(arr);
            setIsLoading(false);
            setSalaryCycle(data.salaryCycle ?? null);

            const salary = data?.rows?.map(item => ({
                id: item.id,
                name: item.employee.fullName ?? '',
                employeeId: item.employee.employeeInformation.employeeId ?? '',
                role: item.employee.employeeInformation.designation ?? '',
                totalBonus: item.totalBonus ?? '',
                totalDeduction:
                    parseFloat((item.totalOtherDeduction + item.leaveDeduction).toFixed(2)) ?? 0,
                totalIncentive: item.totalIncentive ?? '',
                totalOvertime: item.totalOvertime ?? '',
                totalPayable: item.totalPayable ?? '',
                monthlySalary: Number(item.monthlySalary) ?? 0,
                totalSalary: `AED ${item?.totalPayable}` ?? '0',
            }));
            setSalaryArray(salary);
        } else {
            setEmployeeRows([]);
            setCount(0);
            setIsLoading(false);
            setSalaryCycle(null);
            setSalaryArray(null);
        }
    }, [id, role, year, month, searchText, sort, page, limit, filter]);

    useEffect(() => {
        getEmployeeSalaryList();
    }, [getEmployeeSalaryList]);

    return {
        tableDatas: employeeRows,
        orderCount: count,
        tableLoading: isLoading,
        salaryCycle,
        salaryArray,
    };
};
