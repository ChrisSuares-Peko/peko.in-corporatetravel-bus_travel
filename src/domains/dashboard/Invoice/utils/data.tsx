import { CopyOutlined } from '@ant-design/icons';
import { Flex, Typography, Button, TableProps } from 'antd';

import customer from '@domains/dashboard/Invoice/assets/customer.svg';
import paymentlink from '@domains/dashboard/Invoice/assets/paymentlink.svg';
import track from '@domains/dashboard/Invoice/assets/track.svg';
import upload from '@domains/dashboard/Invoice/assets/upload.svg';
import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';

export const columns = [
    {
        title: 'Description',
        dataIndex: 'name',
        key: 'name',
        render: (name: { firstRow: string; secondRow: string }) => (
            <Flex vertical>
                <Typography.Paragraph>{name.firstRow}</Typography.Paragraph>
                <Typography.Paragraph>{name.secondRow}</Typography.Paragraph>
            </Flex>
        ),
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (amount: string) => `AED ${formatNumberWithLocalString(Number(amount))}`,
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount: string) => `AED ${formatNumberWithLocalString(Number(amount))}`,
    },
];

export const featureRow = [
    {
        image: customer,
        title: 'Create Invoice',
        link: `${paths.invoice.create}`,
    },
    {
        image: track,
        title: 'Upload Invoice',
        link: `${paths.invoice.upload}`,
    },
    {
        image: paymentlink,
        title: 'Payment Links',
        link: `${paths.invoice.paymentLinks}`,
    },
    {
        image: upload,
        title: 'Track Invoice',
        link: `${paths.invoice.invoicehistory}`,
    },
];

export const notification = {
    email: 'hope this email finds you well, This is a gentle reminder regarding the outstanding payment of AED 13,252 (Rupees equivalent) for [mention the product/service]. As per our records, the payment is due on [mention the due date]. We kindly request you to expedite the payment process to ensure a smooth continuation of our business relationship. Timely payments help us maintain the quality of service we strive to provide.Please find attached the invoice for your reference. If there are any discrepancies or if you require any further clarification regarding the invoice, feel free to reach out to us. Thank you for your attention to this matter. We appreciate your prompt action in settling the outstanding amount.Looking forward to your cooperation.',
};

interface IData {
    key: string;
    date: string;
    paymentName: string;
    paymentId: string;
    amount: string;
    status: string;
    paymentLink: string;
    action: string;
}

export const orderHistoryColumns: TableProps<IData>['columns'] = [
    {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    // {
    //     title: 'Payment Name',
    //     dataIndex: 'paymentName',
    //     key: 'paymentName',
    // },
    {
        title: 'Payment Id',
        dataIndex: 'paymentId',
        key: 'paymentId',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Payment Link',
        dataIndex: 'paymentLink',
        key: 'paymentLink',
        render: () => (
            <Flex gap="middle">
                <Button danger>Download</Button>
                <CopyOutlined className="text-iconRed" />
            </Flex>
        ),
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: () => 'Edit',
    },
];

export const data: IData[] = [
    {
        key: '1',
        date: '2014-12-24 23:12:00',
        paymentName: 'Al Azeez Vendor',
        paymentId: '1703673676590',
        amount: 'AED 160.00',
        status: 'pending',
        paymentLink: '',
        action: '',
    },
    {
        key: '2',
        date: '2014-12-24 23:12:00',
        paymentName: 'Al Ain water Vendor',
        paymentId: '1703673676590',
        amount: 'AED 160.00',
        status: 'pending',
        paymentLink: '',
        action: '',
    },
    {
        key: '3',
        date: '2014-12-24 23:12:00',
        paymentName: 'Oasis',
        paymentId: '1703673676590',
        amount: 'AED 160.00',
        status: 'pending',
        paymentLink: '',
        action: '',
    },
];
export const paymentLinkNotification = [
    { value: 'EML', label: 'Email' },
    { value: 'SMS', label: 'SMS' },
    { value: 'LNK', label: 'Invoice Link' },
    { value: 'ALL', label: 'ALL' },
];

export const myFatoorahKYBDocumentTypes = [
    { value: 2, label: 'Trade License' },
    { value: 3, label: 'Memorandum of association/Article of association' },
    { value: 16, label: 'Emirates IDs of Owner/Owners/Manager (As on trade license)' },
    { value: 4, label: 'Passport copy/copies of Owner/Owners/Manager (As on trade license)' },
    { value: 21, label: 'Bank letter/IBAN certificate for AED currency' },
    { value: 25, label: 'Proof of business[Website link/ Social Media Profile Link]' },
];

export const myFatoorahDepositTerms = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'OnDemand', label: 'OnDemand' },
];
