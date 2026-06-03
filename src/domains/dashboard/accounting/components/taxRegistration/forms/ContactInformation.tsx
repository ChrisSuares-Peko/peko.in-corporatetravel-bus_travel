import type { FC } from 'react';

import { Button, Col, Flex, Form, Row } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import FormHeader from '../FormHeader';

interface ContactInformationProps {
    current: number;
    setCurrent: (key: number) => void;
}

const ContactInformation: FC<ContactInformationProps> = ({ current, setCurrent }) => (
    <Formik
        initialValues={{
            contactName: '',
            email: '',
            positionInBusiness: '',
            phoneNumber: '',
        }}
        onSubmit={values => {
            setCurrent(current + 1);
        }}
    >
        {({ handleSubmit }) => (
            <Form onFinish={handleSubmit} layout="vertical">
                <FormHeader step="2/3" title="Contact Information :" />
                <Row className="mt-6" gutter={[20, 40]}>
                    <Col xs={24} md={12}>
                        {/* form input fields will here */}
                        <TextInput
                            name="authorizedContactPerson"
                            type="text"
                            label="Authorized Contact Person"
                            placeholder="Enter Authorized Contact Person Name"
                        />
                        <TextInput
                            name="email"
                            type="text"
                            label="Email Address"
                            placeholder="Enter Email Address"
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <TextInput
                            name="positionInCompany"
                            type="text"
                            label="Position in Company"
                            placeholder="Enter Position in Company"
                        />
                        <TextInput
                            name="phoneNumber"
                            type="text"
                            label="Mobile Number"
                            placeholder="Enter Mobile Number"
                        />
                    </Col>
                </Row>

                {/* navigation section */}
                <Flex gap={10} className="mt-8">
                    <Button type="primary" danger htmlType="submit">
                        Next
                    </Button>
                    <Button htmlType="button" onClick={() => setCurrent(current - 1)}>
                        Previous
                    </Button>
                </Flex>
            </Form>
        )}
    </Formik>
);
export default ContactInformation;
