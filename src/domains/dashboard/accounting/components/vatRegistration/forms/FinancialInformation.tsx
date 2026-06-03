import type { FC } from 'react';

import { Button, Col, Flex, Form, Row, Typography, message } from 'antd';
import { Formik } from 'formik';

import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
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
                            name="annualRevenue"
                            type="text"
                            label="Annual Revenue"
                            placeholder="Enter Annual Revenue"
                        />
                        <SelectInput
                            name="reportingPeriod"
                            label="Preferred VAT Reporting Period"
                            placeholder="Select Preferred VAT Reporting Period"
                            options={['option1', 'option2']}
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <TextInput
                            name="positionInBusiness"
                            type="text"
                            label="Position in Business"
                            placeholder="Enter Position in Business"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text className="text-base font-medium">
                            Required Documents :
                        </Typography.Text>
                    </Col>
                    <Col xs={24} md={12}>
                        <FileUploadInput name="tradeLicense" label="Copy of Trade License" />
                        <FileUploadInput name="addressProof" label="Proof of Registered Address" />
                    </Col>
                    <Col xs={24} md={12}>
                        <FileUploadInput name="emiratesID" label="Copy of Emirates ID" />
                        <FileUploadInput name="financialStatements" label="Financial Statements" />
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
