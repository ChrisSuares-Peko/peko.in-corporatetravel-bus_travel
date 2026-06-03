import type { FC } from 'react';

import { Button, Col, Row, Form, Grid, Flex } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import { Step1Schema } from '../../../schema/index';
import { Step1Types } from '../../../types/types';
import FormHeader from '../FormHeader';

const { useBreakpoint } = Grid;

interface StepsProps {
    current: number;
    handleFormSubmit: (key: number, data: any, save?: boolean) => void;
    totalSteps: number;
    btnLoading: boolean;
    step1Data: Step1Types | undefined;
}

interface StepFormValues {
    clientName: string;
    period: string;
}

const Step1: FC<StepsProps> = ({
    current,
    totalSteps,
    btnLoading,
    handleFormSubmit,
    step1Data,
}) => {
    const screens = useBreakpoint();
    const gutterValue: [number, number] = screens.md ? [30, 40] : [5, 10];
    const handleSave = (values: any) => {
        handleFormSubmit(1, values, true);
    };
    // Function to generate initial form values
    const getInitialValues = (): StepFormValues => ({
        clientName: step1Data?.clientName || '',
        period: step1Data?.period || '',
    });

    return (
        <Formik<StepFormValues>
            initialValues={getInitialValues()}
            validationSchema={Step1Schema}
            onSubmit={values => {
                console.log('🚀 ~ values:', values);
                console.log('Form Values:', values);
                handleFormSubmit(1, values);
            }}
            enableReinitialize
        >
            {({ handleSubmit, values }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex
                        vertical
                        className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                    >
                        <FormHeader
                            step={`${current + 1}/${totalSteps}`}
                            title="Business Details:"
                        />

                        <Row className="mt-6 w-full" gutter={gutterValue}>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="1.Client Name"
                                    placeholder="Enter Client Name"
                                    name="clientName"
                                    type="text"
                                    isRequired
                                    allowAlphabetsOnly
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <TextInput
                                    label="2.Period"
                                    placeholder="Enter Period"
                                    name="period"
                                    type="text"
                                    isRequired
                                    allowNumbersOnly
                                />
                            </Col>
                        </Row>
                    </Flex>
                    <Flex className="justify-start gap-10 mt-8">
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

export default Step1;
