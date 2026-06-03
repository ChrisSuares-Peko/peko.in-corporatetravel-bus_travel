import React from 'react';

import { Card, Flex, Typography, Table, Divider, Image, Row, Col, ConfigProvider } from 'antd';

import { columns } from '../utils/data';

const TrackerDetailsCard = ({
    data,
    // componentRef,
    dataSource,
}: {
    data: any;
    // componentRef: any;
    dataSource: any[];
}) => {
    const themeConfig = {
        components: {
            Table: {
                headerBg: '#454444',
                headerColor: '#FFFFFF',
            },
        },
    };
    const comments = data?.comments?.replace(/"/g, '');
    return (
        <Flex vertical gap={5} className="w-full ">
            <Card
                // ref={componentRef}
                className="border border-gray-300  rounded-md mt-6 "
            >
                <Row gutter={[20, 20]} className="w-full" align="top">
                    <Col span={24} className="w-full">
                        <Flex
                            justify={`${data?.invoiceDetails.logo ? 'space-between' : 'end'}`}
                            align="center"
                            className="w-full"
                        >
                            {data?.invoiceDetails.logo && (
                                <Image
                                    src={data?.invoiceDetails && data?.invoiceDetails.logo}
                                    preview={false}
                                    height={80}
                                    width={80}
                                />
                            )}
                            <Typography.Text className="xs:text-lg md:text-3xl font-medium">
                                {data?.invoiceDetails.invoiceName}
                            </Typography.Text>
                        </Flex>
                    </Col>

                    <Col span={14} className="flex justify-between align-top self-start mt-5 gap-4">
                        <Flex vertical gap={5}>
                            <Typography.Text className="font-bold xs:text-xs md:text-sm ">
                                Billed To
                            </Typography.Text>
                            {data && (
                                <Typography.Text className="font-medium xs:text-xs md:text-sm">
                                    {data.recipientDetails && data.recipientDetails?.customerName}
                                </Typography.Text>
                            )}
                            {data && (
                                <Typography.Text className="xs:text-xs md:text-sm">
                                    {data.recipientDetails &&
                                        data.recipientDetails?.customerAddress}
                                </Typography.Text>
                            )}
                            {data.recipientDetails?.customerPhone && (
                                <Typography.Text className="xs:text-xs md:text-sm">
                                    {data.recipientDetails && data.recipientDetails?.customerPhone}
                                </Typography.Text>
                            )}
                            {data.recipientDetails?.customerEmail && (
                                <Typography.Text className="font-medium xs:text-xs md:text-sm">
                                    {data.recipientDetails && data.recipientDetails?.customerEmail}
                                </Typography.Text>
                            )}
                        </Flex>
                    </Col>
                    <Col span={10} className="xs:mt-4 md:mt-10">
                        <Flex vertical gap={10}>
                            <Flex gap={10} justify="space-between">
                                <Typography.Text className="font-normal">
                                    Invoice No
                                </Typography.Text>
                                {data && (
                                    <Typography.Text className="font-medium xs:text-xs md:text-sm">
                                        #{data?.invoiceDetails.invoiceNo}
                                    </Typography.Text>
                                )}
                            </Flex>

                            <Flex vertical gap={10}>
                                <Flex gap={10} justify="space-between">
                                    <Typography.Text className="font-normal">
                                        Invoice Date
                                    </Typography.Text>
                                    {data && (
                                        <Typography.Text className="font-medium xs:text-xs md:text-sm">
                                            {data.invoiceDetails && data.invoiceDetails.invoiceDate}
                                        </Typography.Text>
                                    )}
                                </Flex>
                                {data?.invoiceDetails.dueDate && (
                                    <Flex gap={10} justify="space-between">
                                        <Typography.Text className="font-normal">
                                            Due Date
                                        </Typography.Text>
                                        {data && (
                                            <Typography.Text className="font-medium xs:text-xs md:text-sm">
                                                {data?.invoiceDetails?.dueDate}
                                            </Typography.Text>
                                        )}
                                    </Flex>
                                )}
                            </Flex>
                        </Flex>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <ConfigProvider theme={themeConfig}>
                            <Table
                                className="mt-5 "
                                dataSource={dataSource}
                                columns={columns}
                                pagination={false}
                                scroll={{ x: 500 }}
                            />
                        </ConfigProvider>
                    </Col>
                    <Col span={24}>
                        <Flex justify="end" className="mt-8">
                            <Flex vertical gap={10}>
                                <Flex gap={140} justify="space-between" className="md:px-2">
                                    <Typography.Text className="font-medium">
                                        Sub Total
                                    </Typography.Text>

                                    <Typography.Text className="xs:text-xs md:text-sm font-semibold">
                                        AED: {data?.paymentDetails?.subTotal ?? 0}
                                    </Typography.Text>
                                </Flex>
                                <Divider className="m-0 p-0" />
                                <Flex gap={140} justify="space-between" className="md:px-2">
                                    <Typography.Text className="font-medium">Vat</Typography.Text>

                                    <Typography.Text className="xs:text-xs md:text-sm font-semibold">
                                        AED{' '}
                                        {data?.paymentDetails?.vat ? data?.paymentDetails?.vat : 0}
                                    </Typography.Text>
                                </Flex>
                                <Divider className="m-0 p-0" />
                                <Flex gap={140} justify="space-between" className="md:px-2">
                                    <Typography.Text className="font-medium">
                                        Discount
                                    </Typography.Text>

                                    <Typography.Text className="xs:text-xs md:text-sm font-semibold">
                                        AED{' '}
                                        {data?.paymentDetails?.discount
                                            ? data?.paymentDetails?.discount
                                            : 0}
                                    </Typography.Text>
                                </Flex>
                                <Divider className="m-0 p-0" />
                                <Flex gap={140} justify="space-between" className="md:px-2">
                                    <Typography.Text className="font-medium">
                                        Shipping
                                    </Typography.Text>

                                    <Typography.Text className="xs:text-xs md:text-sm font-semibold">
                                        AED{' '}
                                        {parseFloat(data?.paymentDetails?.shipping)
                                            ? parseFloat(data.paymentDetails.shipping).toFixed(2)
                                            : '0.00'}
                                    </Typography.Text>
                                </Flex>
                                <Divider className="m-0 p-0" />
                                <Flex gap={140} justify="space-between" className="md:px-2">
                                    <Typography.Text className="font-medium">Total</Typography.Text>

                                    <Typography.Text className="xs:text-xs md:text-sm font-semibold">
                                        AED {data?.paymentDetails?.total ?? 0}
                                    </Typography.Text>
                                </Flex>
                                <Divider className="m-0 p-0" />
                                <Flex gap={140} justify="space-between" className="md:px-2">
                                    <Typography.Text className="font-medium">
                                        Amount Paid
                                    </Typography.Text>

                                    <Typography.Text className="xs:text-xs md:text-sm font-semibold">
                                        AED{' '}
                                        {parseFloat(data?.paymentDetails?.amountPaid)
                                            ? parseFloat(data?.paymentDetails?.amountPaid).toFixed(
                                                  2
                                              )
                                            : '0.00'}
                                    </Typography.Text>
                                </Flex>
                                <Flex
                                    gap={140}
                                    justify="space-between "
                                    className="bg-greyBlack py-2 md:px-2"
                                >
                                    <Typography.Text className="font-medium text-navTextColor">
                                        Amount Due
                                    </Typography.Text>

                                    <Typography.Text className="xs:text-xs md:text-sm font-semibold text-navTextColor">
                                        AED {data?.paymentDetails?.amountDue}
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Col>
                </Row>
                <Flex vertical gap={10} className="md:mt-2 mt-4">
                    {data?.termsConditions && (
                        <Flex vertical>
                            <Typography.Text className="font-bold xs:text-xs md:text-sm">
                                Terms & Conditions
                            </Typography.Text>
                            <Typography.Paragraph className="mt-2">
                                {data?.termsConditions}
                            </Typography.Paragraph>
                        </Flex>
                    )}
                    {JSON.parse(data?.comments) && (
                        <Flex vertical>
                            <Typography.Text className="font-bold xs:text-xs md:text-sm">
                                Notes
                            </Typography.Text>
                            <Typography.Paragraph className="mt-2">{comments}</Typography.Paragraph>
                        </Flex>
                    )}
                </Flex>
            </Card>
        </Flex>
    );
};

export default TrackerDetailsCard;
