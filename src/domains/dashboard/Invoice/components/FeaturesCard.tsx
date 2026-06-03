import React from 'react';

import { Flex, Grid, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { showToast } from '@src/slices/apiSlice';

interface IconCardProps {
    icon: string;
    title: string;
    path?: any;
    kybStatus?: 'PENDING' | 'INITIATED' | 'DOCUMENT UPLOADED' | 'APPROVED' | 'REJECTED';
}

const FeaturesCard = ({ icon, title, path, kybStatus }: IconCardProps) => {
    const screens = Grid.useBreakpoint();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = async (e: React.MouseEvent) => {
        if (title === 'Payment Links' && kybStatus !== 'APPROVED') {
            dispatch(
                showToast({
                    description:
                        'To access payment links, Please complete your KYB verification first.',
                    variant: 'error',
                })
            );
            return;
        }
        navigate(path);
    };
    return (
        <Flex
            onClick={handleClick}
            vertical
            // align="center"
            className="w-full md:h-56 xl:h-56 bg-bgIconCard rounded-2xl sm:rounded-3xl transition duration-300 transform cursor-pointer hover:scale-105 mt-2"
        >
            <Flex vertical justify="center" align="center" className="xs:mt-2 md:mt-12 xl:mt-0">
                <Flex
                    // className={`w-[9.2rem] h-32 sm:w-[13rem] sm:h-40 md:w-[11rem] md:h-36 lg:w-[10rem] lg:h-36 xl:w-[20.5rem] xl:h-60  bg-bgIconCard rounded-2xl sm:rounded-3xl `}
                    className="h-32 sm:h-40 md:h-36 lg:w-[10rem] lg:h-36 xl:h-60 w-full"
                    align="center"
                    justify="center"
                    vertical
                >
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
                        src={icon}
                    />
                    <Typography.Text className="text-[.65rem] text-center sm:text-[.975rem] min-h-9 sm:min-h-14 line-clamp-2 pt-1 sm:pt-3">
                        {title}
                    </Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default FeaturesCard;
