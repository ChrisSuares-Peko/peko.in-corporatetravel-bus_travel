import type { FC } from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row, Form, Grid, Flex, Typography } from 'antd';
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import FormHeader from '../../FormHeader';

const { useBreakpoint } = Grid;

interface StepsProps {
    setCurrent: (key: number) => void;
    setFormSubmitData: React.Dispatch<React.SetStateAction<any>>;
    btnLoading: boolean;
}

interface BranchDetails {
    commercialLicensePermitNumber: string;
    licensingAuthority: string;
}

interface StepFormValues {
    reportingRelevantActivity: string;
    branchDetails: BranchDetails[];
}

const Step2: FC<StepsProps> = ({ setCurrent, setFormSubmitData, btnLoading }) => {
    const screens = useBreakpoint();
    const value: [number, number] = screens.md ? [30, 40] : [5, 10];

    const initialValues: StepFormValues = {
        reportingRelevantActivity: '',
        branchDetails: [{ commercialLicensePermitNumber: '', licensingAuthority: '' }],
    };

    return (
        <Formik<StepFormValues>
            initialValues={initialValues}
            // validationSchema={Stage2Step2Schema}
            onSubmit={values => {
                console.log('Form Values:', values);

                setFormSubmitData((prev: any) => ({
                    ...prev,
                    answers: values,
                    isCompleted: false,
                }));

                setCurrent(2);
            }}
            enableReinitialize
        >
            {({ handleSubmit, values, setFieldValue }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex
                        vertical
                        className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                    >
                        <FormHeader step="2" title="Branch Details Form" />

                        <Row className="mt-6 w-full ps-4" gutter={value}>
                            {/* Question 1: Relevant Activity */}
                            <Col xs={24}>
                                <Field name="reportingRelevantActivity">
                                    {({ field }: any) => (
                                        <Form.Item
                                            label="Are you reporting the Relevant Activity of a branch?"
                                            required
                                        >
                                            <TextInput
                                                {...field}
                                                placeholder="Enter relevant activity"
                                                isRequired
                                                allowAlphabetsOnly
                                            />
                                        </Form.Item>
                                    )}
                                </Field>
                            </Col>
                        </Row>
                        <Row className="mt-3 w-full ps-4" gutter={value}>
                            {/* Dynamic Branch Details */}
                            <FieldArray name="branchDetails">
                                {({ push, remove }) => (
                                    <>
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                            className="w-full"
                                        >
                                            <Typography.Text className="xs:text-sm md:text-lg font-medium">
                                                Enter the items you wish to bill:
                                            </Typography.Text>
                                            {/* Add New Branch Button */}
                                            {values.branchDetails.length < 10 && (
                                                <Button
                                                    danger
                                                    onClick={() =>
                                                        push({
                                                            commercialLicensePermitNumber: '',
                                                            licensingAuthority: '',
                                                        })
                                                    }
                                                >
                                                    Add New Branch Details
                                                </Button>
                                            )}
                                        </Flex>

                                        {values.branchDetails.map((branch, index) => (
                                            <Flex
                                                key={index}
                                                vertical
                                                className="border rounded  mb-2 w-full"
                                            >
                                                <Row className="mt-6 w-full ps-4" gutter={value}>
                                                    {/* Branch Number */}
                                                    <Col xs={24}>
                                                        <h4>Branch {index + 1}</h4>
                                                    </Col>

                                                    {/* License Number */}
                                                    <Col xs={24} md={12}>
                                                        <Field
                                                            name={`branchDetails.${index}.commercialLicensePermitNumber`}
                                                        >
                                                            {({ field }: any) => (
                                                                <Form.Item
                                                                    label="Commercial Licence/Trade License/Permit No."
                                                                    required
                                                                >
                                                                    <TextInput
                                                                        {...field}
                                                                        placeholder="Enter license number"
                                                                        isRequired
                                                                        allowNumbersOnly
                                                                    />
                                                                </Form.Item>
                                                            )}
                                                        </Field>
                                                        <ErrorMessage
                                                            name={`branchDetails.${index}.commercialLicensePermitNumber`}
                                                            render={msg => (
                                                                <div className="text-red-500 -mt-5">
                                                                    {msg}
                                                                </div>
                                                            )}
                                                        />
                                                    </Col>
                                                    {/* Licensing Authority */}
                                                    <Col xs={24} md={12}>
                                                        <Field
                                                            name={`branchDetails.${index}.licensingAuthority`}
                                                        >
                                                            {({ field }: any) => (
                                                                <Form.Item
                                                                    label="Licensing Authority"
                                                                    required
                                                                >
                                                                    <TextInput
                                                                        {...field}
                                                                        placeholder="Enter licensing authority"
                                                                        isRequired
                                                                        allowAlphabetsOnly
                                                                    />
                                                                </Form.Item>
                                                            )}
                                                        </Field>
                                                        <ErrorMessage
                                                            name={`branchDetails.${index}.licensingAuthority`}
                                                            render={msg => (
                                                                <div className="text-red-500 -mt-5">
                                                                    {msg}
                                                                </div>
                                                            )}
                                                        />
                                                    </Col>
                                                </Row>
                                                <DeleteOutlined
                                                    data-testid={`delete-item-${index}`}
                                                    onClick={() => remove(index)}
                                                    className={`text-xl text-bgOrange2 pl-3 ${index === 0 ? 'invisible' : ''}`}
                                                />
                                            </Flex>
                                        ))}
                                    </>
                                )}
                            </FieldArray>
                        </Row>
                    </Flex>

                    {/* Navigation section */}
                    <Flex className="justify-start gap-10 mt-8">
                        <Button
                            htmlType="button"
                            className="md:w-32 xs:w-36"
                            onClick={() => setCurrent(0)}
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

export default Step2;
