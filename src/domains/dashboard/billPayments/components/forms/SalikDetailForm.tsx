import React, { useEffect } from 'react';

import { Button, Col, Flex, Form, Typography } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import PinInput from './PinInput';
import { useGetBillApi } from '../../hooks/useGetBillApi';
import { SalikSchema } from '../../schema/Salik';
import { Beneficiary, BillDetailsInitialValuesType, GetLimitResponse } from '../../types';

interface BillDetailsFormProps {
    limitData: GetLimitResponse;
    isLoading: boolean;
}
const SalikDetailForm = ({ limitData, isLoading }: BillDetailsFormProps) => {
    const navigate = useNavigate();
    const item = useAppSelector(state => state.reducer.billPayment);
    const serviceData = item ? item.vendor : null;
    let beneficiary: Beneficiary | null = item ? item.beneficiary : null;
    const formKey: number | null = item ? item.formKey : 0;

    const { tableData: beneficiaryList } = useAppSelector(state => state.reducer.beneficiary);
    useEffect(() => {
        if (!serviceData) {
            navigate(`/${paths.billPayments.index}`);
        }
    }, [serviceData, navigate]);

    const inputComponents = serviceData?.inputComponents;
    const title = serviceData?.title;
    const path = serviceData?.path;

    const { getBillLimit, isSubmitting } = useGetBillApi();
    const initialValues: BillDetailsInitialValuesType = {};

    inputComponents?.forEach(component => {
        initialValues[component.name] = '';
    });
    console.log('initialValues', initialValues);
    console.log('beneficiary', beneficiary);
    if (beneficiary) {
        initialValues.accountNumber = beneficiary.accountNo;
        initialValues.accountPin = beneficiary.optional1;
    }

    return (
        <Formik
            key={formKey}
            initialValues={initialValues}
            enableReinitialize
            onSubmit={values => {
                if (!beneficiary && beneficiaryList) {
                    beneficiary =
                        beneficiaryList.filter(
                            value => value.accountNo === values.accountNumber
                        )[0] || null;
                }
                getBillLimit({
                    beneficiaryName: beneficiary?.name,
                    ...values,
                    ...limitData,
                    serviceName: title,
                    apiPath: path,
                });
            }}
            validateOnMount
            validationSchema={SalikSchema(limitData?.minDenomination, limitData?.maxDenomination)}
        >
            {({ handleSubmit }) => (
                <Form layout="vertical" onFinish={handleSubmit} className="mt-6">
                    <Flex wrap="wrap" className="flex-col sm:flex-row">
                        <Col className="sm:mr-5">
                            <TextInput
                                label="Account Number"
                                name="accountNumber"
                                type="text"
                                isRequired
                                minLength={5}
                                maxLength={10}
                                allowNumbersOnly
                                placeholder="Example: 3XXXXX"
                                classes="sm:w-[18rem]"
                            />
                        </Col>
                        <Col className="sm:mr-5">
                            <PinInput
                                label="Account PIN"
                                name="accountPin"
                                type="text"
                                isRequired
                                maxLength={4}
                                placeholder="Example: 1XX4"
                                classes="sm:w-[18rem]"
                            />
                        </Col>
                        <Col className="sm:mr-5">
                            <TextInput
                                label="Top-up Amount"
                                name="rechargeAmount"
                                type="text"
                                allowNumbersOnly
                                isRequired
                                placeholder="Example: 100"
                                classes="sm:w-[18rem]"
                            />
                            <Typography.Text>
                                Min: AED{' '}
                                {formatNumberWithLocalString(limitData?.minDenomination || 0)} and
                                Max: AED{' '}
                                {`${formatNumberWithLocalString(limitData?.maxDenomination) ?? '0'}`}
                            </Typography.Text>
                        </Col>
                    </Flex>
                    <Button
                        htmlType="submit"
                        loading={isSubmitting}
                        type="primary"
                        danger
                        className="mt-4 px-5"
                    >
                        View Bill
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default SalikDetailForm; // Updated export to match the new name
