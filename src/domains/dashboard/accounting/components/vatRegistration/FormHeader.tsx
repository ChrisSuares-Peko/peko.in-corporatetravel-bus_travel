import type { FC } from 'react';

import { Flex, Typography } from 'antd';

interface FormHeaderProps {
    step: string;
    title: string;
}

const FormHeader: FC<FormHeaderProps> = ({ step, title }) => (
    <Flex vertical gap={8}>
        <Typography.Paragraph className="text-neutral-600 text-sm font-light ">
            Step {step}
        </Typography.Paragraph>
        <Typography.Paragraph className=" text-base font-medium ">{title}</Typography.Paragraph>
    </Flex>
);

export default FormHeader;
