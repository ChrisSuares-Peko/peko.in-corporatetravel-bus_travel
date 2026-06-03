import { Flex, Typography } from 'antd';

import { formattedDateTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { Transaction } from '../types/bulkRefund';

export const categoryData = [
    { label: 'All', value: 'all' },
    { label: 'Etisalat Postpaid', value: 'etisalat_bill' },
    { label: 'Du Postpaid', value: 'du' },
    { label: 'EWE', value: 'fewa_direct' },
    { label: 'AADC', value: 'aadc_direct' },
    { label: 'ADDC', value: 'addc_direct' },
    { label: 'ESIM', value: 'esim' },
];

export function calculateTimeRemainingToNext1026AMUTC(
    transactionDate: string,
    status: string,
    paymentMode: string
) {
    if (status === 'REFUNDED' || paymentMode === 'WALLET') {
        return '';
    }
    const oneHourInMilliseconds = 3600000;
    const oneMinuteInMilliseconds = 60000;

    // Get the current UTC date and time
    const nowUTC = new Date();

    const transactionDateUTC = new Date(transactionDate);
    const next1026AMUTC = new Date(nowUTC);
    next1026AMUTC.setHours(10, 26, 0, 0); // Set to 10:26 AM
    if (nowUTC.getHours() > 10 || (nowUTC.getHours() === 10 && nowUTC.getMinutes() >= 26)) {
        next1026AMUTC.setDate(next1026AMUTC.getDate() + 1); // Move to the next day if current time is past 10:26 AM
    }
    const diff =
        (Number(next1026AMUTC) - Number(transactionDateUTC)) / Number(oneHourInMilliseconds);
    if (diff > 24) {
        return '';
    }
    // Calculate the difference in milliseconds
    const diffMs = Number(next1026AMUTC) - Number(nowUTC);

    // Calculate hours and minutes remaining
    const hours = Math.floor(diffMs / oneHourInMilliseconds);
    const minutes = Math.floor((diffMs % oneHourInMilliseconds) / oneMinuteInMilliseconds);

    return `${hours}h ${minutes}min`;
}

export const BulkRefundColumns = [
    {
        title: 'Date',
        dataIndex: 'transactionDate',
        key: 'transactionDate',
        render: (data: any) => (
            <Typography.Text>{formattedDateTime(new Date(data))}</Typography.Text>
        ),
    },
    {
        title: 'Corporate Name',
        dataIndex: 'credential',
        key: 'credential',
        render: (credential: any) => <Typography.Text>{credential.name}</Typography.Text>,
    },
    {
        title: 'Batch ID',
        dataIndex: 'batchId',
        key: 'batchId',
        // render: (deviceType: any) => <Typography.Text>{deviceType}</Typography.Text>,
    },
    {
        title: 'Transaction ID',
        dataIndex: 'corporateTxnId',
        key: 'corporateTxnId',
        render: (corporateTxnId: string, record: Transaction) => (
            <Flex vertical gap={5}>
                <Typography.Text>{corporateTxnId}</Typography.Text>
                <Typography.Text>{record.serviceOperator.serviceProvider || ''}</Typography.Text>
            </Flex>
        ),
    },
    {
        title: 'Amount',
        dataIndex: 'order',
        key: 'order',
        render: (amount: any, record: Transaction) => (
            <Flex vertical gap={5}>
                <Typography.Text>
                    AED {formatNumberWithLocalString(Number(amount.amountInAed || 0))}
                </Typography.Text>
                <Typography.Text>{record.order.paymentMode || ''}</Typography.Text>
            </Flex>
        ),
    },
    {
        title: 'Refund',
        dataIndex: 'remarks',
        key: 'remarks',
        render: (data: any, record: Transaction) =>
            data === 'PENDING' || data === 'Payment Failed' ? (
                <Flex vertical gap={5}>
                    <Typography.Text className="text-textRed">{data}</Typography.Text>
                    <Typography.Text className="text-textRed">
                        {calculateTimeRemainingToNext1026AMUTC(
                            record.transactionDate,
                            record.status,
                            record.order.paymentMode
                        )}
                    </Typography.Text>
                </Flex>
            ) : (
                <Typography.Text className="text-textGreen">{data}</Typography.Text>
            ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (data: any) =>
            data === 'FAILURE' ? (
                <Typography.Text className="text-textRed">{data}</Typography.Text>
            ) : (
                <Typography.Text className="text-textGreen">{data}</Typography.Text>
            ),
    },
];
