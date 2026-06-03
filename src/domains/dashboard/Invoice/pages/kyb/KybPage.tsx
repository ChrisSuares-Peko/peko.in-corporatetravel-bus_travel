import React from 'react';

import { Button, Col, Flex, Form, Skeleton, Typography } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import useKybSubmit from '../../hooks/useKybSubmit';
import { createSupplierSchema } from '../../schema';

const KybPage = () => {
    const { handleCollectorCreateSupplier, isLoading, bankList, userBankData, isPageLoading } =
        useKybSubmit();
    const { kybStatus } = useAppSelector(state => state.reducer.invoices);
    const navigate = useNavigate();
    if (kybStatus === 'DOCUMENT UPLOADED' || kybStatus === 'APPROVED') {
        navigate(`/${paths.invoice.index}`);
        return null;
    }

    return (
        <Flex vertical className="w-full" gap={15}>
            <Skeleton loading={isPageLoading} active>
                <Formik
                    initialValues={{
                        bankId: '',
                        accountHolderName: userBankData ? userBankData.accountHolderName : '',
                        accountNumber: userBankData ? userBankData.accountNumber : '',
                        ibanNumber: userBankData ? userBankData.iban : '',
                        // depositTerms: '',
                        // depositDay: '',
                        // businessName: '',
                        // businessType: '',
                    }}
                    validationSchema={createSupplierSchema}
                    onSubmit={handleCollectorCreateSupplier}
                    enableReinitialize
                >
                    {({ handleSubmit }) => (
                        <Form layout="vertical" onFinish={handleSubmit}>
                            <Typography.Text className="text-lg font-medium">
                                Bank Information
                            </Typography.Text>

                            <Flex className="flex-col sm:flex-row mt-6" gap={40}>
                                <Col className="sm:w-72">
                                    <SelectInput
                                        name="bankId"
                                        label="Bank Name"
                                        placeholder="Select Bank"
                                        classes="sm:w-[18rem]"
                                        isRequired
                                        options={bankList}
                                    />
                                </Col>
                                <Col>
                                    <TextInput
                                        name="accountHolderName"
                                        label="Account holder name"
                                        placeholder="Enter Account holder name"
                                        type="text"
                                        classes="sm:w-[18rem]"
                                        isRequired
                                        allowAlphabetsAndSpaceOnly
                                    />
                                </Col>
                            </Flex>
                            <Flex className="flex-col sm:flex-row" gap={40}>
                                <Col>
                                    <TextInput
                                        name="accountNumber"
                                        label="Account Number"
                                        placeholder="Enter Account Number"
                                        type="text"
                                        classes="sm:w-[18rem]"
                                        isRequired
                                        allowNumbersOnly
                                    />
                                </Col>
                                <Col>
                                    <TextInput
                                        name="ibanNumber"
                                        label="IBAN Number"
                                        placeholder="Enter IBAN Number"
                                        type="text"
                                        classes="sm:w-[18rem]"
                                        isRequired
                                        allowAlphabetsAndNumbersOnly
                                    />
                                </Col>
                            </Flex>

                            <Button
                                htmlType="submit"
                                loading={isLoading}
                                type="primary"
                                danger
                                className="mt-4 px-8"
                            >
                                Next
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Skeleton>
        </Flex>
    );
};

export default KybPage;
