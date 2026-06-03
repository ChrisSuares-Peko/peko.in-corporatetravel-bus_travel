import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import GetSurcharge from './useSurchargeApi';
import { setPaymentData } from '../../payments/slices/payment';

export default function useForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { formDetails, amount } = useAppSelector(state => state.reducer.accounting);
    const taxPeriod = `${formDetails.startMonth} - ${formDetails.endMonth}`;
    const quantity = formDetails.tradeLicenseDoc.length;
    const docs = formDetails.tradeLicenseDoc;

    const totalAmount = quantity * amount;
    const { surchargeData } = GetSurcharge();

    const transformedDoc = docs.map((obj: any, index: any) => {
        const key = `tradeLicenseDoc_${index + 1}`;
        return { [key]: obj.tradeLicenseDoc_1 };
    });

    const handleSubmission = useCallback(async () => {
        const billSummary = [
            {
                key: 'Service name',
                value: 'Corporate Tax Registration',
            },
            {
                key: 'Name',
                value: formDetails.contactPerson,
            },

            {
                key: 'Amount',
                value: totalAmount,
            },
        ];

        const paymentSummary = [
            {
                key: 'Platform fee',
                value:
                    new Intl.NumberFormat('en-IN').format(Number(surchargeData?.surcharge) ?? 0) ??
                    0,
            },
        ];

        const requestBody = {
            tradeLicenseDoc: transformedDoc,
            corporateGovernanceDoc: formDetails.corporateGovernanceDoc,
            emiratesIDDoc: formDetails.emiratesIDDoc,
            passportDoc: formDetails.passportDoc,
            taxPeriod,
            contactPerson: formDetails.contactPerson,
            companyName: formDetails.companyName,
            phoneNumber: formDetails.phoneNumber,
            email: formDetails.email,
            selfDeclaration: formDetails.selfDeclaration,
            quantity,
            amount: totalAmount,
            accessKey: accessKeys.taxRegistration,
            currentUrl: window.location.href,
        };

        dispatch(
            setPaymentData({
                billSummary,
                paymentSummary,
                totalAmount: totalAmount + parseFloat(surchargeData?.surcharge || '0'),
                title: 'Bill Summary',
                payload: requestBody,
                url: 'officeAndBusiness/corporate-tax-registration/payment',
                earningCashbackAmount: Number(surchargeData?.corporateCashback) || 0,
            })
        );

        navigate(paths.dashboard.payments);
    }, [
        dispatch,
        formDetails.companyName,
        formDetails.contactPerson,
        formDetails.corporateGovernanceDoc,
        formDetails.email,
        formDetails.emiratesIDDoc,
        formDetails.passportDoc,
        formDetails.phoneNumber,
        formDetails.selfDeclaration,
        navigate,
        quantity,
        surchargeData?.corporateCashback,
        surchargeData?.surcharge,
        taxPeriod,
        totalAmount,
        transformedDoc,
    ]);

    return { handleSubmission };
}
