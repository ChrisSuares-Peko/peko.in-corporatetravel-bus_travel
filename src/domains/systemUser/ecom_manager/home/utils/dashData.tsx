import { Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { OrderHistoryDatatype } from '@domains/systemUser/ecom_manager/home/types/dashDetails';
import { formattedDateTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import GetProducts from './GetProducts';

export const OrderHistoryData: OrderHistoryDatatype[] = [
    {
        id: '1',
        date: <span>2014-12-24 23:12:00</span>,
        documentName: 'International Document Bullet Delivery',
        orderId: '1703673676590',
        paymentMode: 'AED 160.00',
        status: <Typography.Text className="text-textYellow">Booking Placed</Typography.Text>,
        view: (
            <Link to="/order-details">
                <Typography.Text className="text-textRed">Track your Order</Typography.Text>
            </Link>
        ),
    },
    {
        id: '2',
        date: <span>2014-12-24 23:12:00</span>,
        documentName: 'Logitech MK 120 Keyboard & Mouse',
        orderId: '1703673676591',
        paymentMode: 'AED 160.00',
        status: <Typography.Text className="text-textGreenLight">Delivered</Typography.Text>,
        view: (
            <Link to="/order-details">
                <Typography.Text className="text-textRed">Track your Order</Typography.Text>
            </Link>
        ),
    },
    {
        id: '3',
        date: <span>2014-12-24 23:12:00</span>,
        documentName: 'International Document Bullet Delivery',
        orderId: '1703673676592',
        paymentMode: 'AED 160.00',
        status: <Typography.Text className="text-textOrange">Picked up</Typography.Text>,
        view: (
            <Link to="/order-details">
                <Typography.Text className="text-textRed">Track your Order</Typography.Text>
            </Link>
        ),
    },
];

export const generateOrderBtn = (status: string) => {
    const statusColors: Record<string, { badgeColor: string; textColor: string }> = {
        PENDING: { badgeColor: '#FFF4F3', textColor: '#D7341E' },
        CONFIRMED: { badgeColor: '#FFF4CD', textColor: '#CD9300' },
        ONPROGRESS: { badgeColor: '#E3F5FF', textColor: '#54AEE1' },
        SHIPPED: { badgeColor: '#EAFFF7', textColor: '#51B18D' },
        COMPLETED: { badgeColor: '#EBFFE7', textColor: '#26A411' },
        CANCELLED: { badgeColor: '#E9E9E9', textColor: '#000000' },
        'RETURN REQUESTED': { badgeColor: '#FFF4F3', textColor: '#D7341E' },
        'RETURN REJECTED': { badgeColor: '#E9E9E9', textColor: '#000000' },
        'RETURN INITIATED': { badgeColor: '#E3F5FF', textColor: '#54AEE1' },
        'RETURN COMPLETED': { badgeColor: '#EBFFE7', textColor: '#26A411' },
    };

    const { badgeColor, textColor } = statusColors[status] || {
        badgeColor: 'gray',
        textColor: 'white',
    };

    return (
        <Tag
            style={{
                borderRadius: 12,
                fontWeight: 500,
                fontSize: 12,
                padding: '4px 12px',
                marginBottom: 4,
                color: textColor,
            }}
            color={badgeColor}
        >
            {status}
        </Tag>
    );
};

export const generatePaymentStatusBtn = (status: string) => {
    const statusColors: Record<string, { badgeColor: string; textColor: string }> = {
        SUCCESS: { badgeColor: '#EAF6ED', textColor: '#166106' },
        FAILED: { badgeColor: '#FFDEDF', textColor: '#EA3639' },
        'on progress': { badgeColor: '#E3F5FF', textColor: '#54AEE1' },
        shipped: { badgeColor: '#EAFFF7', textColor: '#51B18D' },
        COMPLETE: { badgeColor: '#EBFFE7', textColor: '#26A411' },
    };

    const { badgeColor, textColor } = statusColors[status] || {
        badgeColor: 'gray',
        textColor: 'white',
    };

    return (
        <Tag
            style={{
                borderRadius: 12,
                fontWeight: 500,
                fontSize: 12,
                padding: '4px 12px',
                marginBottom: 4,
                color: textColor,
            }}
            color={badgeColor}
        >
            {status}
        </Tag>
    );
};

export const OrderHistoryColumns = [
    {
        title: 'Date',
        dataIndex: 'transactionDate',
        key: 'transactionDate',
        render: (date: string) => formattedDateTime(new Date(date)),
    },
    {
        title: 'Product name',
        dataIndex: 'orderResponse',
        key: 'orderResponse',
        render: (record: any) => <GetProducts orderResponse={record} />,
    },
    {
        title: 'Customer',
        dataIndex: 'credential',
        key: 'credential.name',
        render: (credential: any) => credential.name,
    },
    {
        title: 'Price',
        dataIndex: 'amountInAed',
        key: 'amountInAed',
        render: (data: any) => (
            <Typography.Text>AED {formatNumberWithLocalString(Number(data))}</Typography.Text>
        ),
    },
    {
        title: 'Current Status',
        dataIndex: 'ecomOrderStatus',
        key: 'ecomOrderStatus',
        render: (status: string) => generateOrderBtn(status),
    },
    {
        title: 'Payment Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => generatePaymentStatusBtn(status),
    },
    // {
    //     title: 'View',
    //     dataIndex: 'view',
    //     key: 'view',
    //     render: () => <EyeOutlined />,
    // },
];
