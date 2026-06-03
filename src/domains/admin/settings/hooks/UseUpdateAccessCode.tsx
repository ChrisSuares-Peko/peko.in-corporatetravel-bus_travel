import { useCallback, useEffect, useState } from 'react';

import { DropDown } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import { getpartner } from '../../users/api';
import { categoryData, categoryResponse } from '../../users/types/corporateUserTypes';
import { createAccessCode, updateAccessCode } from '../api/accessCode';
import { AccessData, AccessDataPartial } from '../types/accessCode';

const UseUpdateAccessCode = (searchText: string) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [partnerDatas, setPartnerDatas] = useState<DropDown>();
    const updateCurrentAccess = useCallback(
        async (payload: AccessDataPartial) => {
            setIsLoading(true);
            const data: AccessData | false = await updateAccessCode({
                userId: id,
                userType: role,
                ...payload,
            });
            if (data) {
                return true;
            }
            setIsLoading(false);
            return false;
        },
        [id, role]
    );
    const createNewAccess = useCallback(
        async (payload: AccessDataPartial) => {
            setIsLoading(true);
            const data: AccessData | false = await createAccessCode({
                userId: id,
                userType: role,
                ...payload,
            });
            if (data) {
                return true;
            }
            setIsLoading(false);
            return false;
        },
        [id, role]
    );

    const getPartners = useCallback(async () => {
        setIsLoading(true);
        const data: categoryResponse | false = await getpartner({
            userId: id,
            userType: role,
            searchText,
        });
        if (data) {
            const arr = data.data.map((item: categoryData) => ({
                value: item.id.toString(),
                label: item.name,
            }));
            setPartnerDatas(arr);
        }
        setIsLoading(false);
    }, [id, role, searchText]);

    useEffect(() => {
        getPartners();
    }, [getPartners]);
    return { isLoading, createNewAccess, updateCurrentAccess, partnerDatas };
};

export default UseUpdateAccessCode;
