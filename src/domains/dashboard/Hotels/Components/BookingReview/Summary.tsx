import React from 'react';

import { Card, Flex, Grid, Image, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import { MapPin } from '@domains/dashboard/carbonFootprint/assets/icons/projectDetails';
import { useAppSelector } from '@src/hooks/store';

import defaultImage from '../../Assets/defaultImage.jpg';
import { HotelSearch } from '../../types/hotelTypes';

const { useBreakpoint } = Grid;

const Summary = () => {
    const screens = useBreakpoint();
    const { hotelResponse } = useAppSelector(state => state.reducer.hotels);
    const response = hotelResponse as HotelSearch;
    const locationString = response.hotelDetails.data[0].location;
    const locationParts = locationString?.split(',');
    return (
        <Card className="h-full  sm:border-none md:border md:border-solid rounded-2xl">
            <Image
                loading="eager"
                height={screens.xxl ? 260 : 240}
                width="100%"
                src={
                    response.hotelDetails.data[0].images[0].path !== ''
                        ? response.hotelDetails.data[0].images[0].path
                        : defaultImage
                }
                preview={false}
                className={`rounded-lg object-cover ${
                    response.hotelDetails.data[0].images[0].path === '' ? 'border-b border-t' : ''
                }`}
            />
            <Flex vertical gap={15}>
                <Typography.Text className="mt-4 text-xl font-medium text-valueText xxl:text-2xl">
                    {response.hotelDetails.data[0].name}
                </Typography.Text>
                <Flex align="center" gap={3}>
                    <ReactSVG src={MapPin} />
                    <Typography.Text className="text-sm font-normal text-textGrey xxl:text-lg">
                        {locationParts?.map((part, index) => (
                            <span key={index}>
                                {part.trim()}
                                {index !== locationParts.length - 1 && ','}&nbsp;&nbsp;
                            </span>
                        ))}
                    </Typography.Text>
                </Flex>
                {/* <Typography.Text className="text-sm font-light text-start line-clamp-4 ">
                    {response.hotelDetails.data[0].description}
                </Typography.Text> */}
                <Typography
                    dangerouslySetInnerHTML={{ __html: response.hotelDetails.data[0].description! }}
                    className="mt-3 text-justify text-sm font-light line-clamp-4 "
                    style={{ lineHeight: '1.5' }}
                />
            </Flex>
        </Card>
    );
};

export default Summary;
