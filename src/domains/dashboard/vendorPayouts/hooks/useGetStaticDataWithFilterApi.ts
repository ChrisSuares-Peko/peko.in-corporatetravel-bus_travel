/* eslint-disable @typescript-eslint/no-shadow */
import { useState, useEffect } from 'react';

import { DropDown, SuccessGenericResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import { getStaticDataWithFilter } from '../api/BeneficiaryRegistrationApis';

type useGetStaticDataWithFilterProps = {
    filterType?: string;
};

export default function useGetStaticDataWithFilter({
    filterType,
}: useGetStaticDataWithFilterProps = {}) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [loading, setLoading] = useState(true);
    const [relationShipOptions, setRelationShipOptions] = useState<DropDown[]>([]);
    const [staticData, setStaticData] = useState<DropDown[]>([]);

    useEffect(() => {
        let isMounted = true;

        const fetchRelationships = async () => {
            const staticDataResponse: SuccessGenericResponse<any> | null =
                await getStaticDataWithFilter({
                    userId: id,
                    userType: role,
                    filterType,
                });

            if (isMounted && staticDataResponse) {
                const formattedOptions: DropDown[] =
                    staticDataResponse.data.relationships.map(
                        (relation: { id: string; name: string }) => ({
                            value: relation.id,
                            label: relation.name,
                        })
                    ) || [];
                setRelationShipOptions(formattedOptions);
                setStaticData(staticDataResponse.data.relationships);
                setLoading(false);
            }
        };

        fetchRelationships();

        return () => {
            isMounted = false;
        };
    }, [role, id, filterType]);

    return { loading, staticData, relationShipOptions };
}
