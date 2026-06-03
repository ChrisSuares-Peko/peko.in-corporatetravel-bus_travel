import { useState, useEffect } from 'react';

import { SuccessGenericResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import { getState } from '../api/BeneficiaryRegistrationApis';

export default function useGetState(selectedCountry: string | undefined) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [loading, setLoading] = useState(true);
    const [states, setStates] = useState<SuccessGenericResponse<any> | []>([]);
    const [stateOptions, setStateOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const fetchStates = async () => {
            setLoading(true);
            const stateData = await getState({
                userId: id,
                userType: role,
                countryCode: selectedCountry,
            });

            if (isMounted) {
                const formattedStates =
                    stateData?.data?.data?.map((state: { stateCode: any; stateName: any }) => ({
                        value: state.stateCode,
                        label: state.stateName,
                        name: state.stateName,
                    })) || [];
                setStates(stateData?.data?.data ?? []);
                setStateOptions(formattedStates);
                setLoading(false);
            }
        };

        if (selectedCountry) {
            fetchStates();
        } else {
            setLoading(false);
            setStateOptions([]);
        }

        return () => {
            isMounted = false;
        };
    }, [role, id, selectedCountry]);

    return { states, loading, stateOptions };
}
