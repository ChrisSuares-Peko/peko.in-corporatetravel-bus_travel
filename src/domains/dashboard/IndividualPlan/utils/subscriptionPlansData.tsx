import { CheckOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Typography, Flex, Divider, Tooltip } from 'antd';

export const subscriptionCompareTableData = [
    {
        key: '1',
        service: '',
        services: (
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text>Basic Services</Typography.Text>
                    <Tooltip title="Get access to all services available in basic package.">
                        <InfoCircleOutlined />
                    </Tooltip>
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
            <Flex vertical className="w-full">
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
                    <Tooltip title="Securely sign your important documents digitally.">
                        <InfoCircleOutlined />
                    </Tooltip>
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
                    <Tooltip title="Manage employee’s salaries and HR tasks.">
                        <InfoCircleOutlined />
                    </Tooltip>
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
                    <Tooltip title="Securely store and manage various data online.">
                        <InfoCircleOutlined />
                    </Tooltip>
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
                    <Tooltip title="Access exclusive benefits and rewards.">
                        <InfoCircleOutlined />
                    </Tooltip>
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
                    <Tooltip title="Manage your invoicing and payments conveniently.">
                        <InfoCircleOutlined />
                    </Tooltip>
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
                    <Tooltip title="Book flights and accommodations for your business needs.">
                        <InfoCircleOutlined />
                    </Tooltip>
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
    // {
    //     key: '10',
    //     service: 'Tax & More',
    //     services: (
    //         <Flex vertical>
    //             <Flex justify="space-between">
    //                 <Typography.Text>Tax & More</Typography.Text>
    //                 <Tooltip title="Mange corporate tax, VAT registration, and bookkeeping services.">
    //                     <InfoCircleOutlined />
    //                 </Tooltip>
    //             </Flex>
    //             <Divider />
    //         </Flex>
    //     ),
    //     individualPlan: (
    //         <Flex className="w-full h-full" align="flex-start" vertical gap={8}>
    //             <Typography.Text className="text-lg font-medium font">AED 599</Typography.Text>
    //             <Typography.Text> per months</Typography.Text>
    //         </Flex>
    //     ),

    //     premium: (
    //         <Flex vertical>
    //             <CloseOutlined /> <Divider />
    //         </Flex>
    //     ),
    //     standard: (
    //         <Flex vertical>
    //             <CheckOutlined /> <Divider />
    //         </Flex>
    //     ),
    // },
    {
        key: '11',
        service: 'Vendor Payouts',
        services: (
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text>Vendor Payouts</Typography.Text>
                    <Tooltip title="Process payments to vendors accurately.">
                        <InfoCircleOutlined />
                    </Tooltip>
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
                    <Tooltip title="">
                        <InfoCircleOutlined />
                    </Tooltip>
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
    // {
    //     key: '13',
    //     service: 'WhatsApp Basic',
    //     services: (
    //         <Flex vertical>
    //             <Flex justify="space-between">
    //                 <Typography.Text>Whatsapp Basic</Typography.Text>
    //                 <Tooltip title="Enhance client relations with messaging and automation.">
    //                     <InfoCircleOutlined />
    //                 </Tooltip>
    //             </Flex>
    //             <Divider />
    //         </Flex>
    //     ),
    //     individualPlan: (
    //         <Flex className="w-full h-full" align="flex-start" vertical gap={8}>
    //             <Typography.Text> per months</Typography.Text>
    //         </Flex>
    //     ),

    //     premium: (
    //         <Flex vertical>
    //             <CheckOutlined /> <Divider />{' '}
    //         </Flex>
    //     ),
    //     standard: (
    //         <Flex vertical>
    //             {' '}
    //             <CloseOutlined />
    //             <Divider />
    //         </Flex>
    //     ),
    // },
    // {
    //     key: '14',
    //     service: 'Whatsapp Pro',
    //     services: (
    //         <Flex vertical>
    //             <Flex justify="space-between">
    //                 <Typography.Text>Whatsapp Pro</Typography.Text>
    //                 <Tooltip title="Enhance client relations with messaging and automation.">
    //                     <InfoCircleOutlined />
    //                 </Tooltip>
    //             </Flex>
    //             <Divider />
    //         </Flex>
    //     ),
    //     individualPlan: (
    //         <Flex className="w-full h-full" align="flex-start" vertical gap={8}>
    //             <Typography.Text> per months</Typography.Text>
    //         </Flex>
    //     ),

    //     premium: (
    //         <Flex vertical>
    //             <CloseOutlined /> <Divider />{' '}
    //         </Flex>
    //     ),
    //     standard: (
    //         <Flex vertical>
    //             {' '}
    //             <CheckOutlined />
    //             <Divider />
    //         </Flex>
    //     ),
    // },
];
