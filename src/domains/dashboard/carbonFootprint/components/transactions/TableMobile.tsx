import React, { useState } from 'react';

import { EyeOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Flex, Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

import { formattedDateTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { tableData } from '../../types/dashboard';

interface DetailProps {
    label: string;
    value: any;
}

const DetailSection: React.FC<DetailProps> = ({ label, value }) => (
    <Row justify="space-between" align="top" className="w-full rounded-md">
        <Col span={12}>
            <Typography.Text className="text-xs" style={{ fontWeight: 400 }}>
                {label} :
            </Typography.Text>
        </Col>
        <Col span={12}>
            <Typography.Text className="font-normal text-xs">{value || 'NA'}</Typography.Text>
        </Col>
    </Row>
);

interface TableProp {
    transaction: tableData;
}
const TableMobile: React.FC<TableProp> = ({ transaction }) => {
    const { amount, date, status, creditPurchased, projectName, transactionId } = transaction;
    const [showMore, setshowMore] = useState<boolean>(false);
    const handleSeeMore = () => {
        setshowMore(!showMore);
    };
    const details = [
        { label: 'Project', value: projectName }, // Use the formatted date
        { label: 'Order ID', value: transactionId },
        {
            label: 'Credit Purchased',
            value: `${creditPurchased} ${Number(creditPurchased) < 2 ? 'ton' : 'tons'} CO₂`,
        },
    ];
    return (
        <Content className="p-5  rounded-md ">
            <Flex gap={20} vertical>
                <Row gutter={[20, 20]} align="middle">
                    <Col xs={8}>
                        <Flex justify="start">
                            <Typography.Text className="text-xs">
                                {formattedDateTime(new Date(date))}
                            </Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={6}>
                        <Flex justify="center">
                            <Typography.Text className="font-normal text-center text-textDarkGray text-xs">
                                AED {formatNumberWithLocalString(Number(amount))}
                            </Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={6}>
                        <Flex justify="center">
                            <Button
                                danger
                                size="small"
                                style={{
                                    background:
                                        status === 'SUCCESS'
                                            ? 'var(--Success-50, #ECFDF3)'
                                            : 'rgba(242, 244, 247, 1)',

                                    color:
                                        status === 'SUCCESS'
                                            ? 'var(--Success-700, #027A48)'
                                            : 'rgba(52, 64, 84, 1)',
                                }}
                                className="rounded-xl border-0 px-3"
                                disabled
                            >
                                {status
                                    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
                                    : 'N/A'}{' '}
                            </Button>
                        </Flex>
                    </Col>
                    <Col xs={4}>
                        <Flex justify="center">
                            <EyeOutlined onClick={handleSeeMore} />
                        </Flex>
                    </Col>
                </Row>
                {showMore && (
                    <Flex vertical gap={10} className="bg-bgLightGray p-6">
                        {details.map((detail, index) => (
                            <DetailSection key={index} {...detail} />
                        ))}
                    </Flex>
                )}
                <Divider className="border border-solid" />
            </Flex>
        </Content>
    );
};

export default TableMobile;
