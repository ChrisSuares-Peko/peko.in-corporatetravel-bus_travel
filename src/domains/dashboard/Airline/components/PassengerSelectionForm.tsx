import React from 'react';

import { Form, Row, Col, Select } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';
import { useAppDispatch } from '@src/hooks/store';

import { ReceiverDetailsSchema } from '../schema/ReceiverDetailsSchema';
import { addCustomerInfo } from '../slices/airlineSlice';

type props = {
    formRef: React.MutableRefObject<any>;
    handleContactSubmit: (values: object) => void;
    phoneCodes: any[];
};

const PassengerSelectionForm = ({ formRef, handleContactSubmit, phoneCodes }: props) => {
    const dispatch = useAppDispatch();
    const handleStoreEmail = (value: any) => {
        const values = {
            phone: '3242344',
            email: value,
        };
        dispatch(addCustomerInfo(values));
    };
    return (
        <Formik
            initialValues={{
                phone: '',
                email: '',
            }}
            validationSchema={ReceiverDetailsSchema}
            innerRef={formRef}
            onSubmit={values => {
                handleContactSubmit(values);
            }}
        >
            {({ handleSubmit, handleChange }) => (
                <Form onFinish={handleSubmit} layout="horizontal">
                    <Row>
                        <Col className="m-0" span={6}>
                            {/* <SelectInput
                                label="Phone"
                                placeholder="Country Code"
                                name="phoneCode"
                               
                                classes="border-r-0"
                                options={phoneCodes ?? []}
                            /> */}
                            <Select
                                showSearch
                                options={phoneCodes ?? []}
                                placeholder="Country Code"
                                defaultValue="+971"
                                onSelect={e => handleChange('phoneCode')(e)}
                                className="border-r-0 mt-11 w-full"
                                filterOption={(input: string, option) =>
                                    (
                                        (option &&
                                            // @ts-ignore
                                            option?.label.toLowerCase()) ??
                                        ''
                                    ).includes(input.toLowerCase())
                                }
                            />
                        </Col>
                        <Col className="m-0" span={18}>
                            <TextInput
                                label=" "
                                classes="border-l-0 w-full "
                                name="phone"
                                placeholder="Mobile Number"
                                type="text"
                                allowNumbersOnly
                                maxLength={10}
                            />
                        </Col>
                        <Col span={24} className="mr-10">
                            <TextInput
                                label="Email ID"
                                name="email"
                                placeholder="Enter email address"
                                type="email"
                                classes="w-full"
                                handleChange={handleStoreEmail}
                                isRequired
                            />
                        </Col>
                    </Row>
                </Form>
            )}
        </Formik>
    );
};

export default PassengerSelectionForm;
