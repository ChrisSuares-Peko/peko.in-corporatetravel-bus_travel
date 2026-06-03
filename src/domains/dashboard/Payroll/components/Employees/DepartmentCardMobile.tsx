import React, { useState } from 'react';

import { Card, Typography, Flex } from 'antd';

import { departmentTableData } from '../../types/departmentTypes/departmentTypes';

const DepartmentcardMobile: React.FC<departmentTableData> = ({
    name,
    code,
    description,
    key,
    date,
    id,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card
            size="small"
            className="mt-4 h-50 bg-slate-50 border-none p-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Flex className="w-full" gap={5} vertical>
                <Flex className="w-full" justify="space-between" align="center">
                    <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                        Department
                    </Typography.Text>
                    <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                        {name}
                    </Typography.Text>
                </Flex>
                <Flex className="w-full" justify="space-between" align="center">
                    <Typography.Text className="text-base font-medium  text-gray-500 line-clamp-1">
                        Code
                    </Typography.Text>
                    <Typography.Text className="font-normal text-center text-gray-500 line-clamp-1">
                        {code || 'N/A'}
                    </Typography.Text>
                </Flex>

                <Flex className="w-full" justify="space-between" align="center">
                    <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                        Description
                    </Typography.Text>
                    <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                        {description || 'N/A'}
                    </Typography.Text>
                </Flex>

                <Flex className="w-full" justify="space-between" align="center">
                    <Typography.Text className="text-base font-medium text-gray-500 line-clamp-1">
                        Date:
                    </Typography.Text>
                    <Typography.Text className="font-normal text-center text-textDarkGray line-clamp-1">
                        {date}
                    </Typography.Text>
                </Flex>
            </Flex>
        </Card>
    );
};

export default DepartmentcardMobile;
