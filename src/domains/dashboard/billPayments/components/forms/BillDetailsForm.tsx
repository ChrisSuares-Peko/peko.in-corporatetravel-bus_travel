import React, { useEffect } from 'react';

import { Button, Flex, Form, Skeleton } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import RenderFormField from './RenderFormField';
import { useGetBillApi } from '../../hooks/useGetBillApi';
import { generateYupSchema } from '../../schema';
import { Beneficiary, BillDetailsInitialValuesType, GetLimitResponse } from '../../types';

interface BillDetailsFormProps {
    limitData: GetLimitResponse;
    isLoading: boolean;
}

const BillDetailsForm = ({ limitData, isLoading }: BillDetailsFormProps) => {
    const navigate = useNavigate();
    const item = useAppSelector(state => state.reducer.billPayment);
    const serviceData = item ? item.vendor : null;

    const { tableData: beneficiaryList } = useAppSelector(state => state.reducer.beneficiary);
    let beneficiary: Beneficiary | null = item ? item.beneficiary : null;
    const formKey: number | null = item ? item.formKey : 0;
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
    if (beneficiary) {
        if (beneficiary.accessKey === accessKeys.darb) {
            initialValues.plateNumber = beneficiary.accountNo;
            initialValues.eid = beneficiary.optional1;
        } else {
            initialValues.accountNumber = beneficiary.accountNo;
            initialValues.accountPin = beneficiary.optional1;
        }
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
            validationSchema={generateYupSchema(
                inputComponents,
                limitData?.minDenomination,
                limitData?.maxDenomination
            )}
        >
            {({ handleSubmit }) => (
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Flex wrap="wrap" className="flex-col sm:flex-row">
                        {isLoading ? (
                            <Skeleton className="mr-10" />
                        ) : (
                            inputComponents?.map(field => (
                                <RenderFormField
                                    key={field.name}
                                    formData={field}
                                    limitData={limitData}
                                />
                            ))
                        )}
                    </Flex>
                    <Button
                        htmlType="submit"
                        loading={isSubmitting}
                        type="primary"
                        danger
                        className="mt-4 px-5"
                    >
                        {serviceData?.btnText || 'View Bill'}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default BillDetailsForm;
