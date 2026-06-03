import { useCallback, useState, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';
import { formattedDateOnly } from '@utils/dateFormat';

import { getBeneficiariesList } from '../api/BeneficiaryRegistrationApis';
import { BeneficiaryTableRow } from '../types/types';

export const useListBeneficiaryApi = (start: number, length: number, search: string) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [beneficiaryTableData, setBeneficiaryTableData] = useState<BeneficiaryTableRow[]>([]);
    const [count, setCount] = useState<number>();

    const fetchBeneficiariesData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data: any | false = await getBeneficiariesList({
                userId: id,
                userType: role,
                start,
                length,
                search,
            });

            if (data) {
                const formattedData = data.result.map((item: { updatedAt: string }) => ({
                    ...item,
                    updatedAt: formattedDateOnly(new Date(item.updatedAt)),
                }));
                setBeneficiaryTableData(formattedData);
                setCount(data.totalData);
            }
        } catch (error) {
            console.error('Failed to fetch beneficiary data', error);
        } finally {
            setIsLoading(false);
        }
    }, [id, length, role, search, start]);

    useEffect(() => {
        fetchBeneficiariesData();
    }, [fetchBeneficiariesData]);

    return { isLoading, data: beneficiaryTableData, count, fetchBeneficiariesData };
};
