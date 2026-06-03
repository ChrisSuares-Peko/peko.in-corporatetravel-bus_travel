import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { chartDetails } from '../../api/dashBoardIndex';
import { chartData, chartResponse } from '../../types/dashboardTypes';

export function useChartDetailsApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [details, setDetails] = useState<chartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [year, setYear] = useState<string>('2024');
    const handleYearChange = (value: string) => {
        setYear(value);
    };
    const getChartData = useCallback(async () => {
        const data: chartResponse | false = await chartDetails({
            userId: id,
            userType: role,
            year,
        });
        if (data) {
            setDetails(data.chartData);
        }
        setIsLoading(false);
    }, [id, role, year]);
    useEffect(() => {
        getChartData();
    }, [getChartData]);
    return { isLoading, data: details, handleYearChange };
}
