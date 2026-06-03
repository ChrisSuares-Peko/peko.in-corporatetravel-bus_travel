import { useState } from 'react';

import { Descriptions, Flex, Grid, Image, Result, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Lottie from 'react-lottie';
import { useLocation } from 'react-router-dom';

import paymentSuccess from '@assets/animation/paymentSuccess2.json';
import CustomBreadCrumb from '@components/molecular/breadcrumbs/CustomBreadcrumb';
import email from '@domains/dashboard/Invoice/assets/email.svg';

import { SendEmailModal } from '../components/SendEmailModal';

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: paymentSuccess,
};

const { useBreakpoint } = Grid;

const LinkCreated = () => {
    const location = useLocation();
    const [modalVisible, setModalVisible] = useState(false);
    const screens = useBreakpoint();
    const { paymentLink, Details, paymentLinkForm, paymentLinkPayload } = location.state;

    const createdDate = paymentLinkForm.createdAt.split('T')[0];
    const expires_at = paymentLinkForm.expireyDate.split('T')[0];
    const amount = paymentLinkPayload?.amount || Details?.paymentDetails?.total;
    return (
        <>
            <CustomBreadCrumb />
            <Flex vertical justify="center" align="center" gap={20} className="pgsuccess">
                <Result
                    className="md:w-3/6  p-0"
                    icon={<Lottie options={defaultOptions} height={100} />}
                    status="success"
                    title="Payment Link Created"
                />
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

                    <Descriptions.Item label="Payment ID">
                        {paymentLinkForm.orderId}
                    </Descriptions.Item>

                    <Descriptions.Item label="Customer Name">
                        {paymentLinkForm.customerName}
                    </Descriptions.Item>

                    <Descriptions.Item label="Expiry Date">{expires_at}</Descriptions.Item>
                </Descriptions>
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

                <SendEmailModal
                    open={modalVisible}
                    handleCancel={() => setModalVisible(false)}
                    contactPerson={paymentLinkForm.customerName}
                    amount={amount}
                    link={paymentLink}
                />
            </Flex>
        </>
    );
};
export default LinkCreated;
