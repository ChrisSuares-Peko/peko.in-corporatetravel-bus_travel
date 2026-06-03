import type { FC } from 'react';

import { Button, Col, Flex, Form, Radio, Row, Typography } from 'antd';
import { Formik } from 'formik';

interface Step2Props {
    current: number;
    setCurrent: (key: number) => void;
}

const Step2: FC<Step2Props> = ({ current, setCurrent }) => (
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
                    <Col xs={24} md={12}>
                        {/* form input fields will here */}
                        <Flex className="mt-6" gap="middle" vertical>
                            <Typography.Text className="text-sm">
                                Are you registered for VAT in the UAE?
                            </Typography.Text>
                            <Flex gap="middle">
                                <Radio>Yes</Radio>
                                <Radio>No</Radio>
                            </Flex>
                        </Flex>
                        <Flex className="mt-8" gap="middle" vertical>
                            <Typography.Text className="text-sm">
                                VAT Registration Number (if applicable):
                            </Typography.Text>
                            <Flex gap="middle">
                                <Radio>Yes</Radio>
                                <Radio>No</Radio>
                            </Flex>
                        </Flex>
                        <Flex className="mt-6" gap="middle" vertical>
                            <Typography.Text className="text-sm">
                                Do you require assistance with VAT registration or compliance?
                            </Typography.Text>
                            <Flex gap="middle">
                                <Radio>Yes</Radio>
                                <Radio>No</Radio>
                            </Flex>
                        </Flex>
                        <Flex className="mt-6" gap="middle" vertical>
                            <Typography.Text className="text-sm">
                                Are you aware of and prepared for the upcoming Corporate Tax in the
                                UAE?
                            </Typography.Text>
                            <Flex gap="middle">
                                <Radio>Yes</Radio>
                                <Radio>No</Radio>
                            </Flex>
                        </Flex>
                        <Flex className="mt-6" gap="middle" vertical>
                            <Typography.Text className="text-sm">
                                Do you require assistance with Corporate Tax planning or compliance?
                            </Typography.Text>
                            <Flex gap="middle">
                                <Radio>Yes</Radio>
                                <Radio>No</Radio>
                            </Flex>
                        </Flex>
                    </Col>
                </Row>

                {/* navigation section */}
                <Flex gap={10} className="mt-16">
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
export default Step2;
