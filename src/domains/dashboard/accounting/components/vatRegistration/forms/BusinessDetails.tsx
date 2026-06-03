import type { FC } from 'react';

import { Button, Col, Flex, Form, Row } from 'antd';
import { Formik } from 'formik';

import InputTextArea from '@components/atomic/inputs/InputTextArea';
import TextInput from '@components/atomic/inputs/TextInput';

import FormHeader from '../FormHeader';

interface BusinessDetailsProps {
    current: number;
    setCurrent: (key: number) => void;
}

const BusinessDetails: FC<BusinessDetailsProps> = ({ current, setCurrent }) => (
    <Formik
        initialValues={{
            bussinessName: '',
            legalForm: '',
            licenceNumber: '',
            pincode: '',
        }}
        onSubmit={values => {
            setCurrent(current + 1);
        }}
    >
        {({ handleSubmit }) => (
            <Form onFinish={handleSubmit} layout="vertical">
                <FormHeader step="1/3" title="Business Details:" />
                <Row className="mt-6" gutter={[20, 40]}>
                    <Col xs={24} md={12}>
                        {/* form input fields will here */}
                        <TextInput
                            name="bussinessName"
                            type="text"
                            label="Full Name of Business Entity"
                            placeholder="Enter Business Name"
                        />
                        <TextInput
                            name="legalForm"
                            type="text"
                            label="Legal Form of Business"
                            placeholder="Enter Legal Form of Business"
                            showToolTip
                            tooltipText="(e.g., LLC, Partnership, Sole Proprietorship)"
                        />
                        <InputTextArea
                            size="large"
                            label="Physical Address in the UAE"
                            name="physicalAddress"
                            placeholder="Enter Address"
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <TextInput
                            name="licenceNumber"
                            type="text"
                            label="Trade License Number"
                            placeholder="Enter Trade License Number"
                        />
                        <TextInput
                            name="pincode"
                            type="text"
                            label="Business Activities"
                            placeholder="Enter Pincode"
                        />
                    </Col>
                </Row>

                {/* navigation section */}
                <Flex className="mt-8">
                    <Button type="primary" danger htmlType="submit">
                        Next
                    </Button>
                </Flex>
            </Form>
        )}
    </Formik>
);
export default BusinessDetails;
