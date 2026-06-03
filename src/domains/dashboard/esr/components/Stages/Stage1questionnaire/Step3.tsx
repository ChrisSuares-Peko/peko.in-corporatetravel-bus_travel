import type { FC } from 'react';

import { Button, Col, Row, Form, Grid, Flex } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import { Step3Schema } from '../../../schema/index';
import { Step3Types } from '../../../types/types';
import FormHeader from '../FormHeader';

const { useBreakpoint } = Grid;

interface StepsProps {
    current: number;
    setCurrent: (key: number) => void;
    totalSteps: number;
    btnLoading: boolean;
    handleFormSubmit: (key: number, data: any, save?: boolean) => void;
    step3Data: Step3Types | undefined;
    fisicalYear: number;
}

interface StepFormValues {
    numberOfEmployees: string;
    outsourcedActivity: string;
    serviceProviderFee: string;
    serviceProviderLocation: string;
    minutesOfBODMeeting: string;
    numberOfBODMeetingsUAE: string;
    totalExpenditureinPrevFY: string;
    qualificationOfEmployees: string;
    numberOfBODMeetingsinPrevFY: string;
}

const Step3: FC<StepsProps> = ({
    current,
    setCurrent,
    totalSteps,
    btnLoading,
    handleFormSubmit,
    step3Data,
    fisicalYear,
}) => {
    const screens = useBreakpoint();
    const gutterValue: [number, number] = screens.md ? [30, 40] : [5, 10];
    const handleSave = (values: any) => {
        handleFormSubmit(3, values, true);
    };
    // Function to generate initial form values
    const getInitialValues = (): StepFormValues => ({
        numberOfEmployees: step3Data?.numberOfEmployees || '',
        outsourcedActivity: step3Data?.outsourcedActivity || '',
        serviceProviderFee: step3Data?.serviceProviderFee || '',
        serviceProviderLocation: step3Data?.serviceProviderLocation || '',
        minutesOfBODMeeting: step3Data?.minutesOfBODMeeting || '',
        numberOfBODMeetingsUAE: step3Data?.numberOfBODMeetingsUAE || '',
        qualificationOfEmployees: step3Data?.qualificationOfEmployees || '',
        totalExpenditureinPrevFY: step3Data?.totalExpenditureinPrevFY || '',
        numberOfBODMeetingsinPrevFY: step3Data?.numberOfBODMeetingsinPrevFY || '',
    });

    return (
        <Formik<StepFormValues>
            initialValues={getInitialValues()}
            validationSchema={Step3Schema}
            onSubmit={values => {
                console.log('Form Values:', values);
                handleFormSubmit(3, values);
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
                            title="(ESR-Clause 2, Art 6): Adequacy Test :"
                        />

                        <Row className="mt-6 w-full" gutter={gutterValue}>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="1.Number of employees"
                                    placeholder="Enter Number of employees"
                                    name="numberOfEmployees"
                                    type="text"
                                    isRequired
                                    allowNumbersOnly
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="2.Qualification of employees"
                                    placeholder="Enter Qualification of employees"
                                    name="qualificationOfEmployees"
                                    type="text"
                                    isRequired
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label={`3.Total Expenditure for FY ${fisicalYear - 1}`}
                                    placeholder={`Enter Total Expenditure for FY ${fisicalYear - 1}`}
                                    name="totalExpenditureinPrevFY"
                                    type="text"
                                    isRequired
                                    allowNumbersOnly
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="4.Is any of activity is outsourced?"
                                    placeholder=""
                                    name="outsourcedActivity"
                                    type="text"
                                    isRequired
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={gutterValue}>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="5.If yes, Please mention Service provider's fee"
                                    placeholder="Enter Service provider's fee"
                                    name="serviceProviderFee"
                                    type="text"
                                    isRequired
                                    allowNumbersOnly
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <TextInput
                                    label="6.Service Provider is based in UAE or outside?"
                                    placeholder=""
                                    name="serviceProviderLocation"
                                    type="text"
                                    isRequired
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={gutterValue}>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="7.Minutes of BOD meeting"
                                    placeholder="Enter Minutes of BOD meeting"
                                    name="minutesOfBODMeeting"
                                    type="text"
                                    isRequired
                                    allowAlphabetsOnly
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label={`8.Number of of BOD meeting held in FY ${fisicalYear - 1}`}
                                    placeholder={`Enter Number of of BOD meeting held in FY ${fisicalYear - 1}`}
                                    type="text"
                                    isRequired
                                    name="numberOfBODMeetingsinPrevFY"
                                    allowNumbersOnly
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="9.Number of BOD meetings in UAE"
                                    placeholder="Enter Number of BOD meetings in UAE"
                                    name="numberOfBODMeetingsUAE"
                                    type="text"
                                    isRequired
                                    allowNumbersOnly
                                />
                            </Col>
                        </Row>
                    </Flex>
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

export default Step3;
