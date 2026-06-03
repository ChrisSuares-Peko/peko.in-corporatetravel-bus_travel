import React from 'react';

import { Button, Form } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import useForm from '../hooks/useForm';
import { workInformationSchema } from '../schema';

type Props = {
    planId: string | undefined;
    workId: number | undefined;
    price: string | undefined;
    planName: string | undefined;
};

const FormComponent = ({ planId, workId, price, planName }: Props) => {
    const { handleSubmission } = useForm();

    const initialValues = {
        pocName: '',
        email: '',
        requirement: '',
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={workInformationSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmission({ ...values, planId, workId, price, planName }).finally(() => {
                    setSubmitting(false);
                });
            }}
        >
            {({ handleSubmit, isSubmitting }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="mt-6 w-full md:w-3/4">
                    <TextInput
                        label="POC Name"
                        name="pocName"
                        placeholder="Enter POC Name"
                        type="text"
                        isRequired
                        allowAlphabetsAndSpaceOnly
                        maxLength={50}
                    />
                    <TextInput
                        name="email"
                        label="Email ID"
                        placeholder="Enter Email ID"
                        type="text"
                        isRequired
                        allowLowerCaseOnly
                        maxLength={50}
                    />
                    <TextInput
                        label="Write About Requirement"
                        name="requirement"
                        placeholder="Enter requirement"
                        type="text"
                        isRequired
                        maxLength={50}
                    />

                    <Button
                        htmlType="submit"
                        danger
                        type="primary"
                        className="px-10 my-3"
                        loading={isSubmitting}
                    >
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default FormComponent;
