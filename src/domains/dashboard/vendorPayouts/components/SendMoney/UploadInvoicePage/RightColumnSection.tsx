import React, { useState, useMemo, useCallback, useEffect } from 'react';

import { Flex } from 'antd';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import AmountDetails from './RightColumnSection/AmountDetails';
import BeneficiarySelection from './RightColumnSection/BeneficiarySection';
import CheckRateButton from './RightColumnSection/CheckRateButtonSection';
import InvoiceDetails from './RightColumnSection/InvoiceDetails';
import MiniCardDisplay from './RightColumnSection/MiniCardDiplaySection';
import TotalAmountDisplay from './RightColumnSection/TotalAmountDisplay';
import useCheckRate from '../../../hooks/useCheckRate';
import useGetAllBeneficiaries from '../../../hooks/useListAllBeneficiaryApi';
import { BeneficiaryData } from '../../../types/types';

const RightColumnSection: React.FC<{
    subtotalAmount: string;
    taxAmount: string;
}> = ({ subtotalAmount, taxAmount }) => {
    const { state: locationState } = useLocation();

    const selectedData = locationState?.selectedData;
    const initialDropdownData = selectedData;
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<BeneficiaryData | null>(
        initialDropdownData
    );
    const { beneficiaryOptions, beneficiaries } = useGetAllBeneficiaries();
    const [subtotal, setSubtotal] = useState<string>('');
    const [tax, setTax] = useState<string>('');
    const [shouldFetchRate, setShouldFetchRate] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        setSubtotal(subtotalAmount || '');
        setTax(taxAmount || '');
    }, [subtotalAmount, taxAmount]);

    const totalAmount = useMemo(() => {
        if (!subtotal || !tax) return 0.0;
        const subtotalValue = parseFloat(subtotal) || 0;
        const taxValue = parseFloat(tax) || 0;
        return parseFloat((subtotalValue + taxValue).toFixed(2));
    }, [subtotal, tax]);

    const { rateData, loading } = useCheckRate(
        selectedBeneficiary?.deliveryMode || '',
        selectedBeneficiary?.country || '',
        totalAmount,
        shouldFetchRate
    );

    const handleSubTotalChange = (value: string) => {
        setSubtotal(value);
    };

    const handleTaxChange = (value: string) => {
        setTax(value);
    };

    const handleBeneficiaryChange = useCallback(
        (value: string) => {
            if (Array.isArray(beneficiaries)) {
                const selected = beneficiaries.find((beneficiary: any) => beneficiary.id === value);
                setSelectedBeneficiary(selected || null);
            } else {
                setSelectedBeneficiary(null);
            }
        },
        [beneficiaries]
    );

    const handleCheckRateClick = useCallback(() => {
        if (!selectedBeneficiary) {
            dispatch(
                showToast({
                    description:
                        'Please upload a file and select a beneficiary before checking the rate.',
                    variant: 'error',
                })
            );
            return;
        }
        if (totalAmount <= 0) {
            dispatch(
                showToast({
                    description: 'Subtotal and Tax fields are required',
                    variant: 'error',
                })
            );
            return;
        }

        // Set the flag to true to trigger the API call
        setShouldFetchRate(true);
    }, [totalAmount, selectedBeneficiary, dispatch]);

    // useEffect to navigate when rateData is available
    useEffect(() => {
        if (rateData && shouldFetchRate) {
            navigate(paths.vendorPayouts.beneficiaryReceives, {
                state: { rateData, totalAmount },
            });
            // Reset the shouldFetchRate flag after navigating
            setShouldFetchRate(false);
        }
    }, [rateData, shouldFetchRate, navigate, totalAmount]);

    return (
        <Flex className="w-full flex flex-col">
            <BeneficiarySelection
                beneficiaryOptions={beneficiaryOptions}
                onChange={handleBeneficiaryChange}
            />
            <InvoiceDetails />
            <MiniCardDisplay selectedBeneficiary={selectedBeneficiary} />
            <AmountDetails
                subtotal={subtotal}
                tax={tax}
                onSubtotalChange={handleSubTotalChange}
                onTaxChange={handleTaxChange}
            />
            <TotalAmountDisplay totalAmount={totalAmount} />
            <CheckRateButton isLoading={loading} onClick={handleCheckRateClick} />
        </Flex>
    );
};

export default RightColumnSection;
