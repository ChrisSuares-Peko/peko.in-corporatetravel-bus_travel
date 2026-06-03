import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getEmployees } from '../api';
import { employeeResponse, employeeTypes } from '../types/employee';

export function useGetEmployee(isPurchasedPayroll: boolean) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [employees, setEmployees] = useState<employeeTypes[]>([]);
    const employeeList = useCallback(async () => {
        if (isPurchasedPayroll) {
            const data: employeeResponse | false = await getEmployees({
                userId: id,
                userType: role,
            });
            if (data) {
                const details = data.employees as employeeTypes[];
                setEmployees(details);
            }
        }
    }, [role, id, isPurchasedPayroll]);

    useEffect(() => {
        employeeList();
    }, [employeeList]);

    const generateEmployeesDropdown = (data: employeeTypes[]) =>
        data.map(employee => ({
            value: employee.id ?? '',
            label: `${employee?.employeeInformation?.employeeId} - ${employee.fullName}` ?? '',
            personalEmail: employee.personalEmail ?? '',
            fullName: employee.fullName ?? '',
        }));

    return { data: employees, generateEmployeesDropdown };
}
