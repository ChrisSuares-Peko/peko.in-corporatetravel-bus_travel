import React from 'react';

import { Col, Row, Grid, Typography, Flex } from 'antd';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { featureRow } from '../../utils/data';

const FeaturesCard = () => {
    const screens = Grid.useBreakpoint();

    return (
        <Row gutter={[24, 20]} className="justify-center items-center md:ml-4">
            {featureRow.map((item, i) => (
                <Col key={i} span={12} sm={12} lg={12} xl={12}>
                    <Link to={item.link}>
                        <Flex className="flex flex-col items-center w-full md:ml-4  bg-bgIconCard rounded-2xl sm:rounded-3xl transition duration-300 transform cursor-pointer hover:scale-105">
                            <Flex className="flex flex-col items-center h-32 sm:h-40 md:h-36 lg:w-[10rem] lg:h-36 xl:h-60 w-full justify-center">
                                <ReactSVG
                                    className="more-services"
                                    beforeInjection={svg => {
                                        if (screens.xs) {
                                            svg.setAttribute('style', 'width: 50px; height: 50px;');
                                        } else if (screens.xl) {
                                            svg.setAttribute('style', 'width: 90px; height: 90px;');
                                        } else if (screens.md) {
                                            svg.setAttribute('style', 'width: 70px; height: 70px;');
                                        }
                                    }}
                                    src={item.image}
                                />
                                <Typography.Text className="text-[.65rem] text-center sm:text-[.975rem] min-h-9 sm:min-h-14 line-clamp-2 pt-1 sm:pt-3">
                                    {item.title}
                                </Typography.Text>
                            </Flex>
                        </Flex>
                    </Link>
                </Col>
            ))}
        </Row>
    );
};

export default FeaturesCard;
