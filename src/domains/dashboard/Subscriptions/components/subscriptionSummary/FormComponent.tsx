import React, { useMemo } from 'react';

import { Button, Form } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';

import useForm from '../../hooks/useForm';
import { subscriptionSchema } from '../../schema';

const FormComponent = () => {
    const { handleSubmission } = useForm();

    const { userDetails } = useAppSelector(state => state.reducer.subscription);
    const initialValues = useMemo(
        () => ({
            companyName: userDetails?.userName,
            domainName: '',
            adminEmail: userDetails?.userEmail,
        }),
        [userDetails]
    );
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={subscriptionSchema}
            onSubmit={values => {
                handleSubmission(values);
            }}
        >
            {({ handleSubmit }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="mt-6 w-full md:w-3/4">
                    <TextInput
                        label="Company Name"
                        name="companyName"
                        placeholder="Enter company name"
                        type="text"
                        isRequired
                        maxLength={51}
                    />
                    <TextInput
                        label="Domain Name"
                        name="domainName"
                        placeholder="Enter domain name"
                        type="text"
                        maxLength={51}
                    />

                    <TextInput
                        name="adminEmail"
                        label="Email ID"
                        placeholder="Enter email ID"
                        type="text"
                        isRequired
                        allowLowerCaseOnly
                        maxLength={51}
                    />

                    <Button htmlType="submit" danger type="primary" className="px-10 my-3">
                        Buy Now
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default FormComponent;
