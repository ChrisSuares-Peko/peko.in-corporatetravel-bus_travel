import React, { useState } from 'react';

import { Descriptions, Flex, Grid, Image, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useDispatch } from 'react-redux';

import email from '@domains/dashboard/Invoice/assets/email.svg';
import { useAppSelector } from '@src/hooks/store';

import { SendEmailModal } from './SendEmailModal';
import '../assets/style.css';

const { useBreakpoint } = Grid;

const PaymentTable = () => {
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const screens = useBreakpoint();
    const { paymentLink, Details, paymentLinkForm, paymentLinkPayload } = useAppSelector(
        store => store.reducer.invoices
    );

    const createdDate = paymentLinkForm.createdAt.split('T')[0];
    const expires_at = paymentLinkForm.expires_at.split('T')[0];
    const amount = paymentLinkPayload?.amount || Details?.paymentDetails?.total;

    return (
        <>
            {screens.xxl ? (
                <Content className="border rounded-md md:w-2/3 h-12">
                    <Flex className="mt-3 ml-0 lg:ml-10">
                        <Typography.Text>Payment Link:</Typography.Text>

                        <Typography.Paragraph
                            copyable
                            ellipsis
                            className="ml-2 text-red-500 custom-copyable w-96"
                        >
                            {paymentLink}
                        </Typography.Paragraph>
                    </Flex>
                </Content>
            ) : (
                <Content className="border rounded-md xs:w-2/3 xxl:h-12 h-16">
                    <Flex className="mt-3 ml-0 lg:ml-10">
                        <Typography.Text>Payment Link:</Typography.Text>
                        <Typography.Paragraph
                            ellipsis
                            copyable
                            className="ml-2 text-red-500 custom-copyable w-36"
                        >
                            {paymentLink}
                        </Typography.Paragraph>
                    </Flex>
                </Content>
            )}
            <Descriptions bordered size="middle" column={1} className="w-2/3 pg-success-table">
                <Descriptions.Item label="Date:">{createdDate}</Descriptions.Item>

                <Descriptions.Item label="Payment ID">{paymentLinkForm.orderId}</Descriptions.Item>

                <Descriptions.Item label="Customer Name">
                    {paymentLinkForm.customerName}
                </Descriptions.Item>

                <Descriptions.Item label="Expiry Date">{expires_at}</Descriptions.Item>
            </Descriptions>
            {/* {Details?.id && ( */}
            <Flex gap={6} onClick={() => setModalVisible(true)}>
                <Typography.Text className="cursor-pointer">
                    Share link through email
                </Typography.Text>
                <Image
                    src={email}
                    height={45}
                    width={45}
                    preview={false}
                    className="cursor-pointer"
                />
            </Flex>
            {/* )} */}

            <SendEmailModal
                open={modalVisible}
                handleCancel={() => setModalVisible(false)}
                invoiceId={Details?.id}
                invoiceOnly={false}
                amount={amount}
                link={paymentLink}
            />
        </>
    );
};
export default PaymentTable;
