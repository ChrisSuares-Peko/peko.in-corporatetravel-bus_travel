import React, { useState } from 'react';

import { RightOutlined, DownOutlined } from '@ant-design/icons';
import { Card, Divider, Typography, Flex, Avatar } from 'antd';

import { salarytableType } from '../../types/salaryProfileTypes/employeeSalaryTable';

function getInitials(name: string): string {
    const words = name.split(' ');
    const initials = words
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 3)
        .toUpperCase();
    return initials;
}

const EmployeeSalaryCardMobile: React.FC<salarytableType> = ({
    name,
    department,
    employeeId,
    role,
    basicSalary,
    totalDeduction,
    id,
    image,
    others,
    totalSalary,

    status,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Card
            size="small"
            className="mt-4 h-50 bg-slate-50 border-none p-2"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <Flex className="w-full" gap={5} vertical>
                <Flex className="w-full" justify="space-between" align="center">
                    <Flex align="center" gap={5}>
                        {image ? (
                            <Avatar
                                src={image}
                                style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
                            />
                        ) : (
                            <Avatar style={{ backgroundColor: '#fde3cf', color: 'red' }}>
                                {getInitials(name)}
                            </Avatar>
                        )}
                    </Flex>
                </Flex>
                <Flex className="w-full" justify="space-between" align="center">
                    <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                        Employee Name:
                    </Typography.Text>
                    <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                        {name}
                    </Typography.Text>
                </Flex>

                <Flex className="w-full" justify="space-between" align="center">
                    <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                        Designation:
                    </Typography.Text>
                    <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                        {role}
                    </Typography.Text>
                </Flex>
                <Flex className="w-full" justify="space-between" align="center">
                    <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                        Employee ID:
                    </Typography.Text>
                    <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                        {employeeId}
                    </Typography.Text>
                </Flex>
                <Flex className="w-full" justify="space-between" align="center">
                    <Typography.Text className="text-lightRed">
                        {isExpanded ? 'Show Less' : 'Show More'}
                    </Typography.Text>
                    <Flex onClick={toggleExpand} className="cursor-pointer">
                        {isExpanded ? (
                            <DownOutlined style={{ color: 'red' }} />
                        ) : (
                            <RightOutlined style={{ color: 'red' }} />
                        )}
                    </Flex>
                </Flex>
                <Divider />
                {isExpanded && (
                    <>
                        <Flex className="w-full" justify="space-between" align="center">
                            <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                                Basic Salary:
                            </Typography.Text>
                            <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                                {basicSalary}
                            </Typography.Text>
                        </Flex>

                        <Flex className="w-full" justify="space-between" align="center">
                            <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                                Others:
                            </Typography.Text>
                            <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                                {others}
                            </Typography.Text>
                        </Flex>
                        <Flex className="w-full" justify="space-between" align="center">
                            <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                                Total Deduction:
                            </Typography.Text>
                            <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                                {totalDeduction}
                            </Typography.Text>
                        </Flex>
                        <Flex className="w-full" justify="space-between" align="center">
                            <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                                Total Salary:
                            </Typography.Text>
                            <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                                {totalSalary}
                            </Typography.Text>
                        </Flex>
                        <Flex className="w-full" justify="space-between" align="center">
                            <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                                Status:
                            </Typography.Text>
                            <Flex
                                className={`text-sm p-1 px-4 rounded-md font-medium border ${
                                    status.toLowerCase() === 'failure'
                                        ? 'text-red-400 border-red-400'
                                        : 'text-green-400 border-green-400'
                                }`}
                            >
                                {status}
                            </Flex>
                        </Flex>
                    </>
                )}
            </Flex>
        </Card>
    );
};

export default EmployeeSalaryCardMobile;
