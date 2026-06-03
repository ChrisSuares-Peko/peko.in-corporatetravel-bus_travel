import React from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Flex, Typography } from 'antd';
import { FieldArray } from 'formik';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import add from '@domains/dashboard/Invoice/assets/add.svg';
import AddGuideline from '@domains/dashboard/Invoice/components/AddGuideline';
import { useAppSelector } from '@src/hooks/store';

import useGetPaymentlink from '../hooks/useGetPaymentlinkApi';
import useGuidelines from '../hooks/useGuidelines';
import { NotificationDetails, Row } from '../types/guidelineTypes';

type WishListProps = {
    values: NotificationDetails[];
    data: Row[];
    isLoading: boolean;
};

const GuidelineDetails = ({ values, data, isLoading }: WishListProps) => {
    const { Details, invoiceResponse } = useAppSelector(state => state.reducer.invoices);
    const { generatePaymentLink } = useGuidelines();
    const { getPaymentLink } = useGetPaymentlink();
    const navigate = useNavigate();
    const formDetails = JSON.parse(invoiceResponse.recipientDetails);

    const due = JSON.parse(invoiceResponse.invoiceDetails);

    const dateValue = new Date(due.dueDate);
    const date = dateValue.toISOString().slice(0, 19);

    const formPayload = {
        full_name: formDetails.customerName,
        email: formDetails.customerEmail,
        phone_number: `+${formDetails.customerPhone}`,
        amount: invoiceResponse.amount,
        expires_at: date,
        payment_link_image: '',
        notification: 'EML',
    };

    return (
        <Flex vertical>
            <Flex justify="space-between" align="center" className="w-full">
                <Typography.Text className="text-xl font-medium">
                    Invoice Guidelines
                </Typography.Text>
                <FieldArray name="data">
                    {({ push }) =>
                        values.length < 10 && (
                            <Flex className="cursor-pointer" gap={6}>
                                <ReactSVG className="mt-1" src={add} />
                                <Typography.Text
                                    className="font-medium text-bgOrange2"
                                    onClick={() =>
                                        push({
                                            days: '',
                                            sms: false,
                                            email: false,
                                            notification: false,
                                            actionDate: '',
                                            templet: {
                                                email: {
                                                    emailId: '',
                                                    subject: '',
                                                    body: '',
                                                    index: '',
                                                },
                                                sms: {
                                                    mobileNo: '',
                                                    body: '',
                                                    index: '',
                                                },
                                            },

                                            invoiceId: Details?.id,
                                        })
                                    }
                                >
                                    Add another condition
                                </Typography.Text>
                            </Flex>
                        )
                    }
                </FieldArray>
            </Flex>
            <Flex vertical className="w-full mt-5">
                <FieldArray name="data">
                    {({ push, remove }) => (
                        <>
                            {values.map((_, index) => (
                                <Flex key={index} align="center">
                                    <AddGuideline index={index} templateData={data} />
                                    {index > 0 && (
                                        <DeleteOutlined
                                            onClick={() => remove(index)}
                                            className="text-xl text-bgOrange2 pl-3"
                                        />
                                    )}
                                    {index === 0 && (
                                        <DeleteOutlined
                                            onClick={() => remove(index)}
                                            className="text-xl text-bgOrange2 pl-3"
                                            style={{ visibility: 'hidden' }}
                                        />
                                    )}
                                </Flex>
                            ))}
                        </>
                    )}
                </FieldArray>
            </Flex>
            <Flex gap={14}>
                {Details?.paymentMode === 'payment link' ? (
                    <>
                        <Button
                            htmlType="submit"
                            type="primary"
                            className="w-fit mt-8"
                            danger
                            loading={isLoading}
                        >
                            <Typography.Text className="text-white font-medium text-xs ">
                                Generate Payment Link
                            </Typography.Text>
                        </Button>
                        <Typography.Text
                            className="font-medium text-bgOrange2 mt-10 cursor-pointer"
                            onClick={() => {
                                getPaymentLink(formPayload);
                            }}
                        >
                            Skip and Generate Link
                        </Typography.Text>
                    </>
                ) : (
                    <Button
                        htmlType="submit"
                        type="primary"
                        className="w-fit mt-8"
                        danger
                        loading={isLoading}
                    >
                        <Typography.Text className="text-white font-medium text-xs">
                            Add Guideline
                        </Typography.Text>
                    </Button>
                )}
            </Flex>
        </Flex>
    );
};

export default GuidelineDetails;
