import { useState } from 'react';

import { Button, Col, Flex, Form, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { Formik } from 'formik';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextAreaInput from '@components/atomic/inputs/TextAreaInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomBreadCrumb from '@components/molecular/breadcrumbs/CustomBreadcrumb';

import useCreatePaymentLink from '../hooks/useCreatePaymentLink';
import useGetCorporate from '../hooks/useGetCorporate';
import useGetServiceOperators from '../hooks/useGetServiceOperators';
import { paymentLinkSchema } from '../schema';

const CreateLinkPage = () => {
    const [searchCorporate, setSearchCorporate] = useState<string>('');
    const [searchService, setSearchService] = useState<string>('');
    const { corporateList } = useGetCorporate(searchCorporate);
    const { serviceData } = useGetServiceOperators(searchService);
    const { createPaymentLink, loading } = useCreatePaymentLink();

    const tomorrow = dayjs().add(1, 'day');

    const handleClick = (values: any) => {
        const updatedValues = {
            ...values,
            total: {
                value: Number(values.amount),
                currencyCode: values.currency,
            },
        };
        delete updatedValues.amount;
        delete updatedValues.currency;
        createPaymentLink(updatedValues);
    };

    return (
        <>
            <CustomBreadCrumb />
            <Row className="w-full mt-10 xs:px-0 md:px-8">
                <Flex className="w-full" wrap="wrap" justify="space-between">
                    <Typography.Text className="text-xl text-valueText">
                        Create Payment Link
                    </Typography.Text>
                </Flex>
                <Col className="mt-4" xs={24} md={8}>
                    <Flex className="w-full my-5" wrap="wrap" justify="space-between">
                        <Typography.Text className="text-xl text-valueText">
                            Biller Details:
                        </Typography.Text>
                    </Flex>
                    <Formik
                        initialValues={{
                            corporate: '',
                            service: '',
                            transactionType: '',
                            emailSubject: '',
                            message: '',
                            amount: '',
                            currency: 'AED',
                            expiryDate: '',
                            paymentAttempts: '',
                        }}
                        onSubmit={handleClick}
                        validationSchema={paymentLinkSchema}
                    >
                        {({ handleSubmit, setFieldValue }) => (
                            <Form onFinish={handleSubmit} layout="vertical">
                                <Flex vertical className="">
                                    <SelectInputWithSearch
                                        options={(corporateList || []).map(d => ({
                                            value: d.value,
                                            label: d.label,
                                        }))}
                                        label="Corporate"
                                        name="corporate"
                                        placeholder="Select Corporate"
                                        classes=""
                                        isRequired
                                        handleChange={setSearchCorporate}
                                    />
                                </Flex>
                                <Flex vertical className="">
                                    <SelectInputWithSearch
                                        options={(serviceData || []).map(d => ({
                                            value: d.value,
                                            label: d.label,
                                        }))}
                                        label="Service"
                                        name="service"
                                        placeholder="Select Service"
                                        classes=""
                                        isRequired
                                        handleChange={setSearchService}
                                    />
                                </Flex>
                                <Flex vertical className="">
                                    <SelectInput
                                        options={[
                                            { label: 'Purchase', value: 'PURCHASE' },
                                            { label: 'Sale', value: 'SALE' },
                                        ]}
                                        label="Transaction Type"
                                        name="transactionType"
                                        placeholder="Select Transaction Type"
                                        classes=""
                                        isRequired
                                    />
                                </Flex>
                                <Flex vertical className="">
                                    <TextInput
                                        name="emailSubject"
                                        type="text"
                                        label="Email Subject"
                                        placeholder="Enter Subject"
                                        classes=""
                                        isRequired
                                        maxLength={255}
                                    />
                                </Flex>
                                <Flex vertical className="">
                                    <TextAreaInput
                                        name="message"
                                        label="Message"
                                        placeholder="Enter Message"
                                        isRequired
                                    />
                                </Flex>
                                <Flex vertical className="">
                                    <TextInput
                                        name="amount"
                                        type="text"
                                        label="Amount"
                                        placeholder="Enter Amount"
                                        classes=""
                                        isRequired
                                        allowDecimalsOnly
                                        maxLength={15}
                                    />
                                </Flex>
                                <Flex vertical className="">
                                    <TextInput
                                        name="currency"
                                        type="text"
                                        label="Currency"
                                        placeholder="Enter Currency"
                                        classes=""
                                        isRequired
                                        isDisabled
                                        allowAlphabetsOnly
                                        maxLength={15}
                                    />
                                </Flex>
                                <Flex vertical className="">
                                    <DatePickerInput
                                        placeholder="Expiry date"
                                        isRequired
                                        name="expiryDate"
                                        label="Expiry Date"
                                        needConfirm={false}
                                        classes="w-full"
                                        minDate={tomorrow}
                                    />
                                </Flex>
                                <Flex vertical className="">
                                    <SelectInput
                                        name="paymentAttempts"
                                        options={[
                                            { label: '1', value: '1' },
                                            { label: '2', value: '2' },
                                            { label: '3', value: '3' },
                                            { label: '4', value: '4' },
                                            { label: '5', value: '5' },
                                        ]}
                                        label="Payment Attempts"
                                        placeholder="Select Payment Attempts"
                                        classes=""
                                    />
                                </Flex>
                                <Flex gap={10} className="mt-5">
                                    <Button
                                        type="primary"
                                        danger
                                        htmlType="submit"
                                        loading={loading}
                                    >
                                        Submit
                                    </Button>
                                </Flex>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </>
    );
};

export default CreateLinkPage;
