import React, { useState } from 'react';

import { Flex, Image, Typography, Empty, Skeleton } from 'antd';
import { Link } from 'react-router-dom';

import giftCardDefault from '@domains/dashboard/GiftCards/assets/images/giftCardDefault.png';
import { paths } from '@src/routes/paths';

interface GiftCardProps {
    id?: number;
    image?: string;
    name?: string;
    description?: string;
    loaded?: boolean;
}

const GiftCard: React.FC<GiftCardProps> = ({ id, image, name, description, loaded }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    return (
        <Flex className="items-center justify-center md:justify-start md:items-start">
            <Link to={`/${paths.giftcards.index}/${paths.giftcards.details}/${id}`}>
                <Flex
                    align="center"
                    className={`w-full min-h-52 rounded-2xl sm:rounded-3xl mb-3 transition-transform ${
                        isHovered ? 'transform scale-105' : ''
                    }`}
                    style={{
                        transition: 'transform .3s ease-in-out', // Adjust the duration (0.5s) to change animation speed
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {image ? (
                        <Image
                            preview={false}
                            src={image}
                            loading="lazy"
                            onLoad={handleImageLoad}
                            // eslint-disable-next-line no-return-assign
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
                                ((e.target as HTMLImageElement).src = giftCardDefault)
                            }
                            style={{
                                width: '100%',
                                aspectRatio: '16/9', // Maintain a 16:9 aspect ratio for consistency
                                objectFit: 'cover', // Cover the container while maintaining aspect ratio
                                borderRadius: '0.625rem', // Rounded corners
                            }}
                        />
                    ) : (
                        <Flex className="items-center justify-center w-full h-full text-center">
                            <Empty
                                className="w-full"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={<span>No Preview Available</span>}
                            />
                        </Flex>
                    )}
                    {/* {isLoading && loaded && <Skeleton.Avatar active size={200} shape="square" />} */}
                    {image && isLoading && loaded && (
                        <Skeleton.Image active style={{ width: '15rem', aspectRatio: '16/9' }} />
                    )}
                </Flex>

                <Typography.Title
                    level={5}
                    className=" text-neutral-900 text-[1.3rem] font-medium line-clamp-1 h-6"
                >
                    {name}
                </Typography.Title>
                <Typography.Text className="h-4 text-xs font-normal text-zinc-600 line-clamp-1">
                    {description}
                </Typography.Text>
            </Link>
        </Flex>
    );
};

export default GiftCard;
