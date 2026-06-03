/* eslint-disable react/no-unescaped-entities */
import type { FC } from 'react';

import { Col, Row, Form, Flex, Typography } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';
import TaxCheckboxInput from '@src/domains/dashboard/accounting/components/taxRegistration/forms/TaxCheckbox';

import FormHeader from './FormHeader';
import { Step7Types } from '../types/types';

interface StepsProps {
    current: number;
    setCurrent: (key: number) => void;
    step7Data: Step7Types | undefined;
    totalSteps: number;
}

interface StepFormValues {
    [key: string]: string | number | boolean | string[];
}

const Step7: FC<StepsProps> = ({ current, setCurrent, step7Data, totalSteps }) => {
    // Initial values for the form
    const initialValues: StepFormValues = {
        contactPersonName: step7Data?.contactPersonName || '',
        designation: step7Data?.designation || '',
        phone: step7Data?.phone || '',
        email: step7Data?.email || '',
        selfDeclaration: step7Data?.selfDeclaration || false,
    };

    return (
        <Formik<StepFormValues>
            initialValues={initialValues}
            onSubmit={values => {
                console.log('Form Values:', values);
            }}
            enableReinitialize
        >
            {({ handleSubmit, values, setFieldValue }) => (
                <Form disabled onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex
                        vertical
                        className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                    >
                        <FormHeader
                            step={`${current + 1}/${totalSteps}`}
                            title="ESR-Designated Contact Person"
                        />
                        <Flex className="flex flex-col gap-3">
                            <Typography.Text>
                                The dedicated contact person can be anyone who has the authority to
                                respond to queries raised by, and provide further documents and
                                other information to, the Regulatory Authority or the National
                                Assessing Authority.
                            </Typography.Text>
                            <Typography.Text strong>
                                Examples of a "Designated Contact Person" include:
                            </Typography.Text>
                            <Typography.Text>
                                The Licensee's General Manager;
                                <br />
                                The Licensee's Director; or
                                <br />
                                The Licensee's Compliance Officer.
                                <br />
                            </Typography.Text>
                        </Flex>
                        <Row className="mt-2 w-full" gutter={[20, 10]}>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="Name"
                                    placeholder="Enter Name"
                                    name="contactPersonName"
                                    type="text"
                                    isRequired
                                    allowAlphabetsOnly
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="Designation"
                                    placeholder="Enter Designation"
                                    name="designation"
                                    type="text"
                                    isRequired
                                    allowAlphabetsOnly
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="Phone"
                                    placeholder="Enter Phone"
                                    name="phone"
                                    type="text"
                                    isRequired
                                    allowNumbersOnly
                                    maxLength={10}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="Email"
                                    placeholder="Enter Email"
                                    name="email"
                                    type="text"
                                    isRequired
                                />
                            </Col>
                            <Col xs={24}>
                                <TaxCheckboxInput name="selfDeclaration" classes="">
                                    {' '}
                                    I verify that I am an authorized representative of this
                                    organization and have the right to provide the required
                                    information{' '}
                                </TaxCheckboxInput>
                            </Col>
                        </Row>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};

export default Step7;
