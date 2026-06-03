import { Card, Empty, Flex, Grid, Image, Tag, Tooltip, Typography } from 'antd';
import clevertap from 'clevertap-web-sdk';
import { useNavigate } from 'react-router-dom';

import { CardProps } from '@domains/dashboard/Subscriptions/types/types';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import '../../assets/styles/styles.css';

const { useBreakpoint } = Grid;
const OfferCard = ({ title, discount, description, image, id }: CardProps) => {
    const screens = useBreakpoint();
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

    const placement = screens.sm ? undefined : 'start';
    return (
        <Card
            className="relative transform border cursor-pointer xs:bg-white md:bg-white rounded-xl _scale_on_hover"
            onClick={() => handleClick(title)}
            style={{
                transition: 'transform .3s ease-in-out',
            }}
        >
            <Tag
                color="#29BD11"
                className="absolute top-[-10px] left-1/2 transform -translate-x-1/2"
            >
                Up to {discount}
            </Tag>
            {/* <Link to={`${paths.subscriptions.details}/${id}`}> */}
            <Flex vertical gap={10} align="center">
                {image !== '' ? (
                    <>
                        <Flex
                            className={` w-24 sm:w-20 md:h-28 xs:h-24 rounded-2xl sm:rounded-3xl`}
                            align="center"
                            justify="center"
                        >
                            <Image preview={false} src={image} width="90%" alt={title} />
                        </Flex>
                        <Typography.Text className="mt-0 font-medium md:mt-3 md:text-lg line-clamp-1">
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
                                // style={{marginBlock:'0px', width:"70%"}}
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

                        <Typography.Text className="font-medium md:-mt-3 xs:mt-1 md:text-lg line-clamp-1">
                            <Tooltip title={screens.md ? '' : title}>{title}</Tooltip>
                        </Typography.Text>
                    </>
                )}

                <Typography.Text className="md:text-[.75rem] xxl:text-sm text-center text-textGrey line-clamp-1">
                    {description}
                </Typography.Text>
            </Flex>
            {/* </Link> */}
        </Card>
    );
};

export default OfferCard;
