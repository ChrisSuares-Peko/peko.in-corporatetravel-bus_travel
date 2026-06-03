import { CheckOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Typography, Flex, Divider } from 'antd';

export const subscriptionCompareTableData = [
    {
        key: '1',
        service: '',
        services: (
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text>Basic Services</Typography.Text>
                    <InfoCircleOutlined />
                </Flex>
                <Divider />
            </Flex>
        ),
        individualPlan: (
            <Flex vertical>
                Free <Divider />
            </Flex>
        ),

        premium: (
            <Flex vertical>
                <CheckOutlined />
                <Divider />
            </Flex>
        ),
        standard: (
            <Flex vertical>
                <CheckOutlined />
                <Divider />
            </Flex>
        ),
    },
    {
        key: '3',
        service: 'eSign',
        services: (
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text>eSign</Typography.Text>
                    <InfoCircleOutlined />
                </Flex>
                <Divider />
            </Flex>
        ),
        individualPlan: (
            <Flex className="w-full h-full" align="flex-start" vertical gap={8}>
                <Typography.Text className="text-lg font-medium font">AED 20</Typography.Text>
                <Typography.Text> per months</Typography.Text>
            </Flex>
        ),

        premium: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
        standard: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
    },
    {
        key: '4',
        service: 'Payroll',
        services: (
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text>Payroll</Typography.Text>
                    <InfoCircleOutlined />
                </Flex>
                <Divider />
            </Flex>
        ),
        individualPlan: (
            <Flex className="w-full h-full" vertical gap={8}>
                <Typography.Text className="text-lg font-medium font">AED 150</Typography.Text>
                <Typography.Text> per months</Typography.Text>
            </Flex>
        ),

        premium: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
        standard: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
    },
    {
        key: '5',
        service: 'Peko Cloud',
        services: (
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text>Peko Cloud</Typography.Text>
                    <InfoCircleOutlined />
                </Flex>
                <Divider />
            </Flex>
        ),
        individualPlan: (
            <Flex className="w-full h-full" align="flex-start" vertical gap={8}>
                <Typography.Text className="text-lg font-medium font">AED 150</Typography.Text>
                <Typography.Text> per months</Typography.Text>
            </Flex>
        ),

        premium: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
        standard: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
    },
    {
        key: '6',
        service: 'Peko Club',
        services: (
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text>Peko Club</Typography.Text>
                    <InfoCircleOutlined />
                </Flex>
                <Divider />
            </Flex>
        ),
        individualPlan: (
            <Flex className="w-full h-full" align="flex-start" vertical gap={8}>
                <Typography.Text> No Plan</Typography.Text>
            </Flex>
        ),

        premium: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
        standard: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
    },
    {
        key: '8',
        service: 'The Collector',
        services: (
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text>The Collector</Typography.Text>
                    <InfoCircleOutlined />
                </Flex>
                <Divider />
            </Flex>
        ),
        individualPlan: (
            <Flex className="w-full h-full" align="flex-start" vertical gap={8}>
                <Typography.Text className="text-lg font-medium font">AED 150</Typography.Text>
                <Typography.Text> per months</Typography.Text>
            </Flex>
        ),

        premium: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
        standard: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
    },
    {
        key: '9',
        service: 'Corporate Travel',
        services: (
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text>Corporate Travel(Flights, Hotels, eSim)</Typography.Text>
                    <InfoCircleOutlined />
                </Flex>
                <Divider />
            </Flex>
        ),
        individualPlan: (
            <Flex className="w-full h-full" align="flex-start" vertical gap={8}>
                <Typography.Text className="text-lg font-medium font">AED 49</Typography.Text>
                <Typography.Text> per months</Typography.Text>
            </Flex>
        ),

        premium: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
        standard: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
    },
    {
        key: '10',
        service: 'Tax & More',
        services: (
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text>Tax & More</Typography.Text>
                    <InfoCircleOutlined />
                </Flex>
                <Divider />
            </Flex>
        ),
        individualPlan: (
            <Flex className="w-full h-full" align="flex-start" vertical gap={8}>
                <Typography.Text className="text-lg font-medium font">AED 599</Typography.Text>
                <Typography.Text> per months</Typography.Text>
            </Flex>
        ),

        premium: (
            <Flex vertical>
                <CloseOutlined /> <Divider />
            </Flex>
        ),
        standard: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
    },
    {
        key: '11',
        service: 'Vendor Payouts',
        services: (
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text>Vendor Payouts</Typography.Text>
                    <InfoCircleOutlined />
                </Flex>
                <Divider />
            </Flex>
        ),
        individualPlan: (
            <Flex className="w-full h-full" align="flex-start" vertical gap={8}>
                <Typography.Text className="text-lg font-medium font">AED 49</Typography.Text>
                <Typography.Text> per months</Typography.Text>
            </Flex>
        ),

        premium: (
            <Flex vertical>
                <CloseOutlined /> <Divider />
            </Flex>
        ),
        standard: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
    },
    {
        key: '12',
        service: 'Phantom (Peko AI)',
        services: (
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text>Phantom (Peko AI)</Typography.Text>
                    <InfoCircleOutlined />
                </Flex>
                <Divider />
            </Flex>
        ),
        individualPlan: (
            <Flex className="w-full h-full" align="flex-start" vertical gap={8}>
                <Typography.Text className="text-lg font-medium font">AED 49</Typography.Text>
                <Typography.Text> per months</Typography.Text>
            </Flex>
        ),

        premium: (
            <Flex vertical>
                <CloseOutlined /> <Divider />
            </Flex>
        ),
        standard: (
            <Flex vertical>
                <CheckOutlined /> <Divider />
            </Flex>
        ),
    },
    {
        key: '13',
        service: 'Whatsapp for Business',
        services: (
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text>Whatsapp for Business</Typography.Text>
                    <InfoCircleOutlined />
                </Flex>
                <Divider />
            </Flex>
        ),
        individualPlan: (
            <Flex className="w-full h-full" align="flex-start" vertical gap={8}>
                <Typography.Text className="text-lg font-medium font">AED 49</Typography.Text>
                <Typography.Text> per months</Typography.Text>
            </Flex>
        ),

        premium: (
            <Flex vertical>
                <CheckOutlined /> <Divider />{' '}
            </Flex>
        ),
        standard: (
            <Flex vertical>
                {' '}
                <CheckOutlined />
                <Divider />
            </Flex>
        ),
    },
];
