/* eslint-disable react/no-unescaped-entities */
import { FC } from 'react';

import { Button, Col, Row, Form, Grid, Flex, DatePicker, Typography } from 'antd';
import dayjs from 'dayjs'; // Assuming you're using dayjs for date handling
import { Formik, Field, ErrorMessage } from 'formik';

import FormHeader from '../../FormHeader';

const { useBreakpoint } = Grid;
const { Paragraph, Text } = Typography;

interface StepsProps {
    setCurrent: (key: number) => void;
    setFormSubmitData: React.Dispatch<React.SetStateAction<any>>;
    btnLoading: boolean;
}

interface StepFormValues {
    [key: string]: string | number | boolean | string[];
}

const Step3: FC<StepsProps> = ({ setCurrent, setFormSubmitData, btnLoading }) => {
    const screens = useBreakpoint();
    const value: [number, number] = screens.md ? [30, 40] : [5, 10];

    // Array of questions with label, required status, and name
    const questions = [
        { questionText: 'Start Date', isRequired: true, name: 'startDate' },
        { questionText: 'End Date', isRequired: true, name: 'endDate' },
        // Add more questions as needed...
    ];

    // Initial values for the form
    const initialValues = questions.reduce((acc: { [key: string]: string }, question) => {
        acc[question.name] = '';
        return acc;
    }, {});

    return (
        <Formik<StepFormValues>
            initialValues={initialValues}
            // validationSchema={Stage2Step3Schema}
            onSubmit={values => {
                console.log('Form Values:', values);
                setFormSubmitData((prev: any) => ({
                    ...prev,
                    answers: values,
                    isCompleted: false,
                }));
                setCurrent(3);
            }}
            enableReinitialize
        >
            {({ handleSubmit, values, errors, setFieldValue, touched }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex
                        vertical
                        className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                    >
                        <FormHeader
                            step="3"
                            title="Reportable Period for Economic Substance purposes"
                        />

                        {/* Reportable Period Text */}
                        <Flex className=" flex flex-col gap-6 reportable-period-text">
                            <Paragraph>
                                The Reportable Period is the financial period to which the
                                Notification relates that commenced on or after 1 January 2019. The
                                end of the Reportable Period should correspond to the financial year
                                end of the business, and the period that financial statements (if
                                any) are prepared for. Licensees are required to include the "start"
                                and "end" date of the relevant financial period as illustrated in
                                the following examples:
                            </Paragraph>
                            <Paragraph>
                                <Text strong>
                                    A Licensee has a financial year that corresponds to the
                                    Gregorian calendar year:
                                </Text>
                                <br />
                                Start date: 1 January 2019
                                <br />
                                End date: 31 December 2019
                            </Paragraph>
                            <Paragraph>
                                <Text strong>
                                    A Licensee is incorporated on 1 October 2019 and has a 31 March
                                    2020 financial year end (short period of account):
                                </Text>
                                <br />
                                Start date: 1 October 2019
                                <br />
                                End date: 31 March 2020
                            </Paragraph>
                            <Paragraph>
                                <Text strong>
                                    A Licensee is incorporated on 1 January 2019 and has a 31 March
                                    2020 financial year end (long period of account):
                                </Text>
                                <br />
                                Start date: 1 January 2019
                                <br />
                                End date: 31 March 2020
                            </Paragraph>
                            <Paragraph>
                                <Text strong>
                                    Following the first long period of account, the Licensee's
                                    subsequent Notification would cover the following Reportable
                                    Period:
                                </Text>
                                <br />
                                Start date: 1 April 2020
                                <br />
                                End date: 31 March 2021
                            </Paragraph>
                            <Paragraph>
                                <Text strong>
                                    A Licensee incorporated on 1 July 2018 with a 30 June 2019
                                    financial year end would not be required to submit a
                                    Notification for this period, as the Regulations apply to
                                    financial years commencing on/ or after 1 January 2019. The
                                    first reportable period for such Licensee would be:
                                </Text>
                                <br />
                                Start date: 1 July 2019
                                <br />
                                End date: 30 June 2020
                            </Paragraph>
                            <Paragraph>
                                <Text strong>
                                    The Reportable Period is always the financial period preceding
                                    the financial period in which the Notification is required to be
                                    submitted.
                                </Text>
                            </Paragraph>
                        </Flex>

                        {/* Form Fields */}
                        <Row className="mt-6 w-full" gutter={value}>
                            {questions.map((item, index) => (
                                <Col key={index} xs={24} md={12}>
                                    <Field name={item.name}>
                                        {() => (
                                            <Form.Item
                                                label={item.questionText}
                                                required={item.isRequired}
                                            >
                                                <DatePicker
                                                    value={
                                                        values[item.name]
                                                            ? dayjs(
                                                                  values[item.name] as string,
                                                                  'YYYY-MM-DD'
                                                              )
                                                            : null
                                                    }
                                                    format="YYYY-MM-DD"
                                                    onChange={(date, dateString) =>
                                                        setFieldValue(item.name, dateString)
                                                    }
                                                />
                                            </Form.Item>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name={item.name}
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Flex>

                    {/* Navigation section */}
                    <Flex className="justify-start gap-10 mt-8">
                        <Button
                            htmlType="button"
                            className="md:w-32 xs:w-36"
                            onClick={() => setCurrent(1)}
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

export default Step3;
