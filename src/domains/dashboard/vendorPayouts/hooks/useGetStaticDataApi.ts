import { useState, useEffect } from 'react';

import { DropDown } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import { getStaticData } from '../api/BeneficiaryRegistrationApis';

type UseGetStaticDataProps = {
    filterType?: string;
};

export default function useGetStaticData({ filterType }: UseGetStaticDataProps = {}) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [loading, setLoading] = useState(true);
    const [remittancePurposeOptions, setRemittancePurposeOptions] = useState<DropDown[]>([]);
    const [sourceOfFundsOptions, setSourceOfFundsOptions] = useState<DropDown[]>([]);

    const [staticData, setStaticData] = useState<any | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchStaticData = async () => {
            const fetchedStaticData = await getStaticData({ userId: id, userType: role });
            if (isMounted) {
                setStaticData(fetchedStaticData);

                // Fetching and formatting the remittance-purposes data
                const remittancePurposes = fetchedStaticData?.data['remittance-purposes'] || [];
                const formattedRemittancePurposeOptions: DropDown[] = remittancePurposes.map(
                    (purpose: { id: string; name: string }) => ({
                        value: purpose.id,
                        label: purpose.name,
                    })
                );

                // Fetching and formatting the source-of-funds data
                const sourceOfFunds = fetchedStaticData?.data['source-of-funds'] || [];
                const formattedSourceOfFundsOptions: DropDown[] = sourceOfFunds.map(
                    (source: { id: string; name: string }) => ({
                        value: source.id,
                        label: source.name,
                    })
                );

                setRemittancePurposeOptions(formattedRemittancePurposeOptions);
                setSourceOfFundsOptions(formattedSourceOfFundsOptions);
                setLoading(false);
            }
        };

        fetchStaticData();

        return () => {
            isMounted = false;
        };
    }, [role, id]);

    return { loading, remittancePurposeOptions, sourceOfFundsOptions, staticData };
}
