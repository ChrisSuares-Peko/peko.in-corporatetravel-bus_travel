import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getAllGuidelines } from '../api';
import { Row, Rows } from '../types/guidelineTypes';

export default function useGetAllGuidelines(invoiceId?: number) {
    const { id, role } = useAppSelector(store => store.reducer.auth);

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<Row[]>([]);
    const [guideline, setGuideline] = useState<Rows[]>([]);

    const guidelineData = useCallback(async () => {
        // setIsLoading(true);
        const response: any = await getAllGuidelines({
            userId: id,
            userType: role,
            invoiceId,
        });

        if (response) {
            setGuideline(response.rows);
        }
        // setIsLoading(false);
    }, [id, invoiceId, role]);

    useEffect(() => {
        guidelineData();
    }, [guidelineData]);

    return { guideline, isLoading };
}
