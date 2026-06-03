import { TableColumnsType, Tag, Tooltip } from 'antd';

import Feature1 from '@domains/dashboard/WhatsappForBusiness/assets/images/features/feature1.svg';
import Feature2 from '@domains/dashboard/WhatsappForBusiness/assets/images/features/feature2.svg';
import Feature3 from '@domains/dashboard/WhatsappForBusiness/assets/images/features/Feature3.svg';
import Feature4 from '@domains/dashboard/WhatsappForBusiness/assets/images/features/feature4.svg';
import { USD_TO_AED } from '@src/config-global';
import { formattedDateTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

export const features = [
    {
        icon: Feature1,
        title: 'WhatsApp broadcast',
        description: 'Send promotional messages to countless users.',
    },
    {
        icon: Feature2,
        title: 'Chatbots ',
        description: 'Respond instantly to general queries.',
    },
    {
        icon: Feature3,
        title: 'Live chat',
        description: 'Enable multi-agent live chat support from a single WhatsApp number.',
    },
    {
        icon: Feature4,
        title: 'Journey builder',
        description: 'Build tailor-made chatbot conversation journeys.',
    },
];

export const FirstPlanFeatures = [
    'Broadcast Campaigns',
    'Retargeting Campaigns',
    'Multi-Agent Live Chat',
    'Free WhatsApp Business API',
    'Free Green Tick Application',
    'Up to 10 Tags',
    'Up to 5 Custom Attributes',
    'Advanced Filters & Audience Segregations',
    'Campaign Analytics',
    'Template Messages API',
    '1200 API Calls/min',
    'Canned Messages',
    'Chat & Agent Analytics',
    'Contacts Import & Export',
    'Template Submission Dashboard',
];

export const dummyProjectData = [
    {
        id: '1',
        created_at: '2024-01-01T10:00:00Z',
        name: 'Project Alpha',
        status: 'active',
        credit: 5000,
        is_whatsapp_verified: true,
        subscription_status: 'active',
    },
    {
        id: '2',
        created_at: '2024-01-15T11:30:00Z',
        name: 'Project Beta',
        status: 'paused',
        credit: 3000,
        is_whatsapp_verified: false,
        subscription_status: 'inactive',
    },
    {
        id: '3',
        created_at: '2024-02-01T09:15:00Z',
        name: 'Project Gamma',
        status: 'active',
        credit: 4000,
        is_whatsapp_verified: true,
        subscription_status: 'inactive',
    },
    {
        id: '4',
        created_at: '2024-03-01T14:45:00Z',
        name: 'Project Delta',
        status: 'paused',
        credit: 2000,
        is_whatsapp_verified: false,
        subscription_status: 'inactive',
    },
];

export const SecondPlanFeatures = [
    'All Features in Basic Plan',
    'Up to 100 Tags',
    'Up to 20 Custom Attributes',
    'Campaign Budget',
    'Click Tracking',
    'Scheduler',
    'Agent Freezing Feature',
];

export const projects = [
    { name: 'Peko WhatsApp Project 1', credit: 200, createdAt: '08-04-2023', status: 'Active' },
    { name: 'Peko WhatsApp Project 2', credit: 100, createdAt: '08-04-2023', status: 'Active' },
    { name: 'Peko WhatsApp Project 3', credit: 50, createdAt: '08-04-2023', status: 'Paused' },
    { name: 'Peko WhatsApp Project 4', credit: 200, createdAt: '08-04-2023', status: 'Paused' },
    { name: 'Peko WhatsApp Project 5', credit: 340, createdAt: '08-04-2023', status: 'Active' },
    { name: 'Peko WhatsApp Project 6', credit: 500, createdAt: '08-04-2023', status: 'Active' },
    { name: 'Peko WhatsApp Project 7', credit: 260, createdAt: '08-04-2023', status: 'Paused' },
];

export const orderHistoryData = [
    {
        date: 'May 18, 2024 at 2:14 PM',
        orderType: 'Subscription plan',
        amount: 'AED 2,300',
        status: 'Success',
        view: 'View Details',
    },
    {
        date: 'May 18, 2024 at 2:14 PM',
        orderType: 'WCC credits',
        amount: 'AED 2,300',
        status: 'Failed',
        view: 'View Details',
    },
    {
        date: 'May 18, 2024 at 2:14 PM',
        orderType: 'Subscription plan',
        amount: 'AED 2,300',
        status: 'Pending',
        view: 'View Details',
    },
    {
        date: 'May 18, 2024 at 2:14 PM',
        orderType: 'WCC credits',
        amount: 'AED 2,300',
        status: 'Pending',
        view: 'View Details',
    },
    {
        date: 'May 18, 2024 at 2:14 PM',
        orderType: 'WCC credits',
        amount: 'AED 2,300',
        status: 'Success',
        view: 'View Details',
    },
    {
        date: 'May 18, 2024 at 2:14 PM',
        orderType: 'Subscription plan',
        amount: 'AED 2,300',
        status: 'Failed',
        view: 'View Details',
    },
    {
        date: 'May 18, 2024 at 2:14 PM',
        orderType: 'WCC credits',
        amount: 'AED 2,300',
        status: 'Pending',
        view: 'View Details',
    },
    {
        date: 'May 18, 2024 at 2:14 PM',
        orderType: 'WCC credits',
        amount: 'AED 2,300',
        status: 'Pending',
        view: 'View Details',
    },
];

export const OrderHistoryColumns: TableColumnsType<any> = [
    {
        title: 'Order ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Order Date',
        dataIndex: 'transactionDate',
        key: 'transactionDate',
        render: (date: string, record) => formattedDateTime(new Date(date)),
    },
    {
        title: 'Order Type',
        dataIndex: 'paymentMode',
        key: 'paymentMode',
        render: () => 'WCC credits',
    },
    {
        title: 'Payment Mode',
        dataIndex: 'paymentMode',
        key: 'paymentMode',
    },
    {
        title: 'Amount',
        dataIndex: 'amountInAed',
        key: 'amountInAed',
        render: (amountInAed: string, record) => (
            <Tooltip
                title={`Platform fee included: ${formatNumberWithLocalString(record.surcharge)}`}
                placement="right"
            >
                <span>AED {formatNumberWithLocalString(amountInAed)}</span>
            </Tooltip>
        ),
    },
    {
        title: 'Amount In USD',
        dataIndex: 'amountInAed',
        key: 'amountInAed',
        render: (amountInAed: string, record) => {
            const amountInUsd = (+record.surcharge / +USD_TO_AED).toFixed(2);
            const totalAmountInUsd = (+amountInAed / +USD_TO_AED).toFixed(2);

            return (
                <Tooltip
                    title={`Platform fee included: ${formatNumberWithLocalString(amountInUsd)}`}
                    placement="right"
                >
                    <span>USD {formatNumberWithLocalString(totalAmountInUsd)}</span>
                </Tooltip>
            );
        },
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
            let color;
            let newStatus;
            if (status === 'SUCCESS') {
                newStatus = 'Success';
                color = 'green';
            } else if (status === 'FAILED' || status === 'FAILURE') {
                newStatus = 'Failure';
                color = 'red';
            } else if (status === 'PENDING') {
                newStatus = 'Pending';
                color = 'gold';
            }

            return (
                <Tag color={color} className="rounded-full">
                    • {newStatus}
                </Tag>
            );
        },
    },
];
