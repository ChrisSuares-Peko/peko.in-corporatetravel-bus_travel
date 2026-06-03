import React, { useState } from 'react';

import { DeleteOutlined, DownOutlined, EditOutlined, RightOutlined } from '@ant-design/icons';
import { Card, Divider, Typography, Flex, Button } from 'antd';

import { reimbursementTableType } from '../../types/salaryProfileTypes/ReimbursementTypes';

const ReimbursementCard: React.FC<
    reimbursementTableType & {
        handleDelete: (id: reimbursementTableType) => void;
        handleEdit: (id: reimbursementTableType) => void;
    }
> = ({
    employeeId,
    action,
    amountPaid,
    employeeName,
    expenseDate,
    transferMethod,

    expenseDetails,
    supportingDocs,
    id,
    invoice,
    managerEmail,
    status,
    handleDelete,
    handleEdit,
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
                    <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                        Employee Name:
                    </Typography.Text>
                    <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                        {employeeName}
                    </Typography.Text>
                </Flex>

                <Flex className="w-full" justify="space-between" align="center">
                    <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                        Expense Date
                    </Typography.Text>
                    <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                        {expenseDate}
                    </Typography.Text>
                </Flex>
                <Flex className="w-full" justify="space-between" align="center">
                    <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                        Expense Details:
                    </Typography.Text>
                    <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                        {expenseDetails}
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
                                Amount Paid:
                            </Typography.Text>
                            <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                                {amountPaid}
                            </Typography.Text>
                        </Flex>

                        <Flex className="w-full" justify="space-between" align="center">
                            <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                                Status:
                            </Typography.Text>
                            <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                                {status}
                            </Typography.Text>
                        </Flex>

                        <Flex className="w-full" justify="space-between" align="center">
                            <Button
                                type="text"
                                icon={<EditOutlined className="text-[#E30000]" />}
                                onClick={() =>
                                    handleEdit({
                                        employeeId,
                                        employeeName,
                                        expenseDate,
                                        expenseDetails,
                                        amountPaid,
                                        status,
                                        invoice,
                                        supportingDocs,
                                        id,
                                        transferMethod,
                                        action,
                                        managerEmail,
                                    })
                                }
                            >
                                Edit
                            </Button>
                            <Button
                                type="text"
                                icon={<DeleteOutlined className="text-[#E30000]" />}
                                onClick={() =>
                                    handleDelete({
                                        employeeId,
                                        employeeName,
                                        expenseDate,
                                        expenseDetails,
                                        amountPaid,
                                        status,
                                        invoice,
                                        supportingDocs,
                                        id,
                                        transferMethod,
                                        action,
                                        managerEmail,
                                    })
                                }
                            >
                                Delete
                            </Button>
                        </Flex>
                    </>
                )}
            </Flex>
        </Card>
    );
};

export default ReimbursementCard;
