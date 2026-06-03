import type { FC } from 'react';

import { Button, Col, Row, Form, Radio, Checkbox, Grid, Flex } from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import FormHeader from '../../FormHeader';

const { useBreakpoint } = Grid;

interface Step4Props {
    setCurrent: (key: number) => void;
    setFormSubmitData: React.Dispatch<React.SetStateAction<any>>;
    btnLoading: boolean;
}

interface Step4FormValues {
    relevantActivities: string[];
    relevantActivityReported: string;
    incomeEarned: string;
    incomeTaxOutsideUAE: string;
    regulatoryAuthority: string;
    answeredNoToAll2B: string;
    highRiskIPLicensee: string;
}

const Step4: FC<Step4Props> = ({ setCurrent, setFormSubmitData, btnLoading }) => {
    const screens = useBreakpoint();
    const value: [number, number] = screens.md ? [30, 40] : [5, 10];

    const initialValues: Step4FormValues = {
        relevantActivities: [],
        relevantActivityReported: '',
        incomeEarned: '',
        incomeTaxOutsideUAE: '',
        regulatoryAuthority: '',
        answeredNoToAll2B: '',
        highRiskIPLicensee: '',
    };

    return (
        <Formik<Step4FormValues>
            initialValues={initialValues}
            // validationSchema={Stage2Step4Schema}
            onSubmit={(values, { setFieldTouched }) => {
                // Mark all fields as touched to trigger validation
                Object.keys(values).forEach(field => {
                    setFieldTouched(field, true);
                });
                console.log('Form Values:', values);

                setFormSubmitData((prev: any) => ({
                    ...prev,
                    step4Answers: values,
                    isCompleted: false,
                }));

                setCurrent(4);
            }}
        >
            {({ handleSubmit, values, setFieldValue, setFieldTouched }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex
                        vertical
                        className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                    >
                        <FormHeader step="4" title="Relevant Activities" />
                        <Row className="mt-6 w-full" gutter={value}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Did the Licensee carry on a Relevant Activity (as defined under Article 4 of the Economic Substance Regulations) during the Reportable Period? "
                                    required
                                >
                                    <Radio.Group
                                        name="relevantActivityReported"
                                        onChange={e => {
                                            setFieldTouched('relevantActivityReported', true);
                                            setFieldValue(
                                                'relevantActivityReported',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="relevantActivityReported"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            {/* Checkbox Group */}
                            <Col xs={24} md={12}>
                                <Field name="relevantActivities">
                                    {({ field }: any) => (
                                        <Form.Item
                                            label="Please indicate which Relevant Activity(les) the Licensee carried on during the Reportable Period?"
                                            required
                                        >
                                            <Checkbox.Group
                                                {...field}
                                                value={values.relevantActivities}
                                                onChange={checkedValues =>
                                                    setFieldValue(
                                                        'relevantActivities',
                                                        checkedValues
                                                    )
                                                }
                                            >
                                                <Row>
                                                    <Col span={24}>
                                                        <Checkbox value="banking">
                                                            Banking Business
                                                        </Checkbox>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Checkbox value="insurance">
                                                            Insurance Business
                                                        </Checkbox>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Checkbox value="investment">
                                                            Investment Fund Management Business
                                                        </Checkbox>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Checkbox value="leaseLeasing">
                                                            Lease-Finance Business (Leasing)
                                                        </Checkbox>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Checkbox value="leaseFinancing">
                                                            Lease-Finance Business (Financing)
                                                        </Checkbox>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Checkbox value="headquarters">
                                                            Headquarters Business
                                                        </Checkbox>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Checkbox value="shipping">
                                                            Shipping Business
                                                        </Checkbox>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Checkbox value="holding">
                                                            Holding Company Business
                                                        </Checkbox>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Checkbox value="intellectualProperty">
                                                            Intellectual Property Business
                                                        </Checkbox>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Checkbox value="distribution">
                                                            Distribution and Service Centre Business
                                                            (Distribution)
                                                        </Checkbox>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Checkbox value="serviceCentre">
                                                            Distribution and Service Centre Business
                                                            (Service Centre)
                                                        </Checkbox>
                                                    </Col>
                                                </Row>
                                            </Checkbox.Group>
                                        </Form.Item>
                                    )}
                                </Field>
                                <ErrorMessage
                                    name="relevantActivities"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            {/* Radio Button Group 1 */}
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Did the Licensee earn income from the Relevant Activity during the Reportable Period?"
                                    required
                                >
                                    <Radio.Group
                                        name="incomeEarned"
                                        onChange={e => {
                                            setFieldTouched('incomeEarned', true);
                                            setFieldValue('incomeEarned', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="incomeEarned"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            {/* Radio Button Group 2 */}
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Is the income earned from the Relevant Activity subject to tax outside the UAE?"
                                    required
                                >
                                    <Radio.Group
                                        name="incomeTaxOutsideUAE"
                                        onChange={e =>
                                            setFieldValue('incomeTaxOutsideUAE', e.target.value)
                                        }
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="incomeTaxOutsideUAE"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            {/* TextInput Field */}
                            <Col xs={24} md={12}>
                                <Field name="regulatoryAuthority">
                                    {({ field }: any) => (
                                        <Form.Item label="Regulatory Authority (RA)" required>
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
                            <Col xs={24} md={12}>
                                <Field name="answeredNoToAll2B">
                                    {({ field }: any) => (
                                        <Form.Item
                                            label="Did you answer 'No' to all of the applicable activities in question 2B?"
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
                            <Col xs={24} md={12}>
                                <Field name="highRiskIPLicensee">
                                    {({ field }: any) => (
                                        <Form.Item
                                            label="If you selected 'Intellectual property business' in Question 2A, please confirm if the Licensee is a High Risk IP Licensee?"
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
                    </Flex>

                    {/* Navigation Buttons */}
                    <Flex className="justify-start gap-10 mt-8">
                        <Button
                            htmlType="button"
                            className="md:w-32 xs:w-36"
                            onClick={() => setCurrent(2)}
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

export default Step4;
