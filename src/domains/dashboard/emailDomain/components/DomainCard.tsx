import React from 'react';

import { Card, Flex, Image, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

interface cardProps {
    name: string;
    image: string;
    offersText: string;
    productId: number;
}
const DomainCard = ({ image, name, offersText, productId }: cardProps) => {
    const navigate = useNavigate();
    return (
        <>
            <Card
                onClick={() => {
                    navigate(`${paths.dashboard.emailDomain}/${paths.emailDomain.detailsPage}`, {
                        state: { productId },
                    });
                }}
                className="relative flex flex-col items-center justify-center border-gray-400 rounded-md cursor-pointer h-52 xs:bg-white md:bg-white _scale_on_hover"
                style={{
                    transition: 'transform .3s ease-in-out',
                }}
            >
                <Flex vertical gap={10} align="center" justify="center" className="w-full h-full">
                    <Flex
                        className="w-28 sm:w-36 md:w-36 lg:w-28 h-28 sm:h-32 md:h-32 lg:h-32 rounded-2xl sm:rounded-3xl"
                        align="center"
                        justify="center"
                    >
                        <Image preview={false} src={image} width="100%" />
                    </Flex>
                </Flex>
            </Card>
            <Typography.Text className="md:text-[1rem] text-red-400 mt-2 line-clamp-1 font-normal">
                {name}
            </Typography.Text>
            <Typography.Text className="md:text-[.75rem] xxl:text-sm mt-2 text-textGrey line-clamp-1">
                {offersText}
            </Typography.Text>
        </>
    );
};

export default DomainCard;
