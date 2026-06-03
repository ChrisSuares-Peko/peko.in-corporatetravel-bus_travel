import React, { useState } from 'react';

import { RightOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Flex, Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

import { formattedDateTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';
import formatString from '@utils/wordFormat';

import { useDownloadInvoice } from '../hooks/useDownloadInvoice';
import { transactionType } from '../types/index';

interface DetailProps {
    label: string;
    value: string | number;
}

const DetailSection: React.FC<DetailProps> = ({ label, value }) => (
    <Flex justify="space-between" className="w-full ">
        <Typography.Text style={{ fontWeight: 400 }}>{label} :</Typography.Text>
        <Typography.Text className="font-normal">{value}</Typography.Text>
    </Flex>
);

interface TableProp {
    transaction: transactionType;
    isCashbackTable: boolean;
}
const TableMobile: React.FC<TableProp> = ({ transaction, isCashbackTable }) => {
    const { amount, date, status, category, operator, transactionID } = transaction;
    const { getInvoiceData, loader } = useDownloadInvoice();
    const [showMore, setshowMore] = useState<boolean>(false);
    const handleSeeMore = () => {
        setshowMore(!showMore);
    };
    const handleDownloadInvoice = (txnId: number) => {
        getInvoiceData(txnId);
    };
    const details = [
        { label: 'Date', value: formattedDateTime(new Date(date)) },
        { label: 'Order ID', value: transactionID },
        { label: 'Category', value: category },
        { label: 'Payment Mode', value: formatString(transaction.paymentMode) },
    ];
    return (
        <Content className="p-5  rounded-md ">
            <Flex gap={20} vertical>
                <Row gutter={[20, 20]} align="middle">
                    <Col xs={6}>
                        <Flex justify="start">
                            <Typography.Text className="text-xs">{operator}</Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={7}>
                        <Flex justify="center">
                            <Typography.Text className="font-normal text-center text-textDarkGray text-xs">
                                AED {formatNumberWithLocalString(Number(amount))}
                            </Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={7}>
                        <Flex justify="center">
                            {!isCashbackTable ? (
                                <Button
                                    danger
                                    size="small"
                                    style={{
                                        background:
                                            status === 'Success'
                                                ? 'var(--Success-50, #ECFDF3)'
                                                : 'rgba(242, 244, 247, 1)',

                                        color:
                                            status === 'Success'
                                                ? 'var(--Success-700, #027A48)'
                                                : 'rgba(52, 64, 84, 1)',
                                    }}
                                    className="rounded-xl border-0 px-2"
                                    disabled
                                >
                                    <Typography.Text className="text-xs">
                                        {status === 'Pending' ? 'In Progress' : status}
                                    </Typography.Text>
                                </Button>
                            ) : (
                                <Flex justify="center">
                                    <Typography.Text className="font-normal text-center text-textDarkGray text-xs">
                                        AED{' '}
                                        {formatNumberWithLocalString(Number(transaction.cashback))}
                                    </Typography.Text>
                                </Flex>
                            )}
                        </Flex>
                    </Col>
                    <Col xs={4}>
                        <Flex justify="center">
                            <RightOutlined
                                onClick={handleSeeMore}
                                className={`collapse-icon ${showMore ? 'open' : ''}`}
                            />
                        </Flex>
                    </Col>
                </Row>
                {showMore && (
                    <Flex vertical gap={10} className="bg-bgLightGray p-6">
                        {details.map((detail, index) => (
                            <DetailSection key={index} {...detail} />
                        ))}
                        <Button
                            danger
                            className="mt-3"
                            loading={loader}
                            onClick={() => handleDownloadInvoice(transactionID)}
                        >
                            Download Invoice
                        </Button>
                    </Flex>
                )}
                <Divider className="border border-solid" />
            </Flex>
        </Content>
    );
};

export default TableMobile;
