import React, { useCallback, useEffect, useState } from 'react';

import { Col, Flex, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { ReactSVG } from 'react-svg';

import Autocomplete from './autocomplete/AutoCompleteSelection';
import Date from './DatePicker';
import SwapSVG from '../assets/icons/swap.svg';
import { useGetSearchAirport } from '../hooks/useSearchAirport';
import { ITripData } from '../types/airlineTypes';
import { ISearchData } from '../types/searchAirports';
import { retrieveAirport } from '../utils/airlineData';
import '../assets/style.css';
import { retrieveFlightClass } from '../utils/getFlightClass';
import useDebounce from '@src/hooks/useDebounce';

const { Paragraph, Text } = Typography;

interface SearchCardMobileProps {
    showModal: () => void;
    tripData: ITripData;
    setTripData: any;
    tripType: string;
    multicity: boolean;
    setTripType: (trip: string) => void;
}

type dateTime = {
    date: string;
    day: string;
};

const SearchCardDesktop: React.FC<SearchCardMobileProps> = ({
    showModal,
    tripData,
    tripType,
    setTripData,
    multicity,
    setTripType,
}) => {
    const [searchKey, setSearchKey] = useState<string>('');
    const [searchData, setSearchData] = useState<ISearchData[]>();
    const [departureData, setDepartureData] = useState<dateTime>({
        date: dayjs().add(1, 'day').format('DD MM YYYY'),
        day: dayjs().add(1, 'day').format('dddd'),
    });
    const [checkInDate, setCheckInDate] = useState<any>(dayjs().add(1, 'day'));

    const [arrivalData, setArrivalData] = useState<dateTime>({
        date: '',
        day: '',
    });
    const debounceSearchText = useDebounce(searchKey, 200);
    const { data } = useGetSearchAirport(debounceSearchText);

    const updateTripData = useCallback(
        (key: string, val: string) => {
            setTripData((prevTripData: ITripData) => ({
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

    useEffect(() => {
        if (tripType) {
            setArrivalData({
                date: '',
                day: '',
            });
        }
    }, [tripType]);

    const handleLocationSwap = (index: number) => {
        if (index === 0) {
            const fromLocation = tripData.fromLocation1;
            const toLocation = tripData.toLocation1;

            updateTripData('fromLocation1', toLocation);
            updateTripData('toLocation1', fromLocation);
        }
        if (index === 1) {
            const { fromLocation, toLocation } = tripData;

            updateTripData('fromLocation', toLocation);
            updateTripData('toLocation', fromLocation);
        }
    };
    const disabledDate = (current: any) => current && current < moment().startOf('day');
    const disabledEndDate = (current: any) =>
        current && current < moment(checkInDate).startOf('day');

    const totalNumberOfPassengers = tripData.adults + tripData.children + tripData.infants;

    return (
        <Row className="w-full p-0 m-0" gutter={[10, 10]}>
            <Col md={4} xxl={5} className="w-full pt-4">
                <Paragraph className="flex-none text-sm text-gray-500 ms-3">From</Paragraph>
                <Autocomplete
                    options={searchData}
                    onSelect={updateTripData}
                    searchKey={searchKey}
                    setSearchKey={setSearchKey}
                    tripData={tripData}
                    location={multicity ? 'fromLocation' : 'fromLocation1'}
                />
                <Flex className="h-5">
                    <Typography.Text className="text-xs text-start text-gray-500 mt-1 ms-3 line-clamp-1">
                        {retrieveAirport(tripData[multicity ? 'fromLocation' : 'fromLocation1']) ??
                            ''}
                    </Typography.Text>
                </Flex>
                <Col className="border-b-2 ms-3 mt-2" />
            </Col>

            <Col md={1} lg={1} className="w-full">
                <Flex className="w-full h-full mt-2 ms-1" justify="center" align="center">
                    <ReactSVG src={SwapSVG} onClick={() => handleLocationSwap(multicity ? 1 : 0)} />
                </Flex>
            </Col>

            <Col md={4} xxl={4} className="w-full  pt-4">
                <Paragraph className="flex-none text-sm text-gray-500 ms-3">To</Paragraph>
                <Autocomplete
                    options={searchData}
                    onSelect={updateTripData}
                    searchKey={searchKey}
                    setSearchKey={setSearchKey}
                    tripData={tripData}
                    location={multicity ? 'toLocation' : 'toLocation1'}
                />
                <Flex className="h-5">
                    <Typography.Text className="text-xs text-start text-gray-500 mt-1 ms-3 line-clamp-1">
                        {retrieveAirport(tripData[multicity ? 'toLocation' : 'toLocation1']) ?? ''}
                    </Typography.Text>
                </Flex>
                <Col className="border-b-2 ms-3 mt-2" />
            </Col>

            <Col md={4} xxl={4} className="w-full pt-4">
                <Paragraph className="flex-none text-sm text-gray-500 ms-3 line-clamp-1">
                    Departure Date
                </Paragraph>
                <Typography.Paragraph className="text-2xl font-black">
                    <Date
                        defaultDate={multicity ? tripData.depart : tripData.depart1}
                        dateData={setDepartureData}
                        style={{ border: 0 }}
                        disabledDate={disabledDate}
                        handleChange={(date: any) => {
                            const checkIn = date.format('YYYY-MM-DD');
                            setCheckInDate(checkIn);
                        }}
                    />
                </Typography.Paragraph>
                <Flex className="h-4">
                    <Typography.Text className="text-xs text-gray-500 ms-3 line-clamp-1">
                        {departureData.day !== '' ? departureData.day : ' '}
                    </Typography.Text>
                </Flex>
                <Col className="border-b-2 ms-3 mt-2" />
            </Col>
            <Col md={5} xxl={4} className="w-full pt-4">
                <Paragraph className="flex-none text-sm text-gray-500 ms-3 line-clamp-1">
                    Return Date
                </Paragraph>
                {tripType === 'oneWay' ? (
                    <Flex gap={5} vertical>
                        <Typography.Text
                            className="text-lg font-medium text-iconRed cursor-pointer mt-2 line-clamp-1 ms-3"
                            onClick={() => {
                                setTripType('roundTrip');
                                updateTripData('tripType', 'roundTrip');
                            }}
                        >
                            + Add Return
                        </Typography.Text>
                        <Flex className="h-4">
                            <Typography.Text className="text-xs text-gray-500 ms-3">
                                {' '}
                            </Typography.Text>
                        </Flex>
                        <Col className="border-b-2 ms-3" />
                    </Flex>
                ) : (
                    <>
                        <Typography.Title level={4} className="text-sm text-gray-500">
                            <Date
                                disabledData={tripData.tripType === 'multiCity'}
                                dateData={setArrivalData}
                                defaultDate={arrivalData.date !== '' ? arrivalData.date : ''}
                                style={{ border: 0 }}
                                disabledDate={disabledEndDate}
                            />
                        </Typography.Title>
                        <Flex className="h-4">
                            <Typography.Text className="text-xs text-gray-500 ms-3 line-clamp-1">
                                {arrivalData.day !== '' ? arrivalData.day : ''}
                            </Typography.Text>
                        </Flex>
                        <Col className="border-b-2 ms-3 mt-2" />
                    </>
                )}
            </Col>
            {multicity ? (
                ' '
            ) : (
                <Col md={6} xxl={5} className="w-full pt-5 flex flex-col" onClick={showModal}>
                    <Text className="text-sm text-gray-500 line-clamp-1 ms-3">
                        Travellers & Cabin Class
                    </Text>
                    <Flex className="p-0 m-0 ms-3" justify="start">
                        <Text className="text-valueText font-semibold text-lg line-clamp-1">
                            {totalNumberOfPassengers}
                        </Text>
                        <Text className="text-valueText font-semibold text-lg line-clamp-1 ms-1">
                            {Number(totalNumberOfPassengers) > 1 ? 'Passengers' : 'Passenger'}
                        </Text>
                    </Flex>
                    <Flex className="h-5">
                        <Text className="text-xs text-gray-500 line-clamp-1 mt-1 ms-3">
                            {retrieveFlightClass(tripData.class)}
                        </Text>
                    </Flex>
                    <Col className="border-b-2 ms-3 mt-2" />
                </Col>
            )}
        </Row>
    );
};

export default SearchCardDesktop;
