import React from 'react';

import { Card, Empty, Flex, Grid, Image, Tooltip, Typography } from 'antd';
import clevertap from 'clevertap-web-sdk';
import { useNavigate } from 'react-router-dom';

import { CardProps } from '@domains/dashboard/Subscriptions/types/types';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

const OfferLessCard = ({ title, description, image, id }: CardProps) => {
    const screens = Grid.useBreakpoint();
    const navigate = useNavigate();
    const { user } = useAppSelector(state => state.reducer.user);
    const handleClick = (name: string) => {
        clevertap.event.push('Softwares', {
            Page: 'Softwares',
            Action: `${name} clicked`,
            // Action:'softwares clicked',
            Email: user?.email,
            SubscriptionName: name,
        });
        navigate(`/${paths.subscriptions.index}/${paths.subscriptions.details}/${id}`);
    };
    return (
        <Card
            className="xs:bg-white md:bg-white  border rounded-xl transform cursor-pointer hover:scale-105"
            onClick={() => handleClick(title)}
            style={{
                transition: 'transform .3s ease-in-out', // Adjust the duration (0.5s) to change animation speed
            }}
        >
            {/* <Link to={`/${paths.subscriptions.index}/${paths.subscriptions.details}/${id}`}> */}
            <Flex vertical gap={10} align="center">
                {image !== '' ? (
                    <>
                        <Flex
                            className={` w-24 sm:w-20 md:h-28 xs:h-24 rounded-2xl sm:rounded-3xl`}
                            align="center"
                            justify="center"
                        >
                            <Image preview={false} src={image} width="70%" />
                        </Flex>
                        <Typography.Text className="md:mt-3 mt-0  md:text-lg  line-clamp-1 font-medium">
                            <Tooltip title={screens.md ? '' : title}>{title}</Tooltip>
                        </Typography.Text>
                    </>
                ) : (
                    <>
                        {screens.md ? (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <span className="xs:text-xs md:text-sm">
                                        No Preview Available
                                    </span>
                                }
                            />
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                style={{
                                    marginBlock: screens.xs ? '1px' : '10px',
                                    width: '70%',
                                }}
                                description={
                                    <span className="xs:text-xs md:text-sm">
                                        No Preview Available
                                    </span>
                                }
                            />
                        )}

                        <Typography.Text className="md:-mt-3 xs:mt-1 md:text-lg  line-clamp-1 font-medium">
                            <Tooltip title={screens.md ? '' : title}>{title}</Tooltip>
                        </Typography.Text>
                    </>
                )}

                <Typography.Text className="md:text-[.75rem] xxl:text-sm text-center text-textGrey line-clamp-1 ">
                    {description}
                </Typography.Text>
            </Flex>
            {/* </Link> */}
        </Card>
    );
};

export default OfferLessCard;
