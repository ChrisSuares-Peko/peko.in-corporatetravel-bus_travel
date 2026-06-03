import { useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { SuccessGenericResponse, SurchargeResponse } from '@customtypes/general';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { getSurcharge } from '@src/services/surcharge';
import { showToast } from '@src/slices/apiSlice';
import { accessKeys } from '@utils/accessKeys';

import { useHafilatApi } from './hafilat/useHafilatApi';
import useHafilatPayment from './hafilat/useHafilatPayment';
import usePayment from './usePayment';
import { getBillDetails, getLimit } from '../api';
import { setBeneficiary, setFormKey, setVendor } from '../slices/billPayment';
import { Beneficiary, FetchBillApiResponse, GetLimitResponse } from '../types';
import { hafilatPaymentPayload } from '../types/haflat';
import { beneficiaryOptions, findObjectByAccessKey } from '../utils/data';

export function useGetBillApi() {
    const dispatch = useAppDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { handleSubmission } = usePayment();
    const serviceRoutes = paths.billPayments;
    const { getBalance } = useHafilatApi();
    const { handleSubmission: handleSubmissionHafilat } = useHafilatPayment();
    const location = useLocation();

    const getBillLimit = async (values: any) => {
        setIsSubmitting(true);
        const data: SuccessGenericResponse<FetchBillApiResponse> | false = await getBillDetails({
            userId: id,
            userType: role,
            flexiKey: values.flexiKey,
            typeKey: values.typeKey,
            path: values.apiPath,
            accountNo: values?.accountNumber?.trim() || values?.plateNumber?.trim(), // plateNumber for darb case
            type: values?.serviceType,
            accountPin: values?.accountPin,
            amount: values?.rechargeAmount,
            optional: values?.eid || values?.serviceType,
        });
        const dueBalanceInAed = data && data.data.dueBalanceInAed;
        const rechargeAmount = values?.rechargeAmount;
        // eslint-disable-next-line no-nested-ternary
        const billAmount = rechargeAmount
            ? Number(rechargeAmount)
            : dueBalanceInAed
              ? parseInt(dueBalanceInAed, 10)
              : 0;

        const surchargeData: SurchargeResponse | false = await getSurcharge({
            userId: id,
            userType: role,
            amount: Number(billAmount),
            accessKey: values?.accessKey,
        });

        if (data && values.accessKey === accessKeys.darb) {
            values.optional1 = data?.data?.WalletDetails[0]?.walletIdentity;
            values.optional2 = data?.data?.WalletDetails[0]?.customerEN;
            values.accountNumber = values?.accountNumber?.trim() || values?.plateNumber?.trim();
        }

        if (data && data.status) {
            setIsSubmitting(false);
            const paymentPageData = {
                ...data.data,
                ...values,
                surcharge: Number(surchargeData && surchargeData?.surcharge) || 0,
                earningCashbackAmount:
                    Number(surchargeData && surchargeData?.corporateCashback) || 0,
            };

            handleSubmission(paymentPageData);
        }
        setIsSubmitting(false);
    };

    const directPay = async (beneficiary: Beneficiary) => {
        const serviceProviderOption = beneficiaryOptions.find(
            option => option.value === beneficiary.accessKey
        );
        if (!serviceProviderOption?.directPay) {
            const item = findObjectByAccessKey(beneficiary.accessKey);
            dispatch(setVendor(item));
            dispatch(setBeneficiary(beneficiary));
            dispatch(setFormKey(Math.random()));
            const pathSegments = location.pathname.split('/');
            const lastSegment = pathSegments[pathSegments.length - 1];
            if (lastSegment === item?.url) {
                dispatch(
                    showToast({
                        description:
                            'Beneficiary details have been successfully filled out. Please enter the amount to continue.',
                        variant: 'success',
                    })
                );
            } else {
                navigate(`/${serviceRoutes.index}/${item?.url}`);
            }
            return;
        }
        setIsSubmitting(true);
        const limitData: GetLimitResponse | false = await getLimit({
            userId: id,
            userType: role,
            path: serviceProviderOption?.path,
        });
        if (limitData) {
            if (serviceProviderOption?.path === accessKeys.hafilat) {
                const flexiKey = limitData?.flexiKey ?? '';
                const res = await getBalance(beneficiary.accountNo, flexiKey);
                if (res === false) return;
                if (res.ProductDetails[0].ItemInfo === null) {
                    const postData: hafilatPaymentPayload = {
                        account: beneficiary.accountNo,
                        amount: Number(res.dueBalanceInAed),
                        flexiKey,
                        typeKey: limitData?.typeKey ?? 0,
                        optionals: {
                            ProductCode: res.ProductDetails[0].ProductCode,
                            isTPurse:
                                res.ProductDetails[0].ProductCategory === 'tpurse' ? '1' : '0',
                            customerMobileNo: '',
                            itemCode: '',
                        },
                        transactionId: res.TransactionId,
                    };
                    handleSubmissionHafilat(postData);
                }
                if (res.ProductDetails[0].ItemInfo !== null) {
                    navigate(
                        `/${serviceRoutes.index}/${paths.billPayments.hafilat}/${paths.billPayments.hafilatDetails}`,
                        {
                            state: {
                                res,
                                cardNumber: beneficiary.accountNo,
                                mobileNumber: '',
                                flexiKey,
                                typeKey: limitData?.typeKey ?? 0,
                            },
                        }
                    );
                }
            } else {
                const values = {
                    ...limitData,
                    accountNumber: beneficiary.accountNo,
                    apiPath: serviceProviderOption?.path,
                    serviceName: serviceProviderOption?.label,
                    beneficiaryName: beneficiary.name,
                    serviceType: beneficiary.optional1,
                    optional: beneficiary.optional1,
                };
                getBillLimit(values);
            }
        }
    };
    return { getBillLimit, isSubmitting, directPay };
}
