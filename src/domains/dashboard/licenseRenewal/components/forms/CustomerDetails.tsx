import type { FC } from 'react';

import { Button, Form } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import usePayment from '../../hooks/usePayment';
import { customerDetailsSchema } from '../../schema';

interface CustomerDetailsProps {}

const CustomerDetails: FC<CustomerDetailsProps> = () => {
    const { handleSubmission } = usePayment();
    return (
        <Formik
            initialValues={{ customerName: '', emiratesId: '' }}
            onSubmit={values => {
                handleSubmission(values);
            }}
            validationSchema={customerDetailsSchema}
        >
            {({ handleSubmit }) => (
                <Form layout="vertical" onFinish={handleSubmit} className="mt-5 w-100 sm:w-96">
                    <TextInput
                        label="Customer Emirates ID"
                        name="emiratesId"
                        placeholder="Enter Emirates ID"
                        type="text"
                        showToolTip
                        tooltipText="15 Digits Emirates ID without hyphen"
                        isRequired
                        maxLength={15}
                        allowNumbersOnly
                    />

                    <TextInput
                        label="Customer Name"
                        name="customerName"
                        placeholder="Enter Name"
                        type="text"
                        showToolTip
                        tooltipText="Enter Customer Name"
                        isRequired
                        maxLength={50}
                        allowAlphabetsAndSpaceOnly
                    />

                    <Button danger htmlType="submit" type="primary" className="mt-5 px-8">
                        Pay Now
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default CustomerDetails;
