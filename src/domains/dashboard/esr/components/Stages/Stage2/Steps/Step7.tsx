/* eslint-disable react/no-unescaped-entities */
import type { FC } from 'react';

import { Button, Col, Row, Form, Grid, Flex, Typography } from 'antd';
import { Formik, Field } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import { Stage2Step7Schema } from '../../../../schema/index';
import FormHeader from '../../FormHeader';

const { useBreakpoint } = Grid;

interface StepsProps {
    setCurrent: (key: number) => void;
    setFormSubmitData: React.Dispatch<React.SetStateAction<any>>;
    btnLoading: boolean;
}

interface StepFormValues {
    [key: string]: string | number | boolean | string[];
}

const Step7: FC<StepsProps> = ({ setCurrent, setFormSubmitData, btnLoading }) => {
    const screens = useBreakpoint();
    const value: [number, number] = screens.md ? [30, 40] : [5, 10];

    // Initial values for the form
    const initialValues: StepFormValues = {
        contactPersonName: '',
        designation: '',
        phone: '',
        email: '',
    };

    return (
        <Formik<StepFormValues>
            initialValues={initialValues}
            validationSchema={Stage2Step7Schema}
            onSubmit={values => {
                console.log('Form Values:', values);
                setFormSubmitData((prev: any) => ({
                    ...prev,
                    answers: values,
                    isCompleted: true,
                }));
                setCurrent(7);
            }}
            enableReinitialize
        >
            {({ handleSubmit, values, setFieldValue }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex
                        vertical
                        className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                    >
                        <FormHeader step="7" title="Declaration" />
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

                        <Row className="mt-6 w-full" gutter={value}>
                            <Col xs={24} md={12}>
                                <Field name="contactPersonName">
                                    {({ field }: any) => (
                                        <Form.Item label="Name" required>
                                            <TextInput
                                                {...field}
                                                placeholder="Enter Name"
                                                isRequired
                                                allowAlphabetsOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>
                            <Col xs={24} md={12}>
                                <Field name="designation">
                                    {({ field }: any) => (
                                        <Form.Item label="Designation" required>
                                            <TextInput
                                                {...field}
                                                placeholder="Enter Designation"
                                                isRequired
                                                allowAlphabetsOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>
                            <Col xs={24} md={12}>
                                <Field name="phone">
                                    {({ field }: any) => (
                                        <Form.Item label="Phone" required>
                                            <TextInput
                                                {...field}
                                                placeholder="Enter Phone"
                                                isRequired
                                                allowNumbersOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>
                            <Col xs={24} md={12}>
                                <Field name="email">
                                    {({ field }: any) => (
                                        <Form.Item label="Email" required>
                                            <TextInput
                                                {...field}
                                                placeholder="Enter Email"
                                                isRequired
                                                allowEmailsOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>
                        </Row>
                    </Flex>

                    {/* Navigation section */}
                    <Flex className="justify-start gap-10 mt-8">
                        <Button
                            htmlType="button"
                            className="md:w-32 xs:w-36"
                            onClick={() => setCurrent(5)}
                            loading={btnLoading}
                        >
                            Back
                        </Button>
                        <Button
                            type="primary"
                            className="md:w-32 xs:w-36"
                            danger
                            htmlType="submit"
                            loading={btnLoading}
                        >
                            Next
                        </Button>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};

export default Step7;
