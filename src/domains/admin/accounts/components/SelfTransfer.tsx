/* eslint-disable no-nested-ternary */
import React from 'react';

import { Button, Col, Descriptions, Form, Row, Skeleton } from 'antd';
import { Formik } from 'formik';

import PasswordInput from '@components/atomic/inputs/PasswordInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import useSelfTransfer from '../hooks/useSelfTransfer';
import { selfTransferSchema } from '../schema/selfTransfer';
import { transferTypes } from '../utils/data';

const SelfTransfer = () => {
    const { handleSelfTransfer, isLoading, walletDetails } = useSelfTransfer(true);
    return (
        <Row className="mt-5" gutter={[60, 30]}>
            <Col xs={24} sm={12} lg={10} xxl={8}>
                <Formik
                    initialValues={{ amount: '', password: '', type: '' }}
                    onSubmit={(values, { resetForm }) => {
                        handleSelfTransfer(values, resetForm);
                        // resetForm();
                    }}
                    validationSchema={selfTransferSchema(walletDetails?.balance || '0')}
                >
                    {({ handleSubmit }) => (
                        <Form onFinish={handleSubmit} className="w-full " layout="vertical">
                            <SelectInput
                                label="Transfer Type"
                                name="type"
                                placeholder="Select Transfer Type"
                                options={transferTypes}
                            />
                            <TextInput
                                name="amount"
                                label="Amount"
                                placeholder="Enter Amount"
                                type="text"
                                size="large"
                                allowDecimalsOnly
                                maxLength={10}
                            />
                            <PasswordInput
                                label="Password"
                                name="password"
                                placeholder="Enter Password"
                                type="password"
                                size="large"
                            />

                            <Button
                                htmlType="submit"
                                type="primary"
                                danger
                                className="mt-5 "
                                loading={isLoading}
                            >
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Col>
            <Col xs={24} sm={12} lg={14}>
                {isLoading ? (
                    <Skeleton active />
                ) : walletDetails ? (
                    <Descriptions layout="horizontal" column={1} bordered title="Your Account">
                        <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Username">
                            {walletDetails.username}
                        </Descriptions.Item>
                        <Descriptions.Item label="Name" labelStyle={{ fontWeight: 'bold' }}>
                            {walletDetails.companyName}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Wallet Balance"
                            labelStyle={{ fontWeight: 'bold' }}
                        >
                            AED {formatNumberWithLocalString(Number(walletDetails.balance))}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    ''
                )}
            </Col>
        </Row>
    );
};

export default SelfTransfer;
