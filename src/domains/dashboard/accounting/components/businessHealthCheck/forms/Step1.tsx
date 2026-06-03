import type { FC } from 'react';

import { Button, Col, Flex, Form, Row, Typography } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

interface Step1Props {
    current: number;
    setCurrent: (key: number) => void;
}

const Step1: FC<Step1Props> = ({ current, setCurrent }) => (
    <Formik
        initialValues={{
            bussinessName: '',
            contactPerson: '',
            email: '',
            phoneNumber: '',
            industry: '',
            numberOfEmployees: '',
        }}
        onSubmit={values => {
            setCurrent(current + 1);
        }}
    >
        {({ handleSubmit }) => (
            <Form onFinish={handleSubmit} layout="vertical">
                <Typography.Text className="text-lg font-medium">
                    General Business Information
                </Typography.Text>
                <Row className="mt-6" gutter={[20, 40]}>
                    <Col span={6}>
                        {/* form input fields will here */}
                        <TextInput
                            name="businessName"
                            type="text"
                            label="Business Name"
                            placeholder="Enter Business Name"
                            showToolTip
                            tooltipText="Enter Business Name"
                        />
                        <TextInput
                            name="contactPerson"
                            type="text"
                            label="Contact Person"
                            placeholder="Enter Contact Person Name"
                            showToolTip
                            tooltipText="Enter Contact Person Name"
                        />
                        <TextInput
                            name="email"
                            type="text"
                            label="Email Address"
                            placeholder="Enter Email Address"
                            showToolTip
                            tooltipText="Enter Email Address"
                        />
                        <TextInput
                            name="phoneNumber"
                            type="text"
                            label="Mobile Number"
                            placeholder="Enter Mobile Number"
                            showToolTip
                            tooltipText="Enter Mobile Number"
                        />
                        <TextInput
                            name="industry"
                            type="text"
                            label="Industry/Field"
                            placeholder="Enter Industry/Field"
                            showToolTip
                            tooltipText="Enter Industry/Field"
                        />
                        <TextInput
                            name="numberOfEmployees"
                            type="text"
                            label="Number of Employees"
                            placeholder="Enter Number of Employees"
                            showToolTip
                            tooltipText="Enter Number of Employees"
                        />
                    </Col>
                </Row>

                {/* navigation section */}
                <Flex className="mt-4">
                    <Button type="primary" danger htmlType="submit">
                        Next
                    </Button>
                </Flex>
            </Form>
        )}
    </Formik>
);
export default Step1;
