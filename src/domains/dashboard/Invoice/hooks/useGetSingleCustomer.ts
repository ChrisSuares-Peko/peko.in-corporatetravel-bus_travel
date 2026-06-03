import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { findOne } from '../api';
import { getOneData } from '../types/customertypes';

export const GetSingleCustomer = (cid: number) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [singleData, setTableData] = useState<getOneData>();
    const getSingle = useCallback(async () => {
        setIsLoading(true);
        const data: getOneData | false = await findOne({
            userId: id,
            userType: role,
            id: cid,
        });

        if (data) {
            setTableData(data);
        }
        setIsLoading(false);
    }, [cid, id, role]);

    useEffect(() => {
        getSingle();
    }, [getSingle]);

    return { isLoading, setRefresh, getSingle, singleData };
};
