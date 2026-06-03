import type { FC } from 'react';

import { Button, Col, Row, Form, Checkbox, Grid, Flex } from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import { Stage2Step5Schema } from '../../../../schema/index';
import FormHeader from '../../FormHeader';

const { useBreakpoint } = Grid;

interface Step5Props {
    setCurrent: (key: number) => void;
    setFormSubmitData: React.Dispatch<React.SetStateAction<any>>;
    btnLoading: boolean;
}

interface Step5FormValues {
    ConfirmExemptedLicensee: string;
    confirm1A: string;
    confirm1B: string;
    confirm1C: string;
    confirm1D: string;
    confirm1E: string;
}

const Step5: FC<Step5Props> = ({ setCurrent, setFormSubmitData, btnLoading }) => {
    const screens = useBreakpoint();
    const value: [number, number] = screens.md ? [30, 40] : [5, 10];

    const initialValues: Step5FormValues = {
        ConfirmExemptedLicensee: '',
        confirm1A: '',
        confirm1B: '',
        confirm1C: '',
        confirm1D: '',
        confirm1E: '',
    };

    return (
        <Formik<Step5FormValues>
            initialValues={initialValues}
            validationSchema={Stage2Step5Schema}
            onSubmit={(values, { setFieldTouched }) => {
                // Mark all fields as touched to trigger validation
                Object.keys(values).forEach(field => {
                    setFieldTouched(field, true);
                });

                // Handle form submission
                console.log('Form Values:', values);
                setFormSubmitData((prev: any) => ({
                    ...prev,
                    step5Answers: values,
                    isCompleted: false,
                }));
                setCurrent(5);
            }}
        >
            {({ handleSubmit, values, setFieldValue, setTouched }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex
                        vertical
                        className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                    >
                        <FormHeader step="5" title="Exemptions" />
                        <Row className="mt-6 w-full" gutter={value}>
                            <Col xs={24} md={12}>
                                <Field name="ConfirmExemptedLicensee">
                                    {({ field }: any) => (
                                        <Form.Item
                                            label="Please confirm if the Licensee meets the definition of an 'Exempted Licensee'. If so, please select the applicable exemption."
                                            required
                                        >
                                            <TextInput
                                                {...field}
                                                placeholder=""
                                                isRequired
                                                allowAlphabetsOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={value}>
                            <Col span={24}>
                                <Field name="confirm1A">
                                    {({ field }: any) => (
                                        <div>
                                            <Checkbox
                                                value="uae_national_ownership"
                                                checked={field.value.includes(
                                                    'uae_national_ownership'
                                                )}
                                                onChange={e => {
                                                    const newValue = e.target.checked
                                                        ? [...field.value, e.target.value]
                                                        : field.value.filter(
                                                              (v: string) => v !== e.target.value
                                                          );
                                                    setFieldValue('confirm1A', newValue);
                                                    setTouched({ confirm1A: true });
                                                }}
                                            >
                                                1A. Wholly owned by UAE nationals or residents, not
                                                part of a multinational group, and only operates in
                                                the UAE.
                                            </Checkbox>
                                        </div>
                                    )}
                                </Field>
                                <Row className="mt-6 w-full ps-4" gutter={value}>
                                    <ErrorMessage
                                        name="confirm1A"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                    {/* </Col> */}
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Field name="confirm1B">
                                    {({ field }: any) => (
                                        <div>
                                            <Checkbox
                                                value="investment_fund"
                                                checked={field.value.includes('investment_fund')}
                                                onChange={e => {
                                                    const newValue = e.target.checked
                                                        ? [...field.value, e.target.value]
                                                        : field.value.filter(
                                                              (v: string) => v !== e.target.value
                                                          );
                                                    setFieldValue('confirm1B', newValue);
                                                    setTouched({ confirm1B: true });
                                                }}
                                            >
                                                1B. The Licensee is an Investment Fund as defined in
                                                the Regulations.
                                            </Checkbox>
                                        </div>
                                    )}
                                </Field>
                                <Row className="mt-6 w-full ps-4" gutter={value}>
                                    <ErrorMessage
                                        name="confirm1B"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Field name="confirm1C">
                                    {({ field }: any) => (
                                        <div>
                                            <Checkbox
                                                value="spv_investment_fund"
                                                checked={field.value.includes(
                                                    'spv_investment_fund'
                                                )}
                                                onChange={e => {
                                                    const newValue = e.target.checked
                                                        ? [...field.value, e.target.value]
                                                        : field.value.filter(
                                                              (v: string) => v !== e.target.value
                                                          );
                                                    setFieldValue('confirm1C', newValue);
                                                    setTouched({ confirm1C: true });
                                                }}
                                            >
                                                1C. Special purpose vehicle or investment holding
                                                company of an Investment Fund.
                                            </Checkbox>
                                        </div>
                                    )}
                                </Field>
                                <Row className="mt-6 w-full ps-4" gutter={value}>
                                    <ErrorMessage
                                        name="confirm1C"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Field name="confirm1D">
                                    {({ field }: any) => (
                                        <div>
                                            <Checkbox
                                                value="tax_resident_elsewhere"
                                                checked={field.value.includes(
                                                    'tax_resident_elsewhere'
                                                )}
                                                onChange={e => {
                                                    const newValue = e.target.checked
                                                        ? [...field.value, e.target.value]
                                                        : field.value.filter(
                                                              (v: string) => v !== e.target.value
                                                          );
                                                    setFieldValue('confirm1D', newValue);
                                                    setTouched({ confirm1D: true });
                                                }}
                                            >
                                                1D. The Licensee is resident for tax purposes
                                                outside the UAE.
                                            </Checkbox>
                                        </div>
                                    )}
                                </Field>
                                <Row className="mt-6 w-full ps-4" gutter={value}>
                                    <ErrorMessage
                                        name="confirm1D"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Field name="confirm1E">
                                    {({ field }: any) => (
                                        <div>
                                            <Checkbox
                                                value="foreign_branch"
                                                checked={field.value.includes('foreign_branch')}
                                                onChange={e => {
                                                    const newValue = e.target.checked
                                                        ? [...field.value, e.target.value]
                                                        : field.value.filter(
                                                              (v: string) => v !== e.target.value
                                                          );
                                                    setFieldValue('confirm1E', newValue);
                                                }}
                                            >
                                                1E. UAE branch of a foreign company, with all income
                                                subject to tax in the foreign jurisdiction.
                                            </Checkbox>
                                        </div>
                                    )}
                                </Field>
                                <Row className="mt-6 w-full ps-4" gutter={value}>
                                    <ErrorMessage
                                        name="confirm1E"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Row>
                            </Col>
                        </Row>
                    </Flex>

                    {/* Navigation Buttons */}
                    <Flex className="justify-start gap-10 mt-8">
                        <Button
                            htmlType="button"
                            className="md:w-32 xs:w-36"
                            onClick={() => setCurrent(3)}
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

export default Step5;
