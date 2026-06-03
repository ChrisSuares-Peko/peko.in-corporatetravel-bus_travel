import { CopyOutlined } from '@ant-design/icons';
import { Button, Flex, TableProps } from 'antd';

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

export const columns: TableProps<IData>['columns'] = [
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Payment Name',
        dataIndex: 'paymentName',
        key: 'paymentName',
    },
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
