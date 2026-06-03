import React from 'react';

import { Col, Flex, Image, Row, Skeleton, Tabs, TabsProps, Typography, Grid, Empty } from 'antd';
import { useParams } from 'react-router-dom';

import '../styles/Style.css';

import AboutTab from '../components/AboutTab';
import BuyForm from '../components/BuyForm';
import GiftCard from '../components/GiftCard';
import GiftCardSmall from '../components/GiftCardSmall';
import HowToUseTab from '../components/HowToUseTab';
import GetGiftDetails from '../hooks/useGiftDetailsApi';

const { useBreakpoint } = Grid;

const Details = () => {
    const { id } = useParams();

    let data;
    let isLoading;
    if (id) {
        ({ data, isLoading } = GetGiftDetails(id));
    }

    const screens = useBreakpoint();

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'About this Gift Card',
            children: isLoading ? (
                <Skeleton active />
            ) : (
                <AboutTab
                    text={
                        data?.mainGiftCard.description ||
                        'No description available for this gift card'
                    }
                />
            ),
        },
        {
            key: '2',
            label: 'Terms & Conditions',
            children: isLoading ? (
                <Skeleton active />
            ) : (
                <HowToUseTab
                    text={
                        data?.mainGiftCard.redemption_instructions ||
                        'Terms and Conditions not available'
                    }
                />
            ),
        },
    ];

    return (
        <Row className="xs:mt-6 sm:mt-0">
            <Col xs={24}>
                <Flex className="flex-col md:flex-row ">
                    <Flex vertical gap={20}>
                        {/* {isLoading ? ( // Render loader if loading
                            // <Skeleton paragraph={{ rows: 3 }} />
                            <Skeleton.Image style={{ width: '24rem', height: '16rem' }} />
                        ) : (
                            <Image
                                preview={false}
                                src={data?.mainGiftCard.image}
                                style={{
                                    borderRadius: ' 0.625rem 0.625rem 0.625rem 0.625rem ',
                                    width: '24rem',
                                }}
                            />
                        )} */}

                        {isLoading ? (
                            <Skeleton.Image
                                style={{ width: '24rem', height: '16rem', borderRadius: '.75rem' }}
                            />
                        ) : (
                            (data?.mainGiftCard.image && (
                                <Image
                                    preview={false}
                                    src={data?.mainGiftCard.image}
                                    style={{
                                        borderRadius: '0.625rem', // Consistent rounded corners
                                        width: screens.lg ? '24rem' : '100%', // Width based on screen size
                                        height: '15rem',
                                        objectFit: 'cover', // Ensure the image fills the container without distortion
                                    }}
                                />
                            )) || (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_DEFAULT}
                                    style={{
                                        width: '24rem',
                                        height: '16rem',
                                        backgroundColor: '#f1f1f1',
                                        display: 'flex', // Use flexbox
                                        flexDirection: 'column', // Arrange content vertically
                                        justifyContent: 'center', // Align content vertically to center
                                        alignItems: 'center', //
                                    }}
                                    description={
                                        <Typography.Paragraph
                                            style={{ textAlign: 'center', margin: 0 }}
                                            type="secondary"
                                        >
                                            No preview available
                                        </Typography.Paragraph>
                                    }
                                />
                            )
                        )}
                    </Flex>

                    <BuyForm productData={data} key={id} />
                </Flex>
            </Col>
            <Col xs={24} className="mt-5 md:mt-10">
                <Tabs defaultActiveKey="1" items={items} />
            </Col>

            <Row className="mt-8 overflow-x-auto">
                {(data?.relatedGiftCards?.length ?? 0) > 0 && (
                    <>
                        <Typography.Title className="w-full" level={5}>
                            You may also like
                        </Typography.Title>
                        <Flex
                            // className="flex mt-5 space-x-8"
                            className={
                                screens.xs
                                    ? 'flex xs:mt-1 space-x-3'
                                    : 'flex mt-5  space-x-8 overflow-x-auto'
                            }
                            id="scrollbar"
                            style={{
                                overflowX: 'auto',
                                WebkitOverflowScrolling: 'touch',

                                scrollbarWidth: 'thin', // For Firefox

                                scrollbarColor: 'rgba(0, 0, 0, 0.02) transparent',
                                // scrollbarColor: 'transparent transparent'
                            }}
                        >
                            {data?.relatedGiftCards.map((item, i) => (
                                <Col xs={12} sm={8} md={6} xl={4} key={i}>
                                    {screens.xs ? ( // Check if extra small screen
                                        <GiftCardSmall
                                            image={item.image}
                                            name={item.name}
                                            description={item.description}
                                            id={item.id}
                                        />
                                    ) : (
                                        <GiftCard
                                            image={item.image}
                                            name={item.name}
                                            description={item.description}
                                            id={item.id}
                                        />
                                    )}
                                </Col>
                            ))}
                        </Flex>
                    </>
                )}
            </Row>
        </Row>
    );
};

export default Details;
