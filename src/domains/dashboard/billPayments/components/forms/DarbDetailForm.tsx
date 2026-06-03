import React from 'react';

import { Button, Col, Flex, Form } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import { useDarbApi } from '../../hooks/darb/useDarbApi';
import useDarbPayment from '../../hooks/darb/useDarbPayment';
import { useFetchLimitApi } from '../../hooks/useFetchLimitApi';
import { darbSchema } from '../../schema/HafilatDarb';

const DarfDetailForm = () => {
    const { limitData } = useFetchLimitApi('darb');
    const { getBalance } = useDarbApi();
    const { handleSubmission } = useDarbPayment();
    return (
        <Formik
            initialValues={{
                plateNumber: '',
                eid: '',
            }}
            validationSchema={darbSchema}
            enableReinitialize
            onSubmit={async values => {
                const flexiKey = limitData?.flexiKey ?? '';
                const maxAmt = limitData?.maxDenomination ?? '';
                const minAmt = limitData?.minDenomination ?? '';
                const typeKey = limitData?.typeKey ?? '';
                const res = await getBalance(values.eid, values.plateNumber, flexiKey);

                if (res !== false) {
                    const postData = {
                        account: values.plateNumber,
                        flexiKey,
                        optional1: res.WalletDetails[0].walletIdentity,
                        optional2: res.WalletDetails[0].customerEN,
                        amount: res.WalletDetails[0].amount,
                        typeKey: Number(typeKey),
                        transactionId: res.TransactionId,
                        minAmt,
                        maxAmt,
                    };
                    handleSubmission(postData);
                }
            }}
            validateOnMount
        >
            {({ handleSubmit, setFieldValue, isSubmitting }) => (
                <Form layout="vertical" onFinish={handleSubmit} className="mt-6">
                    <Flex wrap="wrap" className="flex-col sm:flex-row">
                        <Col className="sm:mr-5">
                            <TextInput
                                label="Traffic Number"
                                name="plateNumber"
                                allowNumbersOnly
                                type="text"
                                isRequired
                                placeholder="Enter Traffic Number"
                                maxLength={30}
                                classes="sm:w-[18rem]"
                            />
                        </Col>
                        <Col className="sm:mr-5">
                            <TextInput
                                label="Emirates ID"
                                name="eid"
                                allowNumbersOnly
                                type="text"
                                isRequired
                                maxLength={15}
                                placeholder="Enter Emirates ID"
                                classes="sm:w-[18rem]"
                            />
                        </Col>
                    </Flex>
                    <Button
                        htmlType="submit"
                        loading={isSubmitting}
                        type="primary"
                        danger
                        className="mt-4 px-5"
                    >
                        View Bill
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default DarfDetailForm;
