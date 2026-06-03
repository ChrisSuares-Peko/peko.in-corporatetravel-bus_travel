import { Card, Flex, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import { InfoCardProps } from '@domains/dashboard/accounting/types/types';

const InfoCard = ({ bgColor, icon, title, value }: InfoCardProps) => (
    <Card
        className={` ${bgColor} md:rounded-2xl xs:rounded-none drop-shadow-none shadow-none xs:border-2 md:border-0 `}
    >
        <Flex gap={20} align="center" justify="start">
            <Flex
                className="w-10 h-10 xs:bg-red-50 md:bg-white rounded-full"
                align="center"
                justify="center"
            >
                <ReactSVG className="fill-white" src={icon} />
            </Flex>
            <Flex vertical gap={10}>
                <Typography.Text className=" text-xs ">{title}</Typography.Text>
                <Typography.Title level={4}>{value}</Typography.Title>
            </Flex>
        </Flex>
    </Card>
);

export default InfoCard;
