import React, { useCallback, useEffect, useState } from 'react';

import { Button, Col, Flex, Grid, Radio, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import SearchCardMobile from './adaptive/SearchCardMobile';
import PassengerSelectModal from './PassengerSelectModal';
import SearchCardDesktop from './SearchCardDesktop';
import useHandleAirlineSearch from '../hooks/useHandleAirlineSearch';
import { resetFilghtResponse, resetFormState } from '../slices/airlineSlice';
import { ITripData } from '../types/airlineTypes';

const { useBreakpoint } = Grid;

export default function SearchFlight() {
    const navigate = useNavigate();
    const { handleAirlineSearch } = useHandleAirlineSearch();
    const dispatch = useAppDispatch();
    const screens = useBreakpoint();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [tripType, setTripType] = useState<string>('oneWay');
    const [tripData, setTripData] = useState<ITripData>({
        tripType,
        fromLocation: '',
        toLocation: '',
        depart: '',
        departDay: '',
        arrive: '',
        arriveDay: '',
        fromLocation1: 'DXB',
        toLocation1: 'RUH',
        depart1: dayjs().format('DD MM YYYY'),
        departDay1: dayjs().format('dddd'),
        arrive1: '',
        arriveDay1: '',
        adults: 1,
        children: 0,
        infants: 0,
        class: '5',
    });

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        dispatch(resetFormState());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = () => {
        dispatch(resetFilghtResponse());
        const search = handleAirlineSearch(tripData);
        if (search.status) {
            navigate(`${paths.airline.index}/${paths.airline.results}`, {
                state: { flightkey: 'searchFlights' },
            });
        }
    };

    const updateTripData = useCallback(
        (key: string, val: string) => {
            setTripData((prevTripData: ITripData) => ({
                ...prevTripData,
                [key]: val,
            }));
        },
        [setTripData]
    );

    return (
        <Col className="md:border xs:border-none xs:p-0 md:p-0 ">
            <Flex vertical gap={25}>
                <Radio.Group
                    onChange={e => {
                        setTripType(e.target.value);
                        updateTripData('tripType', e.target.value);
                    }}
                    buttonStyle="outline"
                    size="large"
                    value={tripType}
                    defaultValue="oneWay"
                    className="ms-2"
                >
                    <Radio
                        defaultChecked
                        value="oneWay"
                        className="xs:text-xs md:text-sm md:font-semibold mt-1"
                    >
                        One Way
                    </Radio>
                    <Radio
                        value="roundTrip"
                        className="xs:text-xs md:text-sm md:font-semibold mt-1"
                    >
                        Round Trip
                    </Radio>
                    <Radio
                        value="multiCity"
                        className="xs:text-xs md:text-sm md:font-semibold mt-1"
                    >
                        Multi City
                    </Radio>
                </Radio.Group>
                {screens.xs &&
                    (tripType === 'multiCity' ? (
                        <>
                            <SearchCardMobile
                                tripData={tripData}
                                setTripData={setTripData}
                                multicity={false}
                                tripType={tripType}
                                showModal={showModal}
                            />
                            <SearchCardMobile
                                tripData={tripData}
                                setTripData={setTripData}
                                tripType={tripType}
                                multicity
                                showModal={showModal}
                            />
                        </>
                    ) : (
                        <SearchCardMobile
                            tripData={tripData}
                            setTripData={setTripData}
                            multicity={false}
                            tripType={tripType}
                            showModal={showModal}
                        />
                    ))}
                {screens.xs === false && (
                    <Row>
                        <Col md={24} xl={19} xxl={20}>
                            <Flex
                                className="xs:hidden sm:flex w-full h-full"
                                justify="end"
                                gap="large"
                                align="start"
                                vertical
                            >
                                {tripType === 'multiCity' ? (
                                    <>
                                        <SearchCardDesktop
                                            tripData={tripData}
                                            setTripData={setTripData}
                                            tripType={tripType}
                                            multicity={false}
                                            showModal={showModal}
                                            setTripType={setTripType}
                                        />
                                        <SearchCardDesktop
                                            tripData={tripData}
                                            setTripData={setTripData}
                                            tripType={tripType}
                                            showModal={showModal}
                                            setTripType={setTripType}
                                            multicity
                                        />
                                    </>
                                ) : (
                                    <SearchCardDesktop
                                        multicity={false}
                                        tripData={tripData}
                                        setTripData={setTripData}
                                        tripType={tripType}
                                        showModal={showModal}
                                        setTripType={setTripType}
                                    />
                                )}
                            </Flex>
                        </Col>
                        <Col md={24} xl={5} xxl={4} className="mt-9">
                            <Button
                                onClick={handleSearch}
                                danger
                                className="xxl:w-52 md:w-48 h-14 flex justify-center items-center rounded-md"
                                type="primary"
                                size="middle"
                            >
                                <Typography.Text className="text-white text-base">
                                    Search Flights
                                </Typography.Text>
                            </Button>
                        </Col>
                    </Row>
                )}

                <PassengerSelectModal
                    tripData={tripData}
                    setTripData={setTripData}
                    isModalOpen={isModalOpen}
                    handleCancel={handleCancel}
                />
                <Button
                    onClick={handleSearch}
                    danger
                    className="w-full sm:hidden sm:w-52 flex justify-center rounded-md"
                    type="primary"
                    size="middle"
                >
                    Search Flights
                </Button>
            </Flex>
        </Col>
    );
}
