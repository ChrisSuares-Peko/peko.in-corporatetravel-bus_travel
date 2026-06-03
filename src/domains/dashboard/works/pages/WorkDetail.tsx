import React from 'react';

import { Carousel, Col, Empty, Flex, Image, Row, Skeleton, Typography, theme } from 'antd';
import { Link, useParams } from 'react-router-dom';

import useScreenSize from '@src/hooks/useScreenSize';

import headset from '../assets/svg/headset.svg';
import PlanCard from '../components/PlanCard';
import { useDetailsApi } from '../hooks/useDetailsApi';
import { usePlansApi } from '../hooks/usePlansApi';

const WorkDetail = () => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const { id } = useParams();
    const { data, isLoading } = useDetailsApi(id);
    const { data: plansData, isLoading: isPlansLoading } = usePlansApi(id);
    const { md, lg, xl } = useScreenSize();
    const slidesToShow = data?.portfolio.length;

    return (
        <Flex vertical gap={30} className="">
            {data?.description && !isLoading ? (
                <>
                    <Typography.Title level={4}>{data?.name}</Typography.Title>
                    <Typography.Text>{data?.description}</Typography.Text>
                </>
            ) : (
                <Skeleton active avatar loading={isLoading} />
            )}

            {data?.portfolio && !isLoading ? (
                <>
                    <Typography.Title level={4}>Portfolios</Typography.Title>

                    <Carousel
                        autoplay
                        infinite
                        autoplaySpeed={2500}
                        speed={2000}
                        dotPosition="bottom"
                        dots={{ className: 'custom-slick-dots-works' }}
                        //   responsive={responsiveSettings}
                        slidesToShow={slidesToShow}
                    >
                        {Array.isArray(data?.portfolio) ? (
                            data.portfolio.map((imageObj, index) => {
                                const key: any = Object.keys(imageObj)[0];
                                const imageUrl = imageObj[key];
                                if (imageUrl !== '') {
                                    return (
                                        <div key={index} className="px-3 items-center">
                                            <img
                                                src={imageUrl}
                                                alt={`Portfolio img ${index + 1}`}
                                                className="rounded-xl object-cover"
                                                style={{ height: '170px', width: '100%' }}
                                            />
                                        </div>
                                    );
                                }
                                return null; // Return null if the key is an empty string
                            })
                        ) : (
                            <></>
                        )}
                    </Carousel>
                </>
            ) : (
                <Skeleton active avatar loading={isLoading} />
            )}

            <Typography.Title level={4}>Choose a Plan</Typography.Title>
            <Row justify="center" gutter={[20, 20]} className="lg:px-11 xl:px-16 xxl:px-40">
                {!isPlansLoading
                    ? plansData.map((value, index) => (
                          <PlanCard
                              key={index}
                              planId={value.id}
                              planName={value.name}
                              billingCycle={value.billingCycle}
                              description={value.description}
                              price={Number(value.price).toFixed(2)}
                              feature={value.features}
                              workId={id}
                              isPopular={value.popular}
                          />
                      ))
                    : Array.from({ length: 3 }).map((_, index) => (
                          <Col xs={24} sm={12} md={10} lg={11} xl={7} key={index}>
                              <Skeleton active avatar className="h-60 w-60" />
                          </Col>
                      ))}
                {!isPlansLoading && plansData.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span>No plans available</span>}
                    />
                ) : (
                    <></>
                )}
            </Row>
            <Flex align="center" justify="center" gap={10}>
                <Image src={headset} preview={false} height={25} />
                <Typography.Text className="text-base font-medium">
                    For Custom Services
                </Typography.Text>
                <Link to="/need-help">
                    <Typography.Text className="cursor-pointer hover:underline text-base text-bgOrange2">
                        Contact Sales
                    </Typography.Text>
                </Link>
            </Flex>
        </Flex>
    );
};
export default WorkDetail;
