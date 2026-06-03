import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import useSurchargeDetails from './useSurcharge';
import { setPaymentData } from '../../payments/slices/payment';
import { resetFormState } from '../slice';

interface IAttestationDetails {
    passportDoc: string;
    submissionCountry: string;
    address: string;
    email: string;
    contactPersonPhone: string;
}
export default function usePayment() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const formData = useAppSelector(state => state.reducer.documentAttestation.data);

    const { surchargeData } = useSurchargeDetails();

    const handleSubmission = useCallback(
        async (values: IAttestationDetails) => {
            const total =
                (Number(formData.amount) ?? 0) +
                (surchargeData?.surcharge ? parseFloat(surchargeData.surcharge) : 0);
            const billSummary = [
                {
                    key: 'Service name',
                    value: 'Document Attestation',
                },
                {
                    key: 'Document Type',
                    value: formData.documentType,
                },
                {
                    key: 'Issued Country',
                    value: formData.issuedCountry,
                },
                {
                    key: 'Amount',
                    value: new Intl.NumberFormat('en-IN').format(Number(formData.amount) ?? 0) ?? 0,
                },
            ];

            const paymentSummary = [
                {
                    key: 'Platform fee',
                    value:
                        new Intl.NumberFormat('en-IN').format(
                            Number(surchargeData?.surcharge) ?? 0
                        ) ?? 0,
                },
            ];

            const requestBody = {
                amount: formData.amount,
                attestationDetails: {
                    passportDoc: values.passportDoc,
                    documentType: formData.documentType,
                    issuedCountry: formData.issuedCountry,
                    submissionCountry: values.submissionCountry,
                    address: values.address,
                    email: values.email,
                    poBox: '',
                    amount: formData.amount,
                    contactPersonPhone: values.contactPersonPhone,
                    remarks: '',
                    credentialId: formData.credentialId,
                },
                accessKey: accessKeys.documentAttestation,
                currentUrl: window.location.href,
            };

            dispatch(
                setPaymentData({
                    billSummary,
                    paymentSummary,
                    totalAmount: total,
                    title: 'Bill Summary',
                    payload: requestBody,
                    url: 'officeAndBusiness/attestation/payment',
                    earningCashbackAmount:
                        Number(surchargeData && surchargeData?.corporateCashback) || 0,
                })
            );

            dispatch(resetFormState());
            navigate(paths.dashboard.payments);
        },
        [dispatch, navigate, surchargeData, formData]
    );

    return { handleSubmission };
}
