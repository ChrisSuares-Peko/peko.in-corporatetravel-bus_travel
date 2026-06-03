import type { FC } from 'react';

import { Button, Col, Row, Form, Grid, Flex, Radio } from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

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

const Step1: FC<StepsProps> = ({ setCurrent, setFormSubmitData, btnLoading }) => {
    const screens = useBreakpoint();
    const value: [number, number] = screens.md ? [30, 40] : [5, 10];

    // Initial values for the form
    const initialValues: StepFormValues = {
        fled_penalty: '',
        dualLicense: '',
        licenseeName: '',
        commercialLicensePermitNumber: '',
        licensingAuthority: '',
        mainRegulatoryAuthority: '',
        placeOfEstablishment: '',
        registeredOfficeAddress: '',
        registeredOfficeCity: '',
        registeredOfficeCountry: '',
        legalForm: '',
        vatRegistrationInUAE: '',
    };

    return (
        <Formik<StepFormValues>
            initialValues={initialValues}
            // validationSchema={Stage2Step1Schema}
            validateOnChange
            onSubmit={(values, { setFieldTouched }) => {
                // Mark all fields as touched to trigger validation
                Object.keys(values).forEach(field => {
                    setFieldTouched(field, true);
                });

                // Proceed with the form submission logic
                console.log('Form Values:', values);
                setFormSubmitData((prev: any) => ({
                    ...prev,
                    answers: values,
                    isCompleted: false,
                }));
                setCurrent(1);
            }}
            enableReinitialize
        >
            {({ handleSubmit, errors, values, setFieldValue, setFieldTouched }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex
                        vertical
                        className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                    >
                        <FormHeader step="1" title="Licensee Details" />

                        <Row className="mt-6 w-full" gutter={value}>
                            {/* Radio: Have you fled previously or been issued a penalty for failure to file? */}
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Have you fled previously or been issued a penalty for failure to file?"
                                    required
                                >
                                    <Radio.Group
                                        name="fled_penalty"
                                        // value={values.fled_penalty}
                                        onChange={e => {
                                            setFieldTouched('fled_penalty', true);
                                            setFieldValue('fled_penalty', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="fled_penalty"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            {/* Radio: Did you have a dual license? */}
                            <Col xs={24} md={12}>
                                <Form.Item label="Did you have a dual license?" required>
                                    <Radio.Group
                                        name="dualLicense"
                                        // value={values.dualLicense}
                                        onChange={e => {
                                            setFieldTouched('dualLicense', true);
                                            setFieldValue('dualLicense', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <ErrorMessage
                                    name="dualLicense"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={value}>
                            {/* Text TextInput: Licensee Name */}
                            <Col xs={24} md={12}>
                                <Field name="licenseeName">
                                    {({ field }: any) => (
                                        <Form.Item label="Licensee Name" required>
                                            <TextInput
                                                {...field}
                                                placeholder="Enter Licensee Name"
                                                isRequired
                                                allowAlphabetsOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>

                            {/* Text TextInput: Commercial License/Trade License/Permit No. */}
                            <Col xs={24} md={12}>
                                <Field name="commercialLicensePermitNumber">
                                    {({ field }: any) => (
                                        <Form.Item
                                            label="Commercial License/Trade License/Permit No."
                                            required
                                        >
                                            <TextInput
                                                {...field}
                                                placeholder="Enter License/Permit No."
                                                isRequired
                                                allowAlphabetsAndNumbersOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={value}>
                            {/* Text TextInput: Licensing Authority */}
                            <Col xs={24} md={12}>
                                <Field name="licensingAuthority">
                                    {({ field }: any) => (
                                        <Form.Item label="Licensing Authority" required>
                                            <TextInput
                                                {...field}
                                                placeholder="Enter Licensing Authority"
                                                isRequired
                                                allowAlphabetsOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>

                            {/* Text TextInput: Primary/Main Regulatory Authority */}
                            <Col xs={24} md={12}>
                                <Field name="mainRegulatoryAuthority">
                                    {({ field }: any) => (
                                        <Form.Item
                                            label="Primary/Main Regulatory Authority"
                                            required
                                        >
                                            <TextInput
                                                {...field}
                                                placeholder="Enter Regulatory Authority"
                                                isRequired
                                                allowAlphabetsOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={value}>
                            {/* Text TextInput: Place of establishment */}
                            <Col xs={24} md={12}>
                                <Field name="placeOfEstablishment">
                                    {({ field }: any) => (
                                        <Form.Item label="Place of establishment" required>
                                            <TextInput
                                                {...field}
                                                placeholder="Enter Place of Establishment"
                                                isRequired
                                                allowAlphabetsOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>

                            {/* Text TextInput: Registered office address */}
                            <Col xs={24} md={12}>
                                <Field name="registeredOfficeAddress">
                                    {({ field }: any) => (
                                        <Form.Item label="Registered office address" required>
                                            <TextInput
                                                {...field}
                                                placeholder="Enter Office Address"
                                                isRequired
                                                allowAlphabetsSpaceAndNumbersOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={value}>
                            {/* Text TextInput: Registered office city */}
                            <Col xs={24} md={12}>
                                <Field name="registeredOfficeCity">
                                    {({ field }: any) => (
                                        <Form.Item label="Registered office city" required>
                                            <TextInput
                                                {...field}
                                                placeholder="Enter Office City"
                                                isRequired
                                                allowAlphabetsOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>

                            {/* Text TextInput: Registered office country */}
                            <Col xs={24} md={12}>
                                <Field name="registeredOfficeCountry">
                                    {({ field }: any) => (
                                        <Form.Item label="Registered office country" required>
                                            <TextInput
                                                {...field}
                                                placeholder="Enter Office Country"
                                                isRequired
                                                allowAlphabetsOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={value}>
                            <Col xs={24} md={12}>
                                <Field name="legalForm">
                                    {({ field }: any) => (
                                        <Form.Item label="Legal Form" required>
                                            <TextInput
                                                {...field}
                                                placeholder="Enter Legal Form"
                                                isRequired
                                                allowAlphabetsOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Is the license registered for VAT in the UAT?"
                                    required
                                >
                                    <Radio.Group
                                        name="vatRegistrationInUAE"
                                        value={values.vatRegistrationInUAE}
                                        onChange={e => {
                                            setFieldTouched('vatRegistrationInUAE', true);
                                            setFieldValue('vatRegistrationInUAE', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="vatRegistrationInUAE"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                    </Flex>

                    {/* Navigation section */}
                    <Flex className="justify-start gap-10 mt-8">
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

export default Step1;
