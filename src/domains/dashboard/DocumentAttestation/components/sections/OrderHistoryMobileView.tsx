/* eslint-disable no-nested-ternary */
import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Flex, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formattedDateTime } from '@utils/dateFormat';

type OrderHistoryMobileViewProps = {
    ordersList: DataType[];
    setSearchKey: (key: string) => void;
};
interface DataType {
    id: string;
    date: string;
    documentType: string;
    orderId: string;
    paymentMode: string;
    status: string;
    amount: number;
}

const getBorderColor = (status: string) => {
    let color = '#C89C00';

    if (status.toLowerCase() === 'processing') {
        color = '#808080';
    }
    if (status.toLowerCase() === 'assigned') {
        color = '#1EA0CC';
    }
    if (status.toLowerCase() === 'dispatched') {
        color = '#FF910F';
    }
    if (status.toLowerCase() === 'completed' || status.toLowerCase() === 'delivered') {
        color = '#26A411';
    }
    if (status.toLowerCase() === 'cancelled') {
        color = '#FF4F4F';
    }
    return color;
};

const OrderHistoryMobileView: React.FC<OrderHistoryMobileViewProps> = ({
    ordersList,
    setSearchKey,
}) => (
    <Flex vertical gap={18} className="w-full">
        <Input
            allowClear
            suffix={<SearchOutlined />}
            variant="outlined"
            placeholder="Track your order"
            onChange={e => setSearchKey(e.target.value)}
        />
        <Typography.Text className="text-lg font-medium">Order History</Typography.Text>
        {ordersList.map((item, index) => (
            <Card size="small" className="bg-bgGray" key={index}>
                <Flex vertical gap={18}>
                    <Flex justify="space-between" align="center">
                        <Flex vertical>
                            <Typography.Text>
                                {formattedDateTime(new Date(item.date))}
                            </Typography.Text>
                            <Typography.Text className="text-lg font-semibold">
                                AED {item?.amount.toFixed(2)}
                            </Typography.Text>
                        </Flex>
                        <Typography.Text
                            // type="default"
                            style={{
                                color: getBorderColor(item.status),
                                borderColor: getBorderColor(item.status),
                            }}
                            className="w-42 px-3 py-1 rounded-sm border"
                        >
                            {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                        </Typography.Text>
                    </Flex>
                    <Divider />
                    <Flex justify="space-between" align="center" className="w-full">
                        <Typography.Text>Document Type :</Typography.Text>
                        <Typography.Text>{item.documentType}</Typography.Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Typography.Text>Order id :</Typography.Text>
                        <Typography.Text>{item.orderId}</Typography.Text>
                    </Flex>
                    <Link
                        to={`${paths.documentAttestation.orderdetails}/${item.orderId}`}
                        className="justify-center w-full"
                    >
                        <Button
                            type="default"
                            className="w-full text-red-400 border border-red-400"
                        >
                            Track your Order
                        </Button>
                    </Link>
                </Flex>
            </Card>
        ))}
    </Flex>
);

export default OrderHistoryMobileView;
