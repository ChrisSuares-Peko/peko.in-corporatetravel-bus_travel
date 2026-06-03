import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getEmployees } from '../../api/dashBoardIndex';
import { employeeResponse, employeeTypes } from '../../types/dashboardTypes';

export function useGetEmployee(month?: any, year?: any) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [employees, setEmployees] = useState<employeeTypes[]>([]);
    const employeeList = useCallback(async () => {
        const data: employeeResponse | false = await getEmployees({
            userId: id,
            userType: role,
            month,
            year,
        });
        if (data) {
            const details = data.employees as employeeTypes[];
            setEmployees(details);
        }
    }, [id, role, month, year]);

    useEffect(() => {
        employeeList();
    }, [employeeList]);

    const generateEmployeesDropdown = (data: employeeTypes[]) =>
        data.map(employee => ({
            value: employee.id,
            label: `${employee.fullName} (${employee.employeeInformation.employeeId})`,
            dateOfJoin: employee.employeeInformation.dateOfJoin,
        }));
    return { data: employees, generateEmployeesDropdown };
}
