import { useState, useCallback, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { employeeInfoCard } from '../../api/employees';
import { EmployeeListingResponse } from '../../types/employeeDetails';

export const useGetEmployeeInfoApi = (reloadTable: boolean) => {
    const initialInfoDetails = {
        totalEmployees: 0,
        deviceUsers: 0,
        subscriptionUsers: 0,
        totalSpent: 0,
    };

    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [infoDetails, setInfoDetails] = useState(initialInfoDetails);
    const [isLoading, setIsLoading] = useState(true);

    const getInfoDetails = useCallback(async () => {
        setIsLoading(true);
        const data: EmployeeListingResponse | false = await employeeInfoCard({
            userId: id,
            userType: role,
        });

        if (data) {
            const totalEmployees = data.totalData;
            let deviceUsers = 0;
            let subscriptionUsers = 0;
            let totalSpent = 0;

            data.result.forEach(employee => {
                if (employee.assetsAndFleet.length > 0) {
                    deviceUsers += 1;
                }
                if (employee.subscriptions.length > 0) {
                    subscriptionUsers += 1;
                }
                totalSpent += employee.totalSpent;
            });

            setInfoDetails({
                totalEmployees,
                deviceUsers,
                subscriptionUsers,
                totalSpent,
            });
        }

        setIsLoading(false);
    }, [id, role]);

    useEffect(() => {
        getInfoDetails();
    }, [getInfoDetails, reloadTable]);

    return {
        tableLoading: isLoading,
        infoDetails,
    };
};
