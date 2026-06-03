import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { findCorporates } from '../api';
import { corporateDetails, corporateResponse } from '../types/customertypes';

export const useCorporates = (searchText: string) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<corporateDetails[]>([]);

    const getData = useCallback(async () => {
        setIsLoading(true);
        const data: corporateResponse | false = await findCorporates({
            userId: id,
            userType: role,
            searchText,
        });

        if (data) {
            setTableData(data.corporateDetails);
        }
        setRefresh(false);
        setIsLoading(false);
    }, [id, role, searchText]);

    useEffect(() => {
        getData();
    }, [getData, refresh]);

    return { isLoading, tableData, setRefresh };
};
