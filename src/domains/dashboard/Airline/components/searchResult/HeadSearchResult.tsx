/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';

import { AutoComplete, Button, Card, Col, Flex, Row, Select, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import SwapSVG from '../../assets/icons/swap.svg';
import useHandleAirlineSearch from '../../hooks/useHandleAirlineSearch';
import { useGetSearchAirport } from '../../hooks/useSearchAirport';
import { useGetOneWaySearch } from '../../hooks/useSearchOneWayApi';
import { setQuickUpdateTripType } from '../../slices/airlineSlice';
import { ITripData } from '../../types/airlineTypes';
import { ISearchData } from '../../types/searchAirports';
import { retrieveAirport } from '../../utils/airlineData';
import { retrieveFlightClass } from '../../utils/getFlightClass';
import { tripMethods } from '../../utils/options';
import Autocomplete from '../autocomplete/AutoCompleteSelection';
import Date from '../DatePicker';
import PassengerSelectModal from '../PassengerSelectModal';

import '../../assets/style.css';

type props = {
    setFlightResData: any;
    setFlightData: any;
    setIsloading: any;
    setFilterCount: any;
    setProgress: any;
    setNoResult: (result: boolean) => void;
};
type dateTime = {
    date: string;
    day: string;
};
function HeadSearchResult({
    setFilterCount,
    setFlightResData,
    setIsloading,
    setFlightData,
    setProgress,
    setNoResult,
}: props) {
    const location = useLocation();
    const { flightkey } = location.state || {};
    const dispatch = useAppDispatch();
    const airlineSearchData: ITripData = useAppSelector(state => state.reducer.airline.searchData);
    const { handleAirlineSearch } = useHandleAirlineSearch();
    const [searchKey, setSearchKey] = useState<string>();
    const [searchData, setSearchData] = useState<ISearchData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departureData, setDepartureData] = useState<dateTime>({
        date:
            airlineSearchData.tripType === 'multiCity'
                ? airlineSearchData?.depart
                : airlineSearchData?.depart1,
        day:
            airlineSearchData.tripType === 'multiCity'
                ? airlineSearchData?.departDay
                : airlineSearchData?.departDay1,
    });
    const [arrivalData, setArrivalData] = useState<dateTime>({
        date: airlineSearchData?.arrive,
        day: airlineSearchData?.arriveDay,
    });

    const { isLoading, filterCount, searchHandler, noResult } = useGetOneWaySearch();

    setNoResult(noResult);
    const airportSearch = useGetSearchAirport(searchKey || '');

    const [tripData, setTripData] = useState<ITripData>({
        tripType: airlineSearchData.tripType,
        fromLocation: airlineSearchData?.fromLocation ?? '',
        toLocation: airlineSearchData?.toLocation ?? '',
        depart: airlineSearchData?.depart ?? '',
        departDay: airlineSearchData?.departDay ?? '',
        arrive: airlineSearchData?.arrive ?? '',
        arriveDay: airlineSearchData?.arriveDay ?? '',
        fromLocation1: airlineSearchData?.fromLocation1 ?? '',
        toLocation1: airlineSearchData?.toLocation1 ?? '',
        depart1: airlineSearchData?.depart1 ?? '',
        departDay1: airlineSearchData?.departDay1 ?? '',
        arrive1: airlineSearchData?.arrive1 ?? '',
        arriveDay1: airlineSearchData?.arriveDay1 ?? '',
        adults: airlineSearchData?.adults ?? '',
        children: airlineSearchData?.children ?? '',
        infants: airlineSearchData?.infants ?? '',
        class: airlineSearchData?.class ?? '',
    });

    const updateTripData = useCallback(
        (key: string, val: string) => {
            setTripData((prevTripData: ITripData) => ({
                ...prevTripData,
                [key]: val,
            }));
        },
        [setTripData]
    );

    const handleSearch = async () => {
        setProgress(0);
        const search = handleAirlineSearch(tripData);
        if (search.status) {
            const res = await searchHandler(search.data);
            setFlightData(res);
            setFlightResData(res);
        }
    };

    useEffect(() => {
        setIsloading(isLoading);
        setFilterCount({
            lowestPrice: filterCount.lowestPrice === Infinity ? 0 : filterCount.lowestPrice,
            highestPrice: filterCount.highestPrice === -Infinity ? 0 : filterCount.highestPrice,
        });
    }, [filterCount, isLoading, setFilterCount, setIsloading]);

    useEffect(() => {
        updateTripData(
            `${tripData.tripType === 'multiCity' ? 'depart' : 'depart1'}`,
            departureData.date
        );
        updateTripData(
            `${tripData.tripType === 'multiCity' ? 'departDay' : 'departDay1'}`,
            departureData.day
        );
    }, [departureData, updateTripData]);

    useEffect(() => {
        updateTripData('arrive', arrivalData.date);
        updateTripData('arriveDay', arrivalData.day);
    }, [arrivalData, updateTripData]);

    useEffect(() => {
        if (flightkey) {
            handleSearch();
        }
    }, []);

    useEffect(() => {
        setSearchData(airportSearch.data);
    }, [airportSearch, searchData]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

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

    const updateTripType = (val: string) => {
        dispatch(setQuickUpdateTripType(val));
    };

    const gridStyle: React.CSSProperties = {
        width: '50%',
        padding: '0.7rem',
        alignItems: 'center',
        borderRadius: '.80rem',
        height: '4rem',
    };

    const gridStyleEnd: React.CSSProperties = {
        width: '50%',
        height: '4rem',
        padding: '.5rem',
        alignItems: 'center',
        borderTopRightRadius: '.80rem',
        borderBottomRightRadius: '.80rem',
    };

    const gridStyleStart: React.CSSProperties = {
        width: '50%',
        height: '4rem',
        padding: '.5rem',
        alignItems: 'center',
        borderTopLeftRadius: '.80rem',
        borderBottomLeftRadius: '.80rem',
    };
    const totalNumberOfPassengers = tripData.adults + tripData.children + tripData.infants;

    return (
        <>
            <Row justify="space-between" className=" p-0 m-0">
                <Col className="" md={4} xl={4}>
                    <Card className="border rounded-xl h-full" bodyStyle={{ padding: 0 }}>
                        <Col className="flex flex-col w-full p-2 justify-center h-full">
                            <Select
                                className="font-black my-auto mt-2 custon_select_bold"
                                style={{ fontWeight: 800 }}
                                defaultValue={tripData.tripType}
                                variant="borderless"
                                options={tripMethods}
                                onSelect={val => {
                                    updateTripData('tripType', val);
                                    updateTripType(val);
                                }}
                            />
                        </Col>
                    </Card>
                </Col>
                <Col className="h-full" md={6} xl={6}>
                    <Card className="flex flex-col border-none h-full" bodyStyle={{ padding: 0 }}>
                        <Card.Grid hoverable={false} style={gridStyleStart}>
                            <Autocomplete
                                options={searchData}
                                onSelect={updateTripData}
                                searchKey={searchKey}
                                setSearchKey={setSearchKey}
                                tripData={tripData}
                                location="fromLocation1"
                            />
                            <Typography.Text className="text-xs text-start text-gray-500 mx-3 overflow-hidden line-clamp-1">
                                {retrieveAirport(tripData.fromLocation1 || '')}
                            </Typography.Text>
                        </Card.Grid>
                        <Card className="border-0 w-0 h-full">
                            <Flex className="h-full w-full mt-5" justify="center" align="center">
                                {/*  handleLocationSwap(0) from round trip and oneway */}
                                <ReactSVG src={SwapSVG} onClick={() => handleLocationSwap(0)} />
                            </Flex>
                        </Card>
                        <Card.Grid
                            hoverable={false}
                            style={{ ...gridStyleEnd, paddingLeft: '1rem' }}
                        >
                            <Autocomplete
                                options={searchData}
                                onSelect={updateTripData}
                                searchKey={searchKey}
                                setSearchKey={setSearchKey}
                                tripData={tripData}
                                location="toLocation1"
                            />
                            <Typography.Text className="text-xs text-start text-gray-500 mx-3 overflow-hidden line-clamp-1">
                                {retrieveAirport(tripData.toLocation1 || '')}
                            </Typography.Text>
                        </Card.Grid>
                    </Card>
                </Col>
                <Col className="" md={6} xl={6}>
                    <Flex className="w-full">
                        <Card className="flex-1 border-none">
                            <Card.Grid hoverable={false} style={gridStyleStart} className="flex-1">
                                <Typography.Text className="text-sm text-gray-500 py-1 px-0 flex">
                                    <Date
                                        defaultDate={tripData?.depart1 || airlineSearchData.depart1}
                                        dateData={setDepartureData}
                                        style={{ border: 0 }}
                                    />
                                </Typography.Text>
                            </Card.Grid>
                            <Card.Grid hoverable={false} style={gridStyleEnd} className="flex-1">
                                {tripData.tripType === 'oneWay' ? (
                                    <Flex gap={5} vertical>
                                        <Typography.Text
                                            className="text-lg font-medium text-iconRed cursor-pointer mt-3 ms-3 line-clamp-1"
                                            onClick={() => updateTripData('tripType', 'roundTrip')}
                                        >
                                            + Add Return
                                        </Typography.Text>
                                    </Flex>
                                ) : (
                                    <Typography.Text className="text-sm text-gray-500 py-1 px-0 flex">
                                        <Date
                                            disabledData={
                                                tripData.tripType === 'oneWay' ||
                                                tripData.tripType === 'multiCity'
                                            }
                                            defaultDate={tripData?.arrive ?? tripData?.depart1}
                                            dateData={setArrivalData}
                                            style={{ border: 0 }}
                                        />
                                    </Typography.Text>
                                )}
                            </Card.Grid>
                        </Card>
                    </Flex>
                </Col>
                <Col md={5} lg={3} className=" flex justify-center items-center">
                    <Card
                        style={gridStyle}
                        bodyStyle={{ padding: 0 }}
                        size="small"
                        className="flex-1 justify-center items-center h-full"
                        onClick={() => toggleModal()}
                    >
                        <Typography.Text className="xxl:text-base md:text-sm font-bold py-0  mx-0 xxl:mx-3 line-clamp-1">
                            {totalNumberOfPassengers}{' '}
                            {Number(totalNumberOfPassengers) > 1 ? 'Travellers' : 'Traveller'}
                        </Typography.Text>
                        <Typography.Text className="text-xs text-start text-gray-500 mx-0 xxl:mx-3 line-clamp-1">
                            {retrieveFlightClass(tripData.class)}
                        </Typography.Text>
                    </Card>
                </Col>
                <Col
                    className="flex justify-end items-end xl:me-6  px-2 mt-3 lg:mt-0"
                    md={24}
                    lg={4}
                >
                    <Button
                        danger
                        className="flex justify-center flex-col items-center h-[3.8rem] w-full rounded-lg xl:me-6"
                        style={{ marginBottom: '1.5px' }}
                        type="default"
                        size="small"
                        onClick={() => handleSearch()}
                    >
                        Search Flights
                    </Button>
                </Col>
            </Row>
            {tripData.tripType === 'multiCity' && (
                <Row gutter={10} justify="space-between" className="h-20 me-10">
                    <Col md={6} xl={6}>
                        <Card className="flex flex-col border-none" bodyStyle={{ padding: 0 }}>
                            <Card.Grid hoverable={false} style={gridStyleStart}>
                                <AutoComplete
                                    options={searchData}
                                    defaultValue={tripData.fromLocation || ''}
                                    onSelect={val => {
                                        updateTripData('fromLocation', val);
                                    }}
                                    onSearch={val => setSearchKey(val)}
                                    placeholder="Enter From Location"
                                    variant="borderless"
                                    className="w-full text-lg font-bold p-0 custom_autocomplete"
                                />
                                <Typography.Text className="text-xs text-start text-gray-500 mx-3 overflow-hidden line-clamp-1">
                                    {retrieveAirport(tripData.fromLocation || '')}
                                </Typography.Text>
                            </Card.Grid>
                            <Card className="border-0 w-0">
                                <Flex
                                    className="h-full w-full mt-4"
                                    justify="center"
                                    align="center"
                                >
                                    {/*  handleLocationSwap(0) from round trip and oneway */}
                                    <ReactSVG src={SwapSVG} onClick={() => handleLocationSwap(1)} />
                                </Flex>
                            </Card>
                            <Card.Grid hoverable={false} style={gridStyleEnd}>
                                <AutoComplete
                                    options={searchData}
                                    onSelect={val => {
                                        updateTripData('toLocation', val);
                                    }}
                                    defaultValue={tripData.toLocation || ''}
                                    onSearch={val => setSearchKey(val)}
                                    placeholder="Enter To Location"
                                    variant="borderless"
                                    className="w-full text-lg font-bold p-0 custom_autocomplete"
                                />
                                <Typography.Text className="text-xs text-start text-gray-500 mx-3 overflow-hidden line-clamp-1">
                                    {retrieveAirport(tripData.toLocation || '')}
                                </Typography.Text>
                            </Card.Grid>
                        </Card>
                    </Col>
                    <Col md={6} xl={6}>
                        <Flex>
                            <Card
                                style={gridStyleStart}
                                bodyStyle={{ padding: 0 }}
                                className="flex-1"
                            >
                                <Typography.Text className="text-sm text-gray-500  py-1 px-0 flex">
                                    <Date
                                        defaultDate={tripData.depart}
                                        dateData={setDepartureData}
                                        style={{ border: 0 }}
                                    />
                                </Typography.Text>
                            </Card>
                            <Card
                                hoverable={false}
                                style={gridStyleEnd}
                                bodyStyle={{ padding: 0 }}
                                className="flex-1"
                            >
                                <Typography.Text className="text-sm text-gray-500 py-1 px-0 flex">
                                    <Date
                                        disabledData
                                        dateData={setArrivalData}
                                        style={{ border: 0 }}
                                    />
                                </Typography.Text>
                            </Card>
                        </Flex>
                    </Col>
                    <Col md={12} xl={12} />
                </Row>
            )}
            <PassengerSelectModal
                tripData={tripData}
                setTripData={setTripData}
                isModalOpen={isModalOpen}
                handleCancel={toggleModal}
            />
        </>
    );
}

export default HeadSearchResult;
