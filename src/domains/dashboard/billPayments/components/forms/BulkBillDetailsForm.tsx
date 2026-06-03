import React, { useEffect } from 'react';

import { Button, Flex, Form, Skeleton } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import RenderFormField from './RenderFormField';
import { useGetBillApi } from '../../hooks/useGetBillApi';
import { generateYupSchema } from '../../schema';
import { Beneficiary, BillDetailsInitialValuesType, GetLimitResponse } from '../../types';

interface EtisalatFormProps {
    limitData: GetLimitResponse;
    isLoading: boolean;
}

const BulkBillDetailsForm = ({ limitData, isLoading }: EtisalatFormProps) => {
    const navigate = useNavigate();
    const item = useAppSelector(state => state.reducer.billPayment);
    const serviceData = item.vendor ? item.vendor : null;
    const beneficiary: Beneficiary | null = item.beneficiary ? item.beneficiary : null;
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
        initialValues.accountNumber = beneficiary.accountNo;
        initialValues.accountPin = beneficiary.optional1;
    }
    return (
        <Formik
            key={formKey}
            initialValues={initialValues}
            enableReinitialize
            onSubmit={values => {
                getBillLimit({
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
                        View Bill
                    </Button>
                </Form>
            )}
        </Formik>
    );
};
export default BulkBillDetailsForm;
