import React from 'react';

import { Card, Col, Flex, Grid, Radio, Row, Typography } from 'antd';

interface FareData {
    id: string;
    fareType: string;
    price: string;
    airport: string;
}

interface FareListProps {
    fareList: FareData[];
}

const { useBreakpoint } = Grid;

const FareList: React.FC<FareListProps> = ({ fareList }) => {
    const screens = useBreakpoint();
    const { Text, Paragraph } = Typography;
    return (
        <Row className="my-5" gutter={screens.xs ? [10, 10] : [20, 30]}>
            {fareList.map(fare => (
                <Col key={fare.id} xs={12} sm={24} md={12} xl={8}>
                    <Card
                        bodyStyle={{ padding: `${screens.xs ? '0.8rem' : '1.6rem'}`, border: '0' }}
                        className={`${screens.xs ? 'rounded-sm border-1 border-gray-200' : 'rounded-xl border-2 border-gray-200'} h-full`}
                    >
                        <Flex justify="space-between">
                            <Text
                                className={`text-gray-400 ${screens.xs ? 'text-xs' : 'text-base'} font-normal`}
                            >
                                {fare.fareType}
                            </Text>
                            <Radio />
                        </Flex>
                        <Paragraph
                            className={`${screens.xs ? 'font-bold text-lg' : 'font-bold text-2xl mt-2'} `}
                        >
                            AED {fare.price}
                        </Paragraph>
                        <Paragraph
                            className={`${screens.xs ? 'text-xs' : 'text-sm mt-5'} font-light line-clamp-3`}
                        >
                            {fare.airport}
                        </Paragraph>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default FareList;
