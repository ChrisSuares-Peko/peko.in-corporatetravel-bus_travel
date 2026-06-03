import React, { useCallback, useEffect, useState } from 'react';

import { UserOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Flex, Row, Typography } from 'antd';
import dayjs from 'dayjs';

import { useGetSearchAirport } from '../../hooks/useSearchAirport';
import { ITripData } from '../../types/airlineTypes';
import { ISearchData } from '../../types/searchAirports';
import { retrieveAirport } from '../../utils/airlineData';
import { retrieveFlightClass } from '../../utils/getFlightClass';
import Autocomplete from '../autocomplete/AutoCompleteSelection';
import Date from '../DatePicker';

interface SearchCardMobileProps {
    showModal: () => void;
    tripData: ITripData;
    setTripData: any;
    tripType: string;
    multicity: boolean;
}

type dateTime = {
    date: string;
    day: string;
};

const SearchCardMobile: React.FC<SearchCardMobileProps> = ({
    showModal,
    tripData,
    tripType,
    setTripData,
    multicity,
}) => {
    const [searchKey, setSearchKey] = useState<string>();
    const [searchData, setSearchData] = useState<ISearchData[]>([]);

    const [departureData, setDepartureData] = useState<dateTime>({
        date: dayjs().add(1, 'day').format('DD MM YYYY'),
        day: dayjs().add(1, 'day').format('dddd'),
    });
    const [arrivalData, setArrivalData] = useState<dateTime>({
        date: '',
        day: '',
    });

    const { data } = useGetSearchAirport(searchKey || '');

    const updateTripData = useCallback(
        (key: string, val: string) => {
            setTripData((prevTripData: object) => ({
                ...prevTripData,
                [key]: val,
            }));
        },
        [setTripData]
    );

    useEffect(() => {
        updateTripData(`${multicity === true ? 'depart' : 'depart1'}`, departureData.date);
        updateTripData(`${multicity === true ? 'departDay' : 'departDay1'}`, departureData.day);
    }, [departureData, updateTripData, multicity]);

    useEffect(() => {
        updateTripData('arrive', arrivalData.date);
        updateTripData('arriveDay', arrivalData.day);
    }, [arrivalData, updateTripData]);

    useEffect(() => {
        setSearchData(data);
    }, [data, searchData]);

    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} lg={10}>
                <Card
                    className="flex flex-col h-full border-none"
                    bodyStyle={{ padding: 10, height: '100%' }}
                >
                    <Flex className="w-10 h-10 rounded-full mx-2" align="center" justify="center">
                        <span className="text-xs text-gray-500">From</span>
                    </Flex>
                    <Autocomplete
                        options={searchData}
                        onSelect={updateTripData}
                        searchKey={searchKey}
                        setSearchKey={setSearchKey}
                        tripData={tripData}
                        location={multicity ? 'fromLocation' : 'fromLocation1'}
                    />
                    <Typography.Text className="text-xs text-start text-gray-500 mx-3">
                        {retrieveAirport(tripData[multicity ? 'fromLocation' : 'fromLocation1']) ??
                            ''}
                    </Typography.Text>

                    <Divider className="mt-3 mb-1" />

                    <Flex className="w-10 h-10 rounded-full" align="center" justify="center">
                        <span className="text-xs text-gray-500">To</span>
                    </Flex>
                    <Autocomplete
                        options={searchData}
                        onSelect={updateTripData}
                        searchKey={searchKey}
                        setSearchKey={setSearchKey}
                        tripData={tripData}
                        location={multicity ? 'toLocation' : 'toLocation1'}
                    />
                    <Typography.Text className="text-xs text-start text-gray-500 mx-3 overflow-hidden line-clamp-1">
                        {retrieveAirport(tripData[multicity ? 'toLocation' : 'toLocation1']) ?? ''}
                    </Typography.Text>

                    <Divider className="my-3" />
                    <Flex justify="space-between">
                        <Flex vertical>
                            <Typography.Title
                                level={4}
                                className="text-sm text-gray-500  py-1 px-0"
                            >
                                <Date
                                    placeholder="Departure Date"
                                    dateData={setDepartureData}
                                    style={{ border: 0 }}
                                    defaultDate={multicity ? tripData.depart : tripData.depart1}
                                />
                            </Typography.Title>
                            <Typography.Text className="text-xs text-gray-500 mx-2">
                                {departureData.day !== ''
                                    ? departureData.day
                                    : 'Please Select Date'}
                            </Typography.Text>
                        </Flex>
                        <Flex vertical>
                            <Typography.Title
                                level={4}
                                className="text-sm text-gray-500  py-1 px-0"
                            >
                                <Date
                                    placeholder="Return Date"
                                    disabledData={tripType === 'oneWay' || tripType === 'multiCity'}
                                    dateData={setArrivalData}
                                    style={{ border: 0 }}
                                />
                            </Typography.Title>
                            <Typography.Text className="text-xs text-gray-500 mx-1">
                                {arrivalData.day !== '' ? arrivalData.day : 'Please Select Date'}
                            </Typography.Text>
                        </Flex>
                    </Flex>
                    <Divider className="my-3" />

                    <Flex
                        align="center"
                        gap="4"
                        className={`m-2 mt-5 ${multicity && 'hidden'}`}
                        onClick={showModal}
                    >
                        <UserOutlined />
                        <Typography.Text className="text-xs text-gray-500 mx-2">
                            {tripData.adults + tripData.children + tripData.infants}
                        </Typography.Text>
                        <Typography.Text className="text-xs text-gray-500 mx-2">
                            {retrieveFlightClass(tripData.class)}
                        </Typography.Text>
                    </Flex>
                </Card>
            </Col>
        </Row>
    );
};

export default SearchCardMobile;
