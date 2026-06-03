import React, { useState } from 'react';

import { Form, Row, Col, Flex, Select, Typography, Skeleton } from 'antd';
import { Formik } from 'formik';

import InputTextArea from '@components/atomic/inputs/InputTextArea';
import TextInput from '@components/atomic/inputs/TextInput';

import { useFetchAddressApi } from '../../hooks/useFetchAddressApi';
import useForm from '../../hooks/useForm';
import { addressSchema } from '../../schema';
import { AddressField } from '../../types/address';

interface DeliveryDetailsProps {
    formRef: React.MutableRefObject<any>;
    setAddress: (address: AddressField) => void;
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({ formRef, setAddress }) => {
    const { addressOptions, isLoading } = useFetchAddressApi();
    const [selectedAddress, setSelectedAddress] = useState<AddressField>();
    const { handleSubmission, data } = useForm();

    return isLoading ? (
        <Skeleton className="my-4" />
    ) : (
        <Flex vertical className="mt-4 px-2 md:px-0 w-full">
            <Typography.Text className="pb-2">Saved Address</Typography.Text>
            <Select
                showSearch
                allowClear
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={value => setSelectedAddress(JSON.parse(value))}
                options={addressOptions}
            />
            <Formik
                enableReinitialize
                initialValues={{
                    address: selectedAddress?.address ?? '',
                    phoneNumber: selectedAddress?.phoneNumber ?? '',
                    remarks: '',
                    firstName: data?.contactPersonName ?? '',
                    lastName: '',
                    saveThisAddress: false,
                }}
                innerRef={formRef}
                validationSchema={addressSchema}
                onSubmit={values => {
                    handleSubmission(values);
                }}
            >
                <Form layout="vertical" className="mt-5 w-full">
                    <Row gutter={10}>
                        <Col xs={12}>
                            <TextInput
                                name="firstName"
                                label="First name"
                                placeholder="Enter first name"
                                type="text"
                                allowAlphabetsAndSpaceOnly
                                isRequired
                                maxLength={50}
                            />
                        </Col>
                        <Col xs={12}>
                            <TextInput
                                name="lastName"
                                label="Last name"
                                placeholder="Enter last name"
                                type="text"
                                allowAlphabetsAndSpaceOnly
                                maxLength={50}
                            />
                        </Col>
                    </Row>
                    <InputTextArea
                        autoSize={{ minRows: 3 }}
                        name="address"
                        label="Address"
                        placeholder="House no, Building name, Area, Colony"
                        isRequired
                        maxLength={200}
                    />
                    <Row gutter={10}>
                        <Col xs={12}>
                            <TextInput
                                name="phoneNumber"
                                label="Mobile Number"
                                placeholder="Enter mobile number"
                                type="text"
                                allowNumbersOnly
                                maxLength={10}
                                isRequired
                            />
                        </Col>
                        <Col xs={12}>
                            <TextInput
                                name="remarks"
                                label="Remarks"
                                placeholder="Enter remarks"
                                type="text"
                                maxLength={50}
                            />
                        </Col>
                    </Row>
                </Form>
            </Formik>
        </Flex>
    );
};

export default DeliveryDetails;
