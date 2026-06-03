import React from 'react';

import { Table, Typography, Flex } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { useInvoiceDownload } from '../../hooks/useInvoiceDownload';

const { Title } = Typography;

type OrdersProps = {
    details: DataType[];
    Loading: boolean;
};

interface DataType {
    key: string;
    pickUpAddress: JSX.Element;
    type: string;
    submissionCountry: string;
    issuedCountry: string;
    totalAmount: string;
    transactionId: number;
    corporateTxnId: number;
}

const Orders: React.FC<OrdersProps> = ({ details, Loading }) => {
    const { generateInvoice, isLoading } = useInvoiceDownload();
    const handleDownloadInvoice = (txnId: number) => {
        generateInvoice(txnId);
    };
    const columns: ColumnsType<DataType> = [
        {
            title: 'Pick Up Address',
            dataIndex: 'pickUpAddress',
            key: 'pickUpAddress',
            width: 250,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Submission Country',
            dataIndex: 'submissionCountry',
            key: 'submissionCountry',
        },
        {
            title: 'Issued Country',
            dataIndex: 'issuedCountry',
            key: 'issuedCountry',
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: amount => (
                <Typography.Text className="text-xs text-textBlack">
                    AED {amount.toFixed(2)}
                </Typography.Text>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record: DataType) => (
                <Flex vertical gap={10}>
                    <Typography.Text
                        className="text-xs text-[#FF3A3A] cursor-pointer"
                        onClick={() => handleDownloadInvoice(record.corporateTxnId)}
                    >
                        Download Invoice
                    </Typography.Text>
                    {/* <Typography.Text className="text-xs text-[#AB1E1E]">
                        Request for Order Cancellation
                    </Typography.Text> */}
                </Flex>
            ),
        },
    ];

    return (
        <>
            <Typography.Text className="text-lg font-medium">Order Details</Typography.Text>
            <Table
                columns={columns}
                dataSource={details}
                pagination={false}
                className="mt-8"
                loading={Loading}
            />
        </>
    );
};

export default Orders;
