import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getpartner } from '../api/partnerPermission';
import { categoryData, categoryResponse } from '../types/partnerPermission';

const usePartnersForCorporate = (searchText: string) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [loading, setLoading] = useState(false);
    const [categoryDatas, setCategoyDatas] = useState<categoryData[]>();
    const getPartners = useCallback(async () => {
        setLoading(true);
        const data: categoryResponse | false = await getpartner({
            userId: id,
            userType: role,
            searchText,
        });
        if (data) {
            setCategoyDatas(data.data);
        }
        setLoading(false);
    }, [id, role, searchText]);

    useEffect(() => {
        getPartners();
    }, [getPartners]);

    return { categoryDatas, loading };
};

export default usePartnersForCorporate;
