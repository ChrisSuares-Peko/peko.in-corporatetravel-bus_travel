import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getEmployeeList } from '../../api/employeeApi';
import { EmployeeTableData } from '../../types/types';

interface UseEmployeeListApiProps {
    initialPage?: number; // Optional initial page
    initialLimit?: number; // Optional initial limit
    employeeStatus: 'active' | 'past';
    offboardReload: boolean;
    ''?: string;
    initialSortOrder?: string;
    sortField: string;
    sortOrder: string;
    debouncedSearch: string;
}

export function useEmployeeListApi({
    initialPage = 1,
    initialLimit = 10,
    employeeStatus = 'active',
    offboardReload,
    sortField,
    sortOrder,
    debouncedSearch,
}: UseEmployeeListApiProps) {
    const { role, id } = useAppSelector(state => state.reducer.auth);

    const [tableData, setTableData] = useState<EmployeeTableData[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [count, setCount] = useState(0);

    const GetEmployeesList = useCallback(async () => {
        const data = await getEmployeeList({
            userId: id,
            userType: role,

            page: currentPage,
            limit,
            searchText: debouncedSearch,
            status: employeeStatus,
            sortField,
            sortOrder,
        });

        if (data) {
            const employeeData = data;
            const arr = employeeData.rows.map(employee => ({
                employeeId: employee.employeeInformation?.employeeId,
                name: employee.fullName,

                joinDate: employee.employeeInformation?.dateOfJoin,
                status: employee.employeeInformation?.status,
                image: employee?.profileImage,
                employeeMail: employee?.personalEmail,
                phone: employee?.mobileNo,
                department: employee.employeeInformation?.department,
                id: employee?.id,
                designation: employee.employeeInformation?.designation,
                lastWorkingDay: employee.offBoardingInformation?.lastWorkingDay,
            }));

            setTableData(arr);

            setCount(employeeData.count);

            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, role, currentPage, limit, debouncedSearch, employeeStatus, sortField, sortOrder]);

    useEffect(() => {
        GetEmployeesList();
    }, [GetEmployeesList, offboardReload, sortField, sortOrder]);

    const refetch = () => {
        GetEmployeesList();
    };

    return {
        data: tableData,
        isLoading,
        currentPage,
        setCurrentPage,
        limit,
        setLimit,
        count,
        refetch,
    };
}
