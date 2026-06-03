import React from 'react';

import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Typography } from 'antd';

import { useInvoiceDownload } from '../../hooks/useInvoiceDownload';

type OrdersProps = {
    details: DataType[];
};

interface DataType {
    key: string;
    pickUpAddress: JSX.Element;
    type: string;
    submissionCountry: string;
    issuedCountry: string;
    totalAmount: string;
    corporateTxnId: number;
}
const OrdersMobileView = ({ details }: OrdersProps) => {
    const { generateInvoice, isLoading } = useInvoiceDownload();

    return (
        <Flex vertical className="w-full" gap={15}>
            <Card size="small">
                <Flex vertical gap={15}>
                    <Flex vertical>
                        <Typography.Text className="text-base font-semibold">
                            Pick up Address
                        </Typography.Text>
                        <Typography.Text className="text-sm text-textGrey">
                            {details[0]?.pickUpAddress}
                        </Typography.Text>
                    </Flex>
                    <Flex vertical>
                        <Typography.Text className="text-base font-medium">Type</Typography.Text>
                        <Typography.Text className="text-sm text-textGrey">
                            {details[0]?.type}
                        </Typography.Text>
                    </Flex>
                    <Flex vertical>
                        <Typography.Text className="text-base font-medium">
                            Submission Country
                        </Typography.Text>
                        <Typography.Text className="text-sm text-textGrey">
                            {details[0]?.submissionCountry}
                        </Typography.Text>
                    </Flex>
                    <Flex vertical>
                        <Typography.Text className="text-base font-medium">
                            Issued Country
                        </Typography.Text>
                        <Typography.Text className="text-sm text-textGrey">
                            {details[0]?.issuedCountry}
                        </Typography.Text>
                    </Flex>
                    <Flex vertical>
                        <Typography.Text className="text-base font-medium">
                            Total Amount
                        </Typography.Text>
                        <Typography.Text className="text-sm text-textGrey">
                            AED {details[0]?.totalAmount}
                        </Typography.Text>
                    </Flex>
                </Flex>
            </Card>
            <Flex justify="end">
                <Button
                    type="link"
                    icon={<DownloadOutlined className="text-yellow-400" />}
                    className="border border-yellow-400 w-42 "
                    onClick={() => generateInvoice(details[0]?.corporateTxnId)}
                    loading={isLoading}
                >
                    <Typography.Text className="text-yellow-400">Download invoice</Typography.Text>
                </Button>
            </Flex>
        </Flex>
    );
};

export default OrdersMobileView;
