import { CopyOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Link } from 'react-router-dom';

import { formatDate, formatTime } from './helpers';

const toTitleCase = (text: string) =>
    text?.replace(
        /\w\S*/g,
        (word: string) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    );

const PaymentLinkColumns = ({
    tooltipText,
    setTooltipText,
    setSelectedLinkDetails,
    setModalVisible,
}: any): ColumnsType<any> => [
    {
        title: 'Created Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt: any) => (
            <Flex className="whitespace-nowrap" gap={5}>
                <Typography.Text>{formatDate(createdAt)}</Typography.Text>
                <Typography.Text>{formatTime(createdAt)}</Typography.Text>
            </Flex>
        ),
    },
    {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount, record) => `${record.currency} ${amount}`,
    },
    {
        title: 'Expiry Date',
        dataIndex: 'expiryDate',
        key: 'expiryDate',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: status => {
            let colorClass = '';
            if (status === 'Paid') {
                colorClass = 'text-[#05BE63]';
            } else {
                colorClass = 'text-[#E38800]';
            }
            const formattedStatus = toTitleCase(status);
            return (
                <Typography.Text
                    className={`${colorClass} font-normal px-3 py-1 rounded-2xl whitespace-nowrap`}
                >
                    {formattedStatus}
                </Typography.Text>
            );
        },
    },
    {
        title: 'Payment Link',
        dataIndex: 'client_url',
        key: 'client_url',
        render: (record: any) => (
            <Flex gap="middle">
                <Link to={record}>
                    <Button type="link" danger>
                        Payment Link
                    </Button>
                </Link>
                <Tooltip
                    title={tooltipText}
                    onVisibleChange={visible => {
                        if (!visible) {
                            setTooltipText('Copy to clipboard');
                        }
                    }}
                >
                    <CopyOutlined
                        className="text-iconRed custom-copyable"
                        onClick={() => {
                            navigator.clipboard
                                .writeText(record)
                                .then(() => {
                                    setTooltipText('Copied!');
                                })
                                .catch(err => {
                                    setTooltipText('Failed to copy');
                                });
                        }}
                    />
                </Tooltip>
            </Flex>
        ),
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
            <Flex justify="center" className="px-2">
                <Button
                    type="default"
                    danger
                    className="w-full"
                    size="small"
                    disabled={record?.status === 'paid'}
                    onClick={() => {
                        setSelectedLinkDetails(record);
                        setModalVisible(true);
                    }}
                >
                    Resend
                </Button>
            </Flex>
        ),
    },
];

export default PaymentLinkColumns;
