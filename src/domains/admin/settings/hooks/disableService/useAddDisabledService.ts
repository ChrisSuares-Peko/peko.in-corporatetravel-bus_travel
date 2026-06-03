import { useCallback, useEffect, useState } from 'react';

import { DropDown } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import { createDisabledApi, getCorporates, getOperators } from '../../api/disabledService';
import {
    CorporateUser,
    CorporateUserData,
    Service,
    ServiceProvider,
    ServiceProviderData,
    createDisabledService,
} from '../../types/disabledTypes';

type Props = {
    searchCorporate: string;
    searchOperator: string;
};

const useAddDisabledService = ({ searchCorporate, searchOperator }: Props) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [corporateData, setCorporateData] = useState<DropDown>();
    const [operatorData, setOperatorData] = useState<DropDown>();
    const getAllCorporates = useCallback(async () => {
        setIsLoading(true);
        const data: CorporateUserData | false = await getCorporates({
            userId: id,
            userType: role,
            searchCorporate,
        });
        if (data) {
            const arr = data.result.map((item: CorporateUser) => ({
                value: item.credentialId.toString(),
                label: item.name,
            }));
            setCorporateData(arr);
        }
    }, [id, role, searchCorporate]);
    const getAllOperators = useCallback(async () => {
        setIsLoading(true);
        const data: ServiceProviderData | false = await getOperators({
            userId: id,
            userType: role,
            searchOperator,
        });
        if (data) {
            const arr = data.data.map((item: ServiceProvider) => ({
                value: item.id.toString(),
                label: item.serviceProvider,
            }));
            setOperatorData(arr);
        }
    }, [id, role, searchOperator]);
    const createDisabledServices = useCallback(
        async (payload: createDisabledService) => {
            setIsLoading(true);
            const data: Service | false = await createDisabledApi({
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

    useEffect(() => {
        getAllCorporates();
        getAllOperators();
    }, [getAllCorporates, getAllOperators]);

    return { operatorData, corporateData, createDisabledServices };
};

export default useAddDisabledService;
