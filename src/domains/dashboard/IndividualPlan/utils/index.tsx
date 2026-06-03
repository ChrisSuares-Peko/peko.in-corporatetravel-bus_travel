import { ReactNode } from 'react';

import { CheckOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';

import Feature1 from '@domains/dashboard/Payroll/assets/images/purchase-page/feature1.svg';
import Feature2 from '@domains/dashboard/Payroll/assets/images/purchase-page/feature2.svg';
import Feature3 from '@domains/dashboard/Payroll/assets/images/purchase-page/feature3.svg';
import Feature4 from '@domains/dashboard/Payroll/assets/images/purchase-page/feature4.svg';
import Feature5 from '@domains/dashboard/Payroll/assets/images/purchase-page/feature5.svg';
import Feature6 from '@domains/dashboard/Payroll/assets/images/purchase-page/feature6.svg';

export const features = [
    {
        icon: Feature1,
        title: 'Unlimited Employees Management',
        description: 'Efficiently handle payroll for your expanding workforce with no limits',
    },
    {
        icon: Feature2,
        title: 'Payroll',
        description: 'Stay organised with leaves and loss of pay tracking for seamless oversight',
    },
    {
        icon: Feature3,
        title: 'Leaves & LOP',
        description: 'Enhance perks and benefits for motivated workforce dynamic',
    },
    {
        icon: Feature4,
        title: 'Announcement & Alerts',
        description: 'Efficiently process employee payments with seamless payroll',
    },
    {
        icon: Feature5,
        title: 'Employee Benefits',
        description: 'Stay updated on important announcements and alerts',
    },
    {
        icon: Feature6,
        title: 'and More',
        description: 'Explore advanced payroll features and functions',
    },
];
interface TableColumn {
    title: ReactNode;
    dataIndex: string;
    key: string;
    render?: (text: any, record: any, index: number) => ReactNode;
}

export const purchaseDatacolumns: TableColumn[] = [
    {
        title: <Typography.Text className="text-lg font-medium">Services</Typography.Text>,
        dataIndex: 'services',
        key: 'services',
        render: text => text,
    },
    {
        title: <Typography.Text className="text-lg font-medium">Individual Plans</Typography.Text>,
        dataIndex: 'individualPlan',
        key: 'individualPlan',
        render: text => text,
    },
    {
        title: (
            <Flex vertical>
                <Typography.Text className="text-base font-medium">Standard</Typography.Text>
                <Typography.Text className="text-lg font-semibold">AED 299</Typography.Text>
                <Typography.Text className="text-xs font-normal">per month</Typography.Text>
                <Typography.Text className="text-xs font-normal text-green-300">
                    You will save AED 300
                </Typography.Text>
            </Flex>
        ),
        dataIndex: 'basic',
        key: 'basic',
        render: text => text, // Render React elements or components directly
    },
    {
        title: (
            <Flex vertical>
                <Typography.Text className="text-base font-medium text-lightRed">
                    Premium{' '}
                </Typography.Text>
                <Typography.Text className="text-lg font-semibold">AED 899</Typography.Text>
                <Typography.Text className="text-xs font-normal">per month</Typography.Text>
                <Typography.Text className="text-xs font-normal text-green-300">
                    You will save AED 300
                </Typography.Text>
            </Flex>
        ),
        dataIndex: 'premium',
        key: 'premium',
        render: text => text, // Render React elements or components directly
    },
];

export const purchaseData = [
    {
        key: '1',
        services: (
            <Flex justify="space-between">
                <Typography.Text>Basic</Typography.Text>
                <InfoCircleOutlined />
            </Flex>
        ),
        individualPlan: 'Free',
        basic: <CloseOutlined />,
        premium: <CloseOutlined />,
    },
    {
        key: '2',
        services: (
            <Flex justify="space-between">
                <Typography.Text>Payroll</Typography.Text>
                <InfoCircleOutlined />
            </Flex>
        ),
        individualPlan: 'AED 99/month',
        basic: <CheckOutlined />,
        premium: <CheckOutlined />,
    },
    {
        key: '3',
        services: (
            <Flex justify="space-between">
                <Typography.Text className="text-bgOrange2">Peko Cloud</Typography.Text>
                <InfoCircleOutlined />
            </Flex>
        ),
        individualPlan: 'AED 99/month',
        basic: <CheckOutlined />,
        premium: <CheckOutlined />,
    },
    {
        key: '4',
        services: (
            <Flex justify="space-between">
                <Typography.Text className="text-bgOrange2">The Collector</Typography.Text>
                <InfoCircleOutlined />
            </Flex>
        ),
        individualPlan: 'AED 99/month',
        basic: <CheckOutlined />,
        premium: <CheckOutlined />,
    },
    {
        key: '5',
        services: (
            <Flex justify="space-between">
                <Typography.Text className="text-bgOrange2">Peko Club</Typography.Text>
                <InfoCircleOutlined />
            </Flex>
        ),
        individualPlan: 'AED 99/month',
        basic: <CheckOutlined />,
        premium: <CheckOutlined />,
    },
];
