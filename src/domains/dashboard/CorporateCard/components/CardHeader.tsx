import React from 'react';

import { Col, Flex, Grid, Image, Row, Typography } from 'antd';

import CardList from './CardList';
import corporateCard from '../assets/corporatecard.png';
import { cardData } from '../utils/data';

const CardHeader = () => {
    const screens = Grid.useBreakpoint();
    return (
        <Row className="w-full mt-5">
            <Col span={18}>
                <Flex className="w-3/4">
                    <Typography.Text className=" text-3xl ">
                        Simplify Your Finances with a Swipe.
                    </Typography.Text>
                </Flex>
                <Typography.Paragraph className=" mt-6 text-lg leading-9 w-3/4 text-textGrey mb-5">
                    Manage Your Financial Tasks Hassle-Free From Sales Trips to Monthly AWS Bills,
                    We&apos;ve Got You Covered!
                </Typography.Paragraph>
                <Row gutter={[35, 35]} className="mt-24">
                    {cardData.map((item, index) => (
                        <Col key={index} xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
                            <CardList
                                icon={item.image}
                                title={item.title}
                                desc={item.description}
                            />
                        </Col>
                    ))}
                </Row>
            </Col>
            <Col span={6} style={{ position: 'relative' }}>
                <div
                    style={{
                        position: 'absolute',
                        top: '25%',
                        left: '-5%',
                        width: '80px',
                        height: '80px',
                        paddingBottom: '15%',
                        borderRadius: '50%',
                        backgroundColor: '#FFF6F6',
                        zIndex: 0,
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        top: '-5%',
                        left: '45%',
                        width: '150px',
                        height: '150px',
                        paddingBottom: '25%',
                        borderRadius: '50%',
                        backgroundColor: '#FFF6F6',
                        zIndex: 0,
                    }}
                />

                {/* {
  screens.xxl?(
    <div style={{ position: 'absolute', top: '68%', left: '50%', width: '80px',height:'80px', paddingBottom: '10%', borderRadius: '50%', backgroundColor: '#FFF6F6', zIndex: 0 }} />
 
  ):(
    <div style={{ position: 'absolute', top: '58%', left: '50%', width: '80px',height:'80px', paddingBottom: '10%', borderRadius: '50%', backgroundColor: '#FFF6F6', zIndex: 0 }} />
  
  )
}       */}
                <Image
                    src={corporateCard}
                    preview={false}
                    style={{ width: '380px' }}
                    className="justify-end"
                />
                {/* Additional styling if needed */}
            </Col>
        </Row>
    );
};
export default CardHeader;
