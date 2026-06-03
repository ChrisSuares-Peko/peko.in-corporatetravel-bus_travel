import type { FC } from 'react';

import { Button, Col, Row, Form, Flex, Radio } from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';
import { Step5Types } from '@src/domains/dashboard/esr/types/types';

import { Step5Schema } from '../../../schema/index';
import FormHeader from '../FormHeader';

interface StepsProps {
    current: number;
    setCurrent: (key: number) => void;
    totalSteps: number;
    btnLoading: boolean;
    handleFormSubmit: (key: number, data: any, save?: boolean) => void;
    step5Data: Step5Types | undefined;
}

interface StepFormValues {
    [key: string]: string | number | boolean | string[];
}

const Step5: FC<StepsProps> = ({
    current,
    setCurrent,
    totalSteps,
    btnLoading,
    handleFormSubmit,
    step5Data,
}) => {
    const handleSave = (values: any) => {
        handleFormSubmit(5, values, true);
    };
    // Initial values for the form
    const initialValues: StepFormValues = {
        isFiledPreviously: step5Data?.isFiledPreviously || '',
        dualLicense: step5Data?.dualLicense || '',
        licenseeName: step5Data?.licenseeName || '',
        commercialLicensePermitNumber: step5Data?.commercialLicensePermitNumber || '',
        licensingAuthority: step5Data?.licensingAuthority || '',
        mainRegulatoryAuthority: step5Data?.mainRegulatoryAuthority || '',
        reportingRelevantActivity: step5Data?.reportingRelevantActivity || '',
        tradeLiscenseNo: step5Data?.tradeLiscenseNo || '',
        licensingAuthorityNoOfbranch: step5Data?.licensingAuthorityNoOfbranch || '',
    };

    return (
        <Formik<StepFormValues>
            initialValues={initialValues}
            validationSchema={Step5Schema}
            validateOnChange
            onSubmit={(values, { setFieldTouched }) => {
                // Mark all fields as touched to trigger validation
                Object.keys(values).forEach(field => {
                    setFieldTouched(field, true);
                });

                handleFormSubmit(5, values);
            }}
            enableReinitialize
        >
            {({ handleSubmit, errors, values, setFieldValue, setFieldTouched }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex
                        vertical
                        className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                    >
                        <FormHeader
                            step={`${current + 1}/${totalSteps}`}
                            title="ESR-Other details"
                        />
                        <Form.Item
                            className="mt-3"
                            label="Have you filed previously or been issued a penalty for failure to file?"
                        >
                            <Radio.Group
                                name="isFiledPreviously"
                                value={values.isFiledPreviously}
                                onChange={e => {
                                    setFieldValue('isFiledPreviously', e.target.value);
                                }}
                            >
                                <Radio value="yes">Yes</Radio>
                                <Radio value="no">No</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <ErrorMessage
                            name="isFiledPreviously"
                            render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                        />
                        {values.isFiledPreviously === 'yes' && (
                            <Row className="mt-3 w-full" gutter={[20, 20]}>
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
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
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
                                {/* Text TextInput: Place of establishment */}
                                <Col xs={24} md={12}>
                                    <TextInput
                                        type="text"
                                        name="reportingRelevantActivity"
                                        placeholder="Enter relevant activity"
                                        label="Are you reporting the Relevant Activity of a branch?"
                                        isRequired
                                        allowAlphabetsOnly
                                    />
                                </Col>

                                <Col xs={24} md={12}>
                                    <TextInput
                                        type="text"
                                        name="tradeLiscenseNo"
                                        label="Trade license no. of Branch"
                                        placeholder="Enter Trade License Number"
                                        isRequired
                                        allowAlphabetsSpaceAndNumbersOnly
                                    />
                                </Col>
                                <Col xs={24} md={12}>
                                    <TextInput
                                        type="text"
                                        name="licensingAuthorityNoOfbranch"
                                        label="Licensing authority name of Branch"
                                        placeholder="Enter Licensing Authority Name Of Branch"
                                        isRequired
                                        allowAlphabetsSpaceAndNumbersOnly
                                    />
                                </Col>
                            </Row>
                        )}
                    </Flex>

                    {/* Navigation section */}
                    <Flex className="justify-start gap-10 mt-8">
                        <Button
                            htmlType="button"
                            className="md:w-32 xs:w-36"
                            onClick={() => setCurrent(current - 1)}
                        >
                            Back
                        </Button>
                        <Button
                            type="default"
                            className="md:w-32 xs:w-36"
                            danger
                            onClick={() => {
                                handleSave(values);
                            }}
                            loading={btnLoading}
                        >
                            Save
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

export default Step5;
