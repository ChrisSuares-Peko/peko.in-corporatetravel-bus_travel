import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Card, Col, Flex, Image, Input, Row, Typography } from 'antd';

import image2 from '../assets/data1.png';
import image1 from '../assets/data2.png';
import NewsLists from '../components/NewsLists';
import { newsList } from '../utils/data';

const News = () => (
    <>
        <Row>
            <Col xs={12} sm={12} md={20}>
                {/* <Typography.Paragraph>{count} Softwares</Typography.Paragraph> */}
            </Col>
            <Col xs={0} sm={0} md={4} lg={4} xl={4}>
                <Input
                    placeholder="Search"
                    suffix={<SearchOutlined />}
                    allowClear
                    type="text"
                    maxLength={100}
                    className="text-[.8rem] sm:text-[.9rem]"
                />
            </Col>
        </Row>
        <Row gutter={10}>
            <Col span={18}>
                <Card className="card-style xs:bg-white mt-6 md:bg-white  border-2 rounded-md">
                    <Flex vertical gap={10}>
                        <Flex
                            className="w-full rounded-2xl sm:rounded-3xl object-contain "
                            align="center"
                            justify="center"
                        >
                            <Image src={image1} width="100%" height="100%" />
                        </Flex>
                        <Typography.Text className="mt-3 md:text-base font-medium">
                            Opening Day of Boating Season, Seattle WA Opening Day of Boating Season,
                            Seattle WA
                        </Typography.Text>
                        <Typography.Text className="text-xs font-thin text-start  line-clamp-2">
                            Of course the Puget Sound is very watery, and where there is water,
                            there are boats. Today is the Grand Opening of Boating Season when
                            traffic gets stalled in the University District (UW) while the Montlake
                            Bridge
                        </Typography.Text>
                    </Flex>
                </Card>
            </Col>
            <Col span={6}>
                <Card className="card-style xs:bg-white mt-6 md:bg-white  border-2 rounded-md">
                    <Flex vertical gap={10}>
                        <Flex
                            className="w-full rounded-2xl sm:rounded-3xl object-contain "
                            align="center"
                            justify="center"
                        >
                            <Image src={image2} width="100%" height="100%" />
                        </Flex>
                        <Typography.Text className="mt-3 md:text-base font-medium line-clamp-1">
                            How to build a self-driving car in one month
                        </Typography.Text>
                        <Typography.Text className="text-xs font-thin text-start line-clamp-2">
                            Can I learn the necessary computer science to build the software part of
                            a self-driving car in
                        </Typography.Text>
                    </Flex>
                </Card>
            </Col>
        </Row>
        <Row gutter={10}>
            {newsList.map((item, i) => (
                <Col span={6}>
                    <NewsLists image={item.image} name={item.name} desc={item.description} />
                </Col>
            ))}
        </Row>
    </>
);

export default News;
