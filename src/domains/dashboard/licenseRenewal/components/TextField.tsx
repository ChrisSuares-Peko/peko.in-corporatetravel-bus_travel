import { FC } from 'react';

import { Col, Flex } from 'antd';

interface TextFieldProps {
    title: string;
    value: string | number;
    className?: string;
}

const TextField: FC<TextFieldProps> = ({ title, value, className }) => (
    <Col xs={24} sm={12} md={6}>
        <Flex className="sm:block justify-between">
            <Flex className="sm:text-zinc-500 text-black text-sm font-normal leading-snug py-2">
                {title}:
            </Flex>
            <Flex className={`${className} text-opacity-90 text-sm font-normal py-2 leading-snug`}>
                {value}
            </Flex>
        </Flex>
    </Col>
);

export default TextField;
