import React from 'react';

import { Col, Flex, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import useScreenSize from '@src/hooks/useScreenSize';

import PolicyBazarSVG from '../../assets/icons/policybazar.svg';

type Props = {};

const Footer = (props: Props) => {
    const screens = useScreenSize();
    return (
        <Col span={24}>
            <Flex
                gap={screens.xs ? 5 : 10}
                justify="center"
                align="center"
                className="w-full lg:mt-2"
                vertical
            >
                <Typography.Text className="xs:text-sm md:text-xl">Powered by</Typography.Text>
                <ReactSVG
                    src={PolicyBazarSVG}
                    beforeInjection={svg => {
                        if (screens.xs) {
                            svg.setAttribute('style', 'width: 300px; height: 30px;');
                        }
                    }}
                />
            </Flex>
        </Col>
    );
};

export default Footer;
