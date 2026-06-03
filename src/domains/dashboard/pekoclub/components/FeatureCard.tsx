import React from 'react';

import { Flex, Grid, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

interface IconCardProps {
    icon: string;
    title: string;
}

const FeatureCard = ({ icon, title }: IconCardProps) => {
    const screens = Grid.useBreakpoint();
    return (
        <Link to="">
            <Flex vertical align="center">
                <Flex
                    vertical
                    align="center"
                    className="transition duration-300 transform cursor-pointer hover:scale-105"
                >
                    <Flex
                        className={`w-16 h-16 sm:w-[6.75rem] sm:h-28 bg-bgIconCard rounded-2xl sm:rounded-3xl `}
                        align="center"
                        justify="center"
                    >
                        <ReactSVG
                            className="more-services"
                            beforeInjection={svg => {
                                if (screens.xs) {
                                    svg.setAttribute('style', 'width: 20px; height: 20px;');
                                }
                            }}
                            src={icon}
                        />
                    </Flex>
                    <Typography.Text className="text-[.65rem] text-center sm:text-[0.875rem] min-h-9 sm:min-h-14 line-clamp-2 pt-1 sm:pt-3">
                        {title}
                    </Typography.Text>
                </Flex>
            </Flex>
        </Link>
    );
};

export default FeatureCard;
