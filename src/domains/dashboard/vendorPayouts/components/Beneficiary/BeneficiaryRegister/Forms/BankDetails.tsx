/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';

import { Button, Flex, Form } from 'antd';
import { Formik } from 'formik';
import { useLocation } from 'react-router-dom';

import useAutoFill from '@src/domains/dashboard/vendorPayouts/hooks/useAutoFill';
import { useUpdateBeneficiary } from '@src/domains/dashboard/vendorPayouts/hooks/useBeneficiaryUpdateApi';
import { useCreateBeneficiaryApi } from '@src/domains/dashboard/vendorPayouts/hooks/useCreateBeneficiaryApi';
import useGetBankDetails from '@src/domains/dashboard/vendorPayouts/hooks/useGetBankDetailsApi';
import { bankDetailsSchema } from '@src/domains/dashboard/vendorPayouts/schema/beneficiaryProfile';
import { setBankData } from '@src/domains/dashboard/vendorPayouts/slices/beneficiarySlices';
import { CreateBeneficiaryPayload } from '@src/domains/dashboard/vendorPayouts/types/types';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import BankFormFields from './BankFormFields';
import FormHeader from './FormHeader';

type Props = {
    changeTab: (direction: 'next' | 'prev') => void;
};

const BankDetails = ({ changeTab }: Props) => {
    const dispatch = useAppDispatch();
    let { personalDetails, addressDetails, bankDetails } = useAppSelector(
        state => state.reducer.vendorBeneficiary
    );
    const { role, id } = useAppSelector(state => state.reducer.auth);

    const { state: locationState } = useLocation();
    const selectedData = locationState?.selectedData;
    if (selectedData) {
        bankDetails = selectedData;
    }

    const { fullName, email, phoneNumber, relationShip, additionalDetails } = personalDetails;
    const { addressLineOne, addressLineTwo, country, state, city } = addressDetails;
    const { bankBranches, bankCodes, deliveryMode } = useGetBankDetails(country);

    const [bankName, setBankName] = useState('');
    const { createBeneficiary } = useCreateBeneficiaryApi();
    const { updateBeneficiaryById } = useUpdateBeneficiary();

    const handleBankDetailsSubmit = async (values: any) => {
        const { bankAccountName, bankAccountNumber, bankCode, bankAddress } = values;

        const beneficiaryData: CreateBeneficiaryPayload = {
            beneficiaryInformation: {
                fullName,
                email,
                phoneNumber,
                relationShip,
                addressLineOne,
                addressLineTwo,
                country,
                state,
                city,
                bankAccountName,
                bankAccountNumber,
                bankCode,
                bankName,
                bankAddress,
                additionalDetails,
                deliveryMode,
            },
            userType: role,
            userId: id,
        };

        if (selectedData) {
            updateBeneficiaryById(beneficiaryData, selectedData?.id!);
        } else {
            createBeneficiary(beneficiaryData);
        }
    };

    const handlePreviousClick = (values: any) => {
        dispatch(setBankData(values));
        changeTab('prev');
    };

    return (
        <Formik
            initialValues={{
                bankName: bankDetails.bankName || '',
                bankAccountName: bankDetails.bankAccountName || '',
                bankAccountNumber: bankDetails.bankAccountNumber || '',
                bankCode: bankDetails.bankCode || '',
                bankAddress: bankDetails.bankAddress || '',
                deliveryMode: bankDetails.deliveryMode || '',
            }}
            validationSchema={bankDetailsSchema}
            onSubmit={async (values, { setSubmitting, validateForm }) => {
                const formikValues = { ...values, bankName };
                await validateForm(formikValues); // Validate with the updated values
                dispatch(setBankData(formikValues)); // state with the latest values
                await handleBankDetailsSubmit(formikValues);
                setSubmitting(false); // Mark the form as no longer submitting
            }}
        >
            {({ handleSubmit, setFieldValue, values }) => {
                useAutoFill(values, bankBranches, setBankName, setFieldValue);

                return (
                    <Form onFinish={handleSubmit} layout="vertical">
                        <FormHeader step="1/3" title="Bank Details:" />
                        <BankFormFields
                            bankCodes={bankCodes}
                            deliveryMode={deliveryMode || ''}
                            bankName={bankName}
                        />
                        <Flex gap={10} className="mt-16">
                            <Button type="primary" danger htmlType="submit">
                                Submit
                            </Button>
                            <Button htmlType="button" onClick={() => handlePreviousClick(values)}>
                                Previous
                            </Button>
                        </Flex>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default BankDetails;
