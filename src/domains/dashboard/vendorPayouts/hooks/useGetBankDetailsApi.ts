import { useState, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getBankDetails } from '../api/BeneficiaryRegistrationApis';

export default function useGetBankDetails(country: string | undefined) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [loading, setLoading] = useState(true);
    const [bankCodes, setBankCodes] = useState([]);
    const [bankBranches, setBankBranchesData] = useState([]);
    const [agentListData, setAgentListData] = useState([]);
    const [deliveryMode, setDeliveryMode] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchStates = async () => {
            setLoading(true);
            const bulkData = await getBankDetails({
                userId: id,
                userType: role,
                countryCode: country,
            });

            const bankBranchesData = bulkData?.data.bankBranches.data;
            setBankBranchesData(bankBranchesData);
            const bankAgentListData = bulkData?.data.agentList.data;

            if (isMounted) {
                const deliveryModeValue = bankBranchesData[0]?.deliveryMode || null;
                const formattedBankCodes = bankBranchesData.map(
                    ({ bankCode }: any, index: number) => ({
                        key: index + 1,
                        id: index + 1,
                        value: bankCode,
                        label: bankCode,
                        name: bankCode,
                    })
                );

                setDeliveryMode(deliveryModeValue ? String(deliveryModeValue) : null); // Ensure deliveryMode is a string
                setBankCodes(formattedBankCodes);
                setAgentListData(bankAgentListData);
                setLoading(false);
            }
        };

        fetchStates();

        setLoading(false);

        return () => {
            isMounted = false;
        };
    }, [role, id, country]);

    return { bankBranches, bankCodes, loading, agentListData, deliveryMode };
}
