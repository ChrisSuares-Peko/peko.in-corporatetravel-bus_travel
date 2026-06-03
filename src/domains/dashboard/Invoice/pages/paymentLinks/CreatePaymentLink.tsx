import React, { useState } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Form, Row, Typography, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import dayjs from 'dayjs';
import { Formik } from 'formik';

import UAEFlag from '@assets/svg/uaeflag.svg';
import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import useGetPaymentlink from '../../hooks/useGetPaymentlinkApi';
import { paymentLinkSchema } from '../../schema';
import { resetDetails, setpaymentLinkPayload } from '../../slices/InvoicesSlices';
import { getpaymentlinkPayload } from '../../types/paymentlinkType';
import { paymentLinkNotification } from '../../utils/data';

const CreatePaymentLink = () => {
    const dispatch = useAppDispatch();
    const [fileName, setFileName] = useState<string | null>(null);
    const { getPaymentLink, isLoading } = useGetPaymentlink();
    const tomorrow = dayjs().add(1, 'day');

    const handleClick = (values: getpaymentlinkPayload) => {
        dispatch(setpaymentLinkPayload(values));
        dispatch(resetDetails());
        const updatedValues = { ...values };
        if (updatedValues.expires_at) {
            const date = new Date(updatedValues.expires_at);
            updatedValues.expires_at = date.toISOString().slice(0, 19);
        }

        getPaymentLink({ ...updatedValues });
    };

    const maxFileSize = 200; // KB
    const allowedFileTypes = ['image/jpeg', 'image/png'];

    const beforeUpload = (file: RcFile) => {
        const isAllowedFileType = allowedFileTypes.includes(file.type);
        if (!isAllowedFileType) {
            dispatch(
                showToast({
                    description: `Please upload a file in image format.`,
                    variant: 'error',
                })
            );
        }
        const isLtmaxFileSizeKB = file.size / 1024 <= maxFileSize;
        if (!isLtmaxFileSizeKB) {
            dispatch(
                showToast({
                    description: `File size should be smaller than ${maxFileSize} KB`,
                    variant: 'error',
                })
            );
        }
        return isAllowedFileType && isLtmaxFileSizeKB;
    };

    return (
        <Row className="xs:px-0 w-full md:px-8 mt-10">
            <Flex className="w-full" wrap="wrap" justify="space-between">
                <Typography.Text className="text-valueText text-2xl">
                    Create Payment Link
                </Typography.Text>
            </Flex>
            <Col className="mt-4" xs={24} md={8}>
                <Formik
                    initialValues={{
                        full_name: '',
                        phone_number: '',
                        email: '',
                        amount: '',
                        expires_at: '',
                        payment_link_image: '',
                        notification: 'EML',
                    }}
                    onSubmit={handleClick}
                    validationSchema={paymentLinkSchema}
                >
                    {({ handleSubmit, setFieldValue }) => (
                        <Form onFinish={handleSubmit} layout="vertical">
                            <Flex vertical className="">
                                <TextInput
                                    label="Customer Name"
                                    name="full_name"
                                    type="text"
                                    placeholder="Customer Name"
                                    classes=""
                                    isRequired
                                    allowAlphabetsAndSpaceOnly
                                    maxLength={50}
                                />
                            </Flex>
                            <Flex vertical className="">
                                <TextInput
                                    name="phone_number"
                                    type="text"
                                    label="Mobile Number"
                                    placeholder="Mobile Number"
                                    classes=""
                                    isRequired
                                    maxLength={10}
                                    allowNumbersOnly
                                    prefix={
                                        <Flex
                                            align="center"
                                            gap={6}
                                            className="px-1 cursor-not-allowed border-e me-2"
                                        >
                                            <img src={UAEFlag} alt="" />
                                            <p>+971</p>
                                        </Flex>
                                    }
                                />
                            </Flex>
                            <Flex vertical className="">
                                <TextInput
                                    name="email"
                                    type="text"
                                    label="Email ID"
                                    placeholder="Email ID"
                                    classes=""
                                    allowLowerCaseOnly
                                    isRequired
                                    maxLength={50}
                                />
                            </Flex>
                            <Flex vertical className="">
                                <TextInput
                                    name="amount"
                                    type="text"
                                    label="Amount"
                                    placeholder="Amount"
                                    classes=""
                                    isRequired
                                    allowNumbersOnly
                                    maxLength={15}
                                />
                            </Flex>
                            <Flex vertical className="">
                                <DatePickerInput
                                    placeholder="Expiry date"
                                    isRequired
                                    name="expires_at"
                                    label="Expiry Date"
                                    needConfirm={false}
                                    classes="w-full"
                                    minDate={tomorrow}
                                />
                            </Flex>
                            <Flex vertical className="">
                                <SelectInput
                                    name="notification"
                                    label="Notification To"
                                    placeholder="Select notification option"
                                    isRequired
                                    options={paymentLinkNotification}
                                />
                            </Flex>
                            <Flex vertical className="">
                                <Upload
                                    multiple={false}
                                    name="payment_link_image"
                                    maxCount={1}
                                    listType="picture"
                                    className="avatar-uploader custom-upload mt-3"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    customRequest={({ file, onSuccess }: any) => {
                                        if (file) {
                                            setFileName(file.name);
                                            setFieldValue('payment_link_image', file);
                                            dispatch(
                                                showToast({
                                                    description: 'File uploaded successfully',
                                                    variant: 'success',
                                                })
                                            );
                                            onSuccess('ok');
                                        }
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                                {fileName && (
                                    <Typography.Text className="mt-2 text-blue-500 uploaded-file-name">
                                        {fileName}
                                    </Typography.Text>
                                )}
                            </Flex>
                            <Flex gap={10} className="mt-5">
                                <Button type="primary" danger htmlType="submit" loading={isLoading}>
                                    Submit
                                </Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Col>
        </Row>
    );
};

export default CreatePaymentLink;
