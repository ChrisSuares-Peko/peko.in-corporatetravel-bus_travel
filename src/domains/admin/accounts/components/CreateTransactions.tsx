import React, { useState } from 'react';

import { Form } from 'antd';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';

import { showToast } from '@src/slices/apiSlice';

import FormComponent from './FormComponent';
import useCreateTransaction from '../hooks/useCreateTransaction';
import { createTransactionSchema } from '../schema/createTransactionSchema';

const CreateTransactions = () => {
    const dispatch = useDispatch();
    const [searchCorporate, setSearchCorporate] = useState<string>('');
    const [searchOperator, setSearchOperator] = useState<string>('');
    const { corporateData, create, operatorData, isLoading, category } = useCreateTransaction({
        searchCorporate,
        searchOperator,
    });

    return (
        <Formik
            enableReinitialize
            initialValues={{
                corporateId: '',
                corporateName: '',
                rechargeAmount: '',
                accountNo: '',
                service: '',
                merchantCommission: '',
                adminCommission: '',
                serviceType: '',
                transactionId: '',
                orderId: '',
                providerId: '',
                surcharge: '',
                serviceOperatorId: '',
                categoryName: '',
                remarks: '',
            }}
            validationSchema={createTransactionSchema}
            onSubmit={async (values, { resetForm }) => {
                const res: boolean = await create({
                    ...values,
                    corporateName: corporateData?.find(
                        item => item.value.toString() === values.corporateId
                    )?.label!,
                    service: category.find(item => item.id.toString() === values.serviceOperatorId)
                        ?.serviceProvider!,
                    categoryName: category.find(
                        item => item.id.toString() === values.serviceOperatorId
                    )?.serviceCategory!,
                });
                if (res === true) {
                    dispatch(
                        showToast({
                            description: `Transaction created Successfully`,
                            variant: 'success',
                        })
                    );
                    resetForm();
                }
                if (res === false) {
                    dispatch(
                        showToast({
                            description: `Failed to create Transaction`,
                            variant: 'error',
                        })
                    );
                }
            }}
        >
            {({ handleSubmit }) => (
                <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
                    <FormComponent
                        setSearchCorporate={setSearchCorporate}
                        setSearchOperator={setSearchOperator}
                        corporateData={corporateData}
                        operatorData={operatorData}
                        isLoading={isLoading}
                    />
                </Form>
            )}
        </Formik>
    );
};

export default CreateTransactions;
