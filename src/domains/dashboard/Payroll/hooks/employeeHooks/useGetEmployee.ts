import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getEmployee } from '../../api/employeeApi';
import { UpdateEmployee } from '../../types/types';

export default function GetEmployeeDetails(empID: string) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [employeeDetails, setEmployeeDetails] = useState<UpdateEmployee | false>();
    const [isLoading, setIsLoading] = useState(true);

    const getEmployeeDetails = useCallback(async () => {
        const data = await getEmployee({
            userId: id,
            userType: role,
            employeeID: empID,
        });

        if (data) {
            const employee = data as unknown;
            const giftCardDetailData = employee as UpdateEmployee;
            setEmployeeDetails(giftCardDetailData);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, role, empID]);

    useEffect(() => {
        getEmployeeDetails();
    }, [getEmployeeDetails]);

    return { data: employeeDetails, isLoading, getEmployeeDetails };
}
