import React from 'react';

import { Flex, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

interface IconCardProps {
    icon: any;
    title: string;
    onClick?: () => void;
}

const IconCard: React.FC<IconCardProps> = ({ icon, title, onClick }) => (
    <Flex
        vertical
        gap={18}
        align="center"
        role="button"
        onClick={onClick}
        className="transition duration-300 transform cursor-pointer hover:scale-110"
    >
        <Flex
            className=" min-w-[5.6rem] xxl:min-w-24 h-24 xxl:h-24 bg-bgIconCard rounded-3xl"
            align="center"
            justify="center"
        >
            <ReactSVG data-testid="icon-svg" src={icon} />
        </Flex>
        <Typography.Text className="text-sm text-center">{title}</Typography.Text>
    </Flex>
);

export default IconCard;
