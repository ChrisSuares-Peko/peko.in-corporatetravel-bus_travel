import { useState, useCallback, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getFinancialInfo } from '../../api/financialDoc';
import { FinancialInfoListingResponse } from '../../types/financials';

export const useGetFinancialInfoApi = (reloadTable: boolean) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [infoDetails, setInfoDetails] = useState({
        totalCheques: 0,
        totalFiles: 0,
        completed: 0,
        pending: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const getFinancialInfoCardData = useCallback(async () => {
        setIsLoading(true);
        const data: FinancialInfoListingResponse | false = await getFinancialInfo({
            userId: id,
            userType: role,
        });

        if (data) {
            const { chequeLeaves, financials } = data;

            setInfoDetails({
                totalCheques: chequeLeaves.count,
                totalFiles: financials.count,
                completed: chequeLeaves.rows.filter(cheque => cheque.status === 'Cleared').length,
                pending: chequeLeaves.rows.filter(cheque => cheque.status === 'Pending').length,
            });
        }
        setIsLoading(false);
    }, [id, role]);

    useEffect(() => {
        getFinancialInfoCardData();
    }, [getFinancialInfoCardData, reloadTable]);

    return {
        tableLoading: isLoading,
        infoDetails,
    };
};
