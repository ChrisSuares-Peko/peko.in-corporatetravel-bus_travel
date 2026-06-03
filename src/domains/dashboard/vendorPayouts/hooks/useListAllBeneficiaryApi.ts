import { useState, useEffect } from 'react';

import { SuccessGenericResponse } from '@customtypes/general'; // Adjust the import path as needed
import { useAppSelector } from '@src/hooks/store'; // Adjust the import path as needed

import { getBeneficiariesListAll } from '../api/BeneficiaryRegistrationApis'; // Adjust the import path as needed

export default function useGetAllBeneficiaries() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [loading, setLoading] = useState(true);
    const [beneficiaries, setBeneficiaries] = useState<SuccessGenericResponse<any> | []>([]);
    const [beneficiaryOptions, setBeneficiaryOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const fetchBeneficiaries = async () => {
            setLoading(true);

            const beneficiaryData = await getBeneficiariesListAll({
                userId: id,
                userType: role,
            });

            if (isMounted) {
                const formattedBeneficiaries =
                    beneficiaryData.map((beneficiary: { id: string; fullName: string }) => ({
                        value: beneficiary.id,
                        label: beneficiary.fullName,
                    })) || [];
                setBeneficiaries(beneficiaryData ?? []);
                setBeneficiaryOptions(formattedBeneficiaries);
                setLoading(false);
            }
        };

        fetchBeneficiaries();

        return () => {
            isMounted = false;
        };
    }, [role, id]);

    return { beneficiaries, loading, beneficiaryOptions };
}
