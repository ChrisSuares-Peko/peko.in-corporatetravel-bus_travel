import { useState, useCallback, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { employeeReimbursementDetails } from '../../../api/employeeSalaryApi/ReimbursementApi/index';
import {
    reimbursementTableType,
    reimbursementListingResponse,
} from '../../../types/salaryProfileTypes/ReimbursementTypes/index';

export const useGetEmployeeReimbursementApi = (
    eId: string | undefined,
    page: number,
    limit: number,
    year: number,
    month: number | string,

    reloadTable: boolean
) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [employeeReimbursementRows, setEmployeeReimbursementRows] = useState<
        reimbursementTableType[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>();
    const getEmployeeReimbursementList = useCallback(async () => {
        setIsLoading(true);
        const data: reimbursementListingResponse | false = await employeeReimbursementDetails({
            userId: id,
            userType: role,
            eId,
            limit,
            page,
            year,
            month,
        });
        if (data) {
            const arr = data?.rows?.map(item => ({
                expenseDate: new Date(item.expenseDate).toISOString().split('T')[0] ?? '',
                expenseDetails: item.expenseDetails ?? '',
                amountPaid: `${item.totalPay}` ?? '',
                transferMethod: item.transferMethod ?? '',
                status: item.paymentStatus ?? '',
                invoice: item.supportingDocs ? 'Available' : 'NA',
                action: '',
                id: item.id,
                supportingDocs: item.supportingDocs || '',
                employeeName: '',
                employeeId: item.employee,
                managerEmail: item.managerEmail,
            }));
            setCount(data.count);
            setEmployeeReimbursementRows(arr);
        }
        setIsLoading(false);
    }, [id, role, eId, limit, page, year, month]);
    useEffect(() => {
        getEmployeeReimbursementList();
    }, [getEmployeeReimbursementList, reloadTable]);

    return {
        tableDatas: employeeReimbursementRows,
        orderCount: count,
        tableLoading: isLoading,
    };
};
