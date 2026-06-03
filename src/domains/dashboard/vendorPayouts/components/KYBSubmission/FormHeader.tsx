import type { FC } from 'react';

import { Flex, Typography } from 'antd';

interface FormHeaderProps {
    title: string;
}

const FormHeader: FC<FormHeaderProps> = ({ title }) => (
    <Flex justify="space-between">
        <Typography.Paragraph className=" text-base font-medium ">{title}</Typography.Paragraph>
        <Typography.Paragraph className=" text-base font-medium ">
            Address and Other Information
        </Typography.Paragraph>
    </Flex>
);

export default FormHeader;
