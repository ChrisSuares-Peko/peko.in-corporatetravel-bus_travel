/* eslint-disable react/no-unescaped-entities */
import { type FC } from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row, Form, Flex, Typography, Radio } from 'antd';
import { ErrorMessage, Field, FieldArray, Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import { Step6Schema } from '../../../schema/index';
import { Step6Types } from '../../../types/types';
import FormHeader from '../FormHeader';

const { Paragraph } = Typography;
interface StepsProps {
    current: number;
    setCurrent: (key: number) => void;
    btnLoading: boolean;
    handleFormSubmit: (key: number, data: any, save?: boolean) => void;
    step6Data: Step6Types | undefined;
    totalSteps: number;
}

const Step6: FC<StepsProps> = ({
    current,
    setCurrent,
    btnLoading,
    handleFormSubmit,
    step6Data,
    totalSteps,
}) => {
    const initialValues = {
        uboGeneralInfo: step6Data?.uboGeneralInfo || '',
        uboList: step6Data?.uboList || [],
    };
    const handleSave = (values: any) => {
        handleFormSubmit(6, values, true);
    };
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Step6Schema}
            onSubmit={values => {
                console.log('Form Values:', values);
                handleFormSubmit(6, values);
            }}
            enableReinitialize
        >
            {({ handleSubmit, values, setFieldValue, errors }) => {
                console.log(errors);
                return (
                    <Form onFinish={handleSubmit} layout="vertical" className="w-full">
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
                                                                <DeleteOutlined
                                                                    data-testid={`delete-item-${index}`}
                                                                    onClick={() => remove(index)}
                                                                    className={`text-xl absolute right-3 cursor-pointer text-bgOrange2 ${index === 0 ? 'invisible' : ''}`}
                                                                />
                                                            </Row>
                                                        ))}

                                                    {values.uboGeneralInfo === 'yes' &&
                                                        values.uboList.length < 4 && (
                                                            <Button
                                                                className="mt-5"
                                                                onClick={() =>
                                                                    push({
                                                                        uboType: '',
                                                                        name: '',
                                                                        taxIdentificationNumber: '',
                                                                        address: '',
                                                                        countryOfTaxResidence: '',
                                                                    })
                                                                }
                                                                danger
                                                            >
                                                                + Add UBO
                                                            </Button>
                                                        )}
                                                </Flex>
                                            )}
                                        </FieldArray>
                                    )}
                                </Col>
                            </Row>
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
                );
            }}
        </Formik>
    );
};

export default Step6;
