import type { FC } from 'react';

import { Button, Col, Flex, Form, Row, Typography, message } from 'antd';
import { Formik } from 'formik';

import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import TextInput from '@components/atomic/inputs/TextInput';

import FormHeader from '../FormHeader';

interface FinancialInformationProps {
    current: number;
    setCurrent: (key: number) => void;
}

const FinancialInformation: FC<FinancialInformationProps> = ({ current, setCurrent }) => (
    <Formik
        initialValues={{
            annualRevenue: '',
            reportingPeriod: '',
            positionInBusiness: '',
            phoneNumber: '',
            tradeLicense: '',
            addressProof: '',
            emiratesID: '',
            financialStatements: '',
        }}
        onSubmit={values => {
            message.success('Processing complete!');
        }}
    >
        {({ handleSubmit }) => (
            <Form onFinish={handleSubmit} layout="vertical">
                <FormHeader step="3/3" title="Financial Information :" />
                {/* form input fields will here */}
                <Row className="mt-6" gutter={[20, 20]}>
                    <Col xs={24} md={12}>
                        {/* form input fields will here */}
                        <TextInput
                            name="financialYearEnd"
                            type="text"
                            label="Financial Year End"
                            placeholder="Enter Financial Year End"
                        />
                        <TextInput
                            name="bankAccountDetails"
                            type="text"
                            label="Bank Account Details"
                            placeholder="Enter Bank Account Details"
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <TextInput
                            name="annualTurnover"
                            type="text"
                            label="Annual Turnover (in AED)"
                            placeholder="Enter Annual Turnover (in AED)"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text className="text-base font-medium">
                            Required Documents :
                        </Typography.Text>
                    </Col>
                    <Col xs={24} md={12}>
                        <FileUploadInput name="tradeLicense" label="Copy of Trade License" />
                        <FileUploadInput name="emiratesID" label="Copy of Emirates ID" />
                        <FileUploadInput name="financialStatements" label="Financial Statements" />
                    </Col>
                    <Col xs={24} md={12}>
                        <FileUploadInput
                            name="memorandumOfAssociation"
                            label="Memorandum /Articles of Association"
                        />
                        <FileUploadInput name="addressProof" label="Proof of Registered Address" />
                    </Col>
                </Row>

                {/* navigation section */}
                <Flex gap={10} className="mt-8">
                    <Button type="primary" danger htmlType="submit">
                        Submit
                    </Button>
                    <Button htmlType="button" onClick={() => setCurrent(current - 1)}>
                        Previous
                    </Button>
                </Flex>
            </Form>
        )}
    </Formik>
);
export default FinancialInformation;
