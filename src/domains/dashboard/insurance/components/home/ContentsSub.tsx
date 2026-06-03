import React from 'react';

import { Row, Col, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import useScreenSize from '@src/hooks/useScreenSize';

import { insuranceItems } from '../../utils/data';

const ContentsSub = () => {
    const screens = useScreenSize();
    const svgClass = screens.sm ? 'w-12 h-12' : 'w-12 h-12';
    const gapClass = screens.sm ? 'gap-6' : 'gap-2';

    return (
        <Row justify="center" className="w-full sm:w-3/4" gutter={[15, 50]}>
            {insuranceItems.map((item, index) => (
                <Col key={index} span={6} className={`flex flex-col items-center ${gapClass}`}>
                    <ReactSVG
                        src={item.src}
                        beforeInjection={svg => {
                            svg.setAttribute('class', svgClass);
                        }}
                    />
                    <Typography.Text className="text-center text-[8.3px] sm:text-sm">
                        {item.text}
                    </Typography.Text>
                </Col>
            ))}
        </Row>
    );
};

export default ContentsSub;
