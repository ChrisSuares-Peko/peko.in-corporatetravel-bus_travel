import type { FC } from 'react';

import { Button, Checkbox, Col, Flex, Form, Radio, Row, Typography, message } from 'antd';
import { Formik } from 'formik';

import InputTextArea from '@components/atomic/inputs/InputTextArea';
import SelectInput from '@components/atomic/inputs/SelectInput';

interface Step3Props {
    current: number;
    setCurrent: (key: number) => void;
}

const Step3: FC<Step3Props> = ({ current, setCurrent }) => (
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
            message.success('Processing complete!');
        }}
    >
        {({ handleSubmit }) => (
            <Form onFinish={handleSubmit} layout="vertical">
                <Typography.Text className="text-lg font-medium">
                    Accounting and Financial Management
                </Typography.Text>
                <Row className="mt-6" gutter={[20, 40]}>
                    <Col xs={24} md={12}>
                        {/* form input fields will here */}
                        <Flex className="mt-6" gap="middle" vertical>
                            <Typography.Text className="text-sm">
                                Do you have an in-office accountant or accounting team?
                            </Typography.Text>
                            <Flex gap="middle">
                                <Radio>Yes</Radio>
                                <Radio>No</Radio>
                            </Flex>
                        </Flex>
                        <Flex className="mt-6 w-3/5" gap="middle" vertical>
                            <Typography.Text className="text-sm">
                                Which accounting software are you currently using (if any)?
                            </Typography.Text>
                            <SelectInput
                                name="accountingSoftware"
                                placeholder="Select an accounting software"
                                options={['option1', 'option2']}
                            />
                        </Flex>
                        <Flex className="mt-2 mb-4" gap="middle" vertical>
                            <Typography.Text className="text-sm">
                                Do you require assistance with accounting software selection or
                                training?
                            </Typography.Text>
                            <Flex gap="middle">
                                <Radio>Yes</Radio>
                                <Radio>No</Radio>
                            </Flex>
                        </Flex>
                        <Typography.Text className="text-lg font-medium mt-6">
                            Additional Services and Needs
                        </Typography.Text>

                        <Flex className="mt-6" gap="middle" vertical>
                            <Typography.Text className="text-sm">
                                What other financial or accounting services are you interested in?
                            </Typography.Text>
                            <Checkbox>Bookkeeping</Checkbox>
                            <Checkbox>Financial Planning</Checkbox>
                            <Checkbox>Financial Planning</Checkbox>
                        </Flex>
                        <Flex className="mt-6" gap="middle" vertical>
                            <InputTextArea
                                size="large"
                                label="Any specific challenges or areas where you seek advice or support?"
                                name="challenges"
                                placeholder=""
                            />
                        </Flex>
                    </Col>
                </Row>

                {/* navigation section */}
                <Flex gap={10} className="mt-16">
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
export default Step3;
