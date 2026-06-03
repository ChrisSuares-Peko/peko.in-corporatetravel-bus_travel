import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getEmployees } from '../../api/employees';
import { GetEmployeesResponse } from '../../types/employeeDetails';

export function useGetEmployee() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [employees, setEmployees] = useState<any[]>([]);
    const employeeDataList = useCallback(async () => {
        const data: GetEmployeesResponse | false = await getEmployees({
            userId: id,
            userType: role,
            searchText: '',
        });
        if (data) {
            const arr = data?.employeesData.map(item => ({
                employee: item.employeeName ?? '',
                employeeId: item.employeeID ?? '',
                department: item.department ?? '',
                employeeEmail: item.employeeEmail ?? '',
                id: item?.id ?? '',
            }));

            setEmployees(arr);
        }
    }, [role, id]);

    useEffect(() => {
        employeeDataList();
    }, [employeeDataList]);

    const generateEmployeesDropdown = (data: any[], existEmployee?: any) =>
        data
            .filter(employee => !existEmployee || existEmployee.id !== employee.id)
            .map(employee => ({
                value: employee.id,
                label: `${employee.employee} - ${employee?.employeeId}`,
            }));

    return { data: employees, generateEmployeesDropdown };
}
