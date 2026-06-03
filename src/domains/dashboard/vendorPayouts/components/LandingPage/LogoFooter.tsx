import React from 'react';

import { Col, Typography, Grid, Image, Flex } from 'antd';

import instantCash from '../../assets/instantCashSVG.svg';

const { useBreakpoint } = Grid;
const { Text } = Typography;

const LogoFooter = () => {
    const screens = useBreakpoint();
    const imageHeight = screens.md ? 60 : 50;
    const imageWidth = screens.md ? 160 : 130;

    return (
        <Col className="text-center">
            <Text className="text-black text-[12px] md:text-[10px]">Powered By</Text>
            <Flex className="flex justify-center items-center">
                <Image height={imageHeight} width={imageWidth} src={instantCash} preview={false} />
            </Flex>
        </Col>
    );
};

export default LogoFooter;
