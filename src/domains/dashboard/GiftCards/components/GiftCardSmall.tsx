import React from 'react';

import { Flex, Image, Typography } from 'antd';
import { Link } from 'react-router-dom';

import useHideWidgetOnDrawer from '@components/molecular/freshChat/hooks/useHideWidgetOnDrawer';
import { paths } from '@src/routes/paths';

interface GiftCardProps {
    id?: number;
    image?: string;
    name?: string;
    description?: string;
}

const GiftCardSmall: React.FC<GiftCardProps> = ({ id, image, name, description }) => {
    useHideWidgetOnDrawer(true);
    return (
        <Flex className="items-center justify-center my-1 md:justify-start md:items-start" gap={0}>
            <Link to={`/${paths.giftcards.index}/${paths.giftcards.details}/${id}`}>
                <Image preview={false} src={image} className="rounded-lg" />
                <Flex vertical className="">
                    <Typography className="text-sm font-semibold text-neutral-900 line-clamp-1">
                        {name}
                    </Typography>
                    <Typography.Text className="text-xs font-normal text-zinc-600 line-clamp-1">
                        {description}
                    </Typography.Text>
                </Flex>
            </Link>
        </Flex>
    );
};

export default GiftCardSmall;
