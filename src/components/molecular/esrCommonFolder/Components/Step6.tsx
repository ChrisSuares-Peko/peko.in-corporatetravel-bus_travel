/* eslint-disable react/no-unescaped-entities */
import { type FC } from 'react';

import { Col, Row, Form, Flex, Typography, Radio } from 'antd';
import { ErrorMessage, Field, FieldArray, Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import FormHeader from './FormHeader';
import { Step6Types } from '../types/types';

const { Paragraph } = Typography;
interface StepsProps {
    current: number;
    setCurrent: (key: number) => void;
    step6Data: Step6Types | undefined;
    totalSteps: number;
}

const Step6: FC<StepsProps> = ({ current, setCurrent, step6Data, totalSteps }) => {
    const initialValues = {
        uboGeneralInfo: step6Data?.uboGeneralInfo || '',
        uboList: step6Data?.uboList || [],
    };

    return (
        <Formik disabled initialValues={initialValues} onSubmit={values => {}} enableReinitialize>
            {({ handleSubmit, values, setFieldValue, errors }) => {
                console.log(errors);
                return (
                    <Form disabled onFinish={handleSubmit} layout="vertical" className="w-full">
                        <Flex
                            vertical
                            className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                        >
                            <FormHeader
                                step={`${current + 1}/${totalSteps}`}
                                title="ESR-Ultimate beneficial owner (UBO) information"
                            />
                            <Paragraph className="mt-2">
                                The Ultimate Beneficial Owner of the Licensee is an individual who
                                owns directly or indirectly twenty five percent (25%) or more of the
                                share capital of a Licensee. A Licensee may have one or more
                                Ultimate Beneficial Owners.
                            </Paragraph>
                            <Row className="mt-6 w-full">
                                <Col xs={24}>
                                    <Field name="uboGeneralInfo">
                                        {({ field }: any) => (
                                            <Form.Item
                                                label="Is there an individual who owns directly or indirectly twenty five percent (25%) or more of the share capital of a Licensee?"
                                                required
                                            >
                                                <Radio.Group
                                                    {...field}
                                                    value={values.uboGeneralInfo}
                                                    onChange={e => {
                                                        console.log('🚀 ~ e:', e);
                                                        setFieldValue(
                                                            'uboGeneralInfo',
                                                            e.target.value
                                                        );
                                                        if (e.target.value === 'yes') {
                                                            setFieldValue('uboList', [
                                                                {
                                                                    uboType: '',
                                                                    name: '',
                                                                    taxIdentificationNumber: '',
                                                                    address: '',
                                                                    countryOfTaxResidence: '',
                                                                },
                                                            ]);
                                                        } else {
                                                            setFieldValue('uboList', []);
                                                        }
                                                    }}
                                                >
                                                    <Radio value="yes">Yes</Radio>
                                                    <Radio value="no">No</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="uboGeneralInfo"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Col>

                                {/* Branch details */}
                                <Col xs={24} className="w-full">
                                    {values.uboList.length > 0 && (
                                        <FieldArray name="uboList">
                                            {({ push, remove }) => (
                                                <Flex vertical>
                                                    {values.uboGeneralInfo === 'yes' &&
                                                        values.uboList.map((_, index) => (
                                                            <Row
                                                                key={index}
                                                                gutter={[20, 10]}
                                                                style={{
                                                                    marginLeft: '0 !important',
                                                                    marginRight: '0 !important',
                                                                    marginTop:
                                                                        index > 0 ? '1rem' : 0,
                                                                }}
                                                                className={`relative border-2 border-gray-150 rounded-lg py-4 w-full `}
                                                            >
                                                                <Col xs={24} md={12}>
                                                                    <Field
                                                                        name={`uboList[${index}].uboType`}
                                                                    >
                                                                        {({ field }: any) => (
                                                                            <Form.Item
                                                                                label="UBO Type"
                                                                                required
                                                                            >
                                                                                <TextInput
                                                                                    {...field}
                                                                                    placeholder="Enter UBO Type"
                                                                                    isRequired
                                                                                    allowAlphabetsOnly
                                                                                />
                                                                            </Form.Item>
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage
                                                                        name={`uboList[${index}].uboType`}
                                                                        render={msg => (
                                                                            <div className="text-red-500 -mt-10">
                                                                                {msg}
                                                                            </div>
                                                                        )}
                                                                    />
                                                                </Col>
                                                                <Col xs={24} md={12}>
                                                                    <Field
                                                                        name={`uboList[${index}].name`}
                                                                    >
                                                                        {({ field }: any) => (
                                                                            <Form.Item
                                                                                label="Name"
                                                                                required
                                                                            >
                                                                                <TextInput
                                                                                    {...field}
                                                                                    placeholder="Enter Name"
                                                                                    isRequired
                                                                                    allowAlphabetsOnly
                                                                                />
                                                                            </Form.Item>
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage
                                                                        name={`uboList[${index}].name`}
                                                                        render={msg => (
                                                                            <div className="text-red-500 -mt-10">
                                                                                {msg}
                                                                            </div>
                                                                        )}
                                                                    />
                                                                </Col>
                                                                <Col xs={24} md={12}>
                                                                    <Field
                                                                        name={`uboList[${index}].taxIdentificationNumber`}
                                                                    >
                                                                        {({ field }: any) => (
                                                                            <Form.Item
                                                                                label="Tax Identification Number"
                                                                                required
                                                                            >
                                                                                <TextInput
                                                                                    {...field}
                                                                                    placeholder="Enter Identification Number"
                                                                                    isRequired
                                                                                    allowNumbersOnly
                                                                                />
                                                                            </Form.Item>
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage
                                                                        name={`uboList[${index}].taxIdentificationNumber`}
                                                                        render={msg => (
                                                                            <div className="text-red-500 -mt-10">
                                                                                {msg}
                                                                            </div>
                                                                        )}
                                                                    />
                                                                </Col>
                                                                <Col xs={24} md={12}>
                                                                    <Field
                                                                        name={`uboList[${index}].address`}
                                                                    >
                                                                        {({ field }: any) => (
                                                                            <Form.Item
                                                                                label="Address"
                                                                                required
                                                                            >
                                                                                <TextInput
                                                                                    {...field}
                                                                                    placeholder="Enter Address"
                                                                                    isRequired
                                                                                    allowAlphabetsSpaceAndNumbersOnly
                                                                                />
                                                                            </Form.Item>
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage
                                                                        name={`uboList[${index}].address`}
                                                                        render={msg => (
                                                                            <div className="text-red-500 -mt-10">
                                                                                {msg}
                                                                            </div>
                                                                        )}
                                                                    />
                                                                </Col>
                                                                <Col xs={24} md={12}>
                                                                    <Field
                                                                        name={`uboList[${index}].countryOfTaxResidence`}
                                                                    >
                                                                        {({ field }: any) => (
                                                                            <Form.Item
                                                                                label="Country of Residence"
                                                                                required
                                                                            >
                                                                                <TextInput
                                                                                    {...field}
                                                                                    placeholder="Enter Country of Residence"
                                                                                    isRequired
                                                                                    allowAlphabetsOnly
                                                                                />
                                                                            </Form.Item>
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage
                                                                        name={`uboList[${index}].countryOfTaxResidence`}
                                                                        render={msg => (
                                                                            <div className="text-red-500 -mt-10">
                                                                                {msg}
                                                                            </div>
                                                                        )}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        ))}
                                                </Flex>
                                            )}
                                        </FieldArray>
                                    )}
                                </Col>
                            </Row>
                        </Flex>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default Step6;
