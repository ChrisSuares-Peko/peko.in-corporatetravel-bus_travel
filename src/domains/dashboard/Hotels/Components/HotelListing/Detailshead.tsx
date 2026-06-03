import React, { useEffect, useState } from 'react';

import { Button, Card, Col, DatePicker, Flex, Row, Typography, theme } from 'antd';
import '@domains/dashboard/Hotels/styles/home.css';
import Paragraph from 'antd/es/typography/Paragraph';
import dayjs from 'dayjs';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { ReactSVG } from 'react-svg';

import location from '@domains/dashboard/Hotels/Assets/icons/locationIcon.svg';
import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import useDateFields from '../../hooks/useDateField';
import useSearchCityApi from '../../hooks/useSearchCityApi';
import useTimeConvert from '../../hooks/useTimeConvertHook';
import { getHotels, resetHotelArr } from '../../slices/getHotelSlice';
import SelectCity from '../AutoComplete/SelectCity';
import BookModal from '../GuestInfoModal/Modal';

import '../../Assets/style.css';

const Detailshead = ({ hotelsSearch }: { hotelsSearch: () => void }) => {
    const { showModal, handleCancel, isModalOpen } = useDateFields();
    const { hotelsRequest, nationality, countryOfResidence } = useAppSelector(
        state => state.reducer.hotels
    );

    const { convertToDateString } = useTimeConvert();

    const [searchText, setSearchText] = useState<string>('');
    const [selectedCityName, setSelectedCityName] = useState<string>(hotelsRequest.city || '');
    const [selectedCountryName, setSelectedCountryName] = useState<string>(
        hotelsRequest.country || ''
    );
    const [checkInDate, setCheckInDate] = useState<string>(hotelsRequest.checkIn || '');
    const [checkOutDate, setCheckOutDate] = useState<string>(hotelsRequest.checkOut || '');

    const [roomData, setRoomData] = useState([]);
    const { isLoading, cityList, cityOptions } = useSearchCityApi();

    const handleCountrySelect = (value: string) => {
        const [cityName, countryName] = value.split(', ');
        setSelectedCityName(cityName);
        setSelectedCountryName(countryName);
    };
    useEffect(() => {
        cityList(searchText);
    }, [searchText, cityList]);

    const dispatch = useDispatch();

    let totalCount = 0;

    hotelsRequest.rooms.forEach((count: { adult: any; child: any }) => {
        totalCount += count.adult + count.child;
    });
    const handleClick = () => {
        dispatch(resetHotelArr());
        if (!selectedCityName || !selectedCountryName) {
            dispatch(showToast({ description: 'Please select a location', variant: 'error' }));
            return;
        }

        dispatch(
            getHotels({
                city: selectedCityName,
                country: selectedCountryName,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                travelerNationality: nationality,
                travelerCountryOfResidence: countryOfResidence,
            })
        );

        hotelsSearch();
    };
    const {
        token: { colorPrimary },
    } = theme.useToken();

    const gridStyle: React.CSSProperties = {
        width: '100%',
        height: '4.2rem',
        padding: '0.7rem',
        alignItems: 'center',
        borderRadius: '0.5rem',
    };
    const gridStyleEnd: React.CSSProperties = {
        width: '50%',
        height: '4.2rem',
        padding: '.5rem',
        alignItems: 'center',
        borderTopRightRadius: '.5rem',
        borderBottomRightRadius: '.5rem',
        borderTopLeftRadius: '.0.5rem',
        borderBottomLeftRadius: '.0.5rem',
    };

    const gridStyleStart: React.CSSProperties = {
        width: '50%',
        height: '4.2rem',
        padding: '.5rem',
        alignItems: 'center',
        borderTopLeftRadius: '.5rem',
        borderBottomLeftRadius: '.5rem',
        borderTopRightRadius: '.0.5rem',
        borderBottomRightRadius: '.0.5rem',
    };
    const disabledDate = (current: any) => current && current < moment().startOf('day');
    const disabledEndDate = (current: any) =>
        current && current < moment(checkInDate).startOf('day');

    function toTitleCase(str: string) {
        return str.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
    }
    return (
        <>
            <style>
                {`
                
                :where(.css-dev-only-do-not-override-1rqnfsa).ant-typography+h4.ant-typography, :where(.css-dev-only-do-not-override-1rqnfsa).ant-typography+h5.ant-typography {
                    margin-top: 0rem;
                }
                `}
            </style>
            <Flex vertical gap={7} className="top-1/3 w-full">
                <Row gutter={10}>
                    <Col className="h-full" md={6} xl={6}>
                        <Card
                            className="flex flex-col border-none h-full"
                            bodyStyle={{ padding: 0 }}
                        >
                            <Card.Grid hoverable={false} style={gridStyle}>
                                <Flex vertical>
                                    <Flex className="flex-none text-xs text-gray-500 ml-3">
                                        <ReactSVG src={location} className="" />
                                        <Paragraph className="flex-none text-xs text-gray-500 ml-1">
                                            Location
                                        </Paragraph>
                                    </Flex>

                                    <SelectCity
                                        options={cityOptions}
                                        onSelect={handleCountrySelect}
                                        searchKey={searchText}
                                        setSearchKey={setSearchText}
                                        defaultvalue={`${selectedCityName}, ${selectedCountryName}`}
                                        textSize="text-lg"
                                    />
                                </Flex>
                            </Card.Grid>
                        </Card>
                    </Col>

                    <Col className="gutter-row mt-3 md:mt-0" xs={24} sm={12} md={10} lg={10}>
                        <Flex className="w-full">
                            <Card
                                style={gridStyleStart}
                                bodyStyle={{ padding: 0 }}
                                className="flex-1"
                            >
                                <Flex vertical>
                                    <Paragraph className="flex-none text-xs text-gray-500 ml-3">
                                        Check-In
                                    </Paragraph>
                                    <Typography.Title
                                        level={4}
                                        className="text-sm text-gray-500 py-0 px-0"
                                    >
                                        <DatePicker
                                            defaultValue={dayjs(checkInDate)}
                                            onChange={(date: any) =>
                                                setCheckInDate(date.format('YYYY-MM-DD'))
                                            }
                                            style={{ border: 0 }}
                                            format="DD MMM YY"
                                            suffixIcon={null}
                                            disabledDate={disabledDate}
                                            className="custom_date font-medium"
                                            allowClear={false}
                                            onKeyDown={e => e.preventDefault()} // Prevent manual input
                                        />
                                    </Typography.Title>
                                </Flex>
                            </Card>
                            <Card
                                style={gridStyleEnd}
                                bodyStyle={{ padding: 0 }}
                                className="flex-1"
                            >
                                <Flex vertical>
                                    <Paragraph className="flex-none text-xs text-gray-500 ml-3">
                                        Check-Out
                                    </Paragraph>
                                    <Typography.Title
                                        level={4}
                                        className="text-sm text-gray-500 py-0 px-0"
                                    >
                                        <DatePicker
                                            defaultValue={dayjs(checkOutDate)}
                                            onChange={(date: any) =>
                                                setCheckOutDate(date.format('YYYY-MM-DD'))
                                            }
                                            style={{ border: 0 }}
                                            format="DD MMM YY"
                                            suffixIcon={null}
                                            disabledDate={disabledEndDate}
                                            className="custom_date font-medium"
                                            allowClear={false}
                                            onKeyDown={e => e.preventDefault()} // Prevent manual input
                                        />
                                    </Typography.Title>
                                </Flex>
                            </Card>
                        </Flex>
                    </Col>

                    <Col className="gutter-row mt-3 md:mt-0" xs={24} sm={12} md={5} lg={5}>
                        <Card
                            className="flex flex-col border-none h-full"
                            bodyStyle={{ padding: 0 }}
                        >
                            <Card.Grid hoverable={false} style={gridStyle}>
                                <Flex vertical>
                                    <Typography.Text className="text-xs text-gray-500 mx-2">
                                        Guests & Nationality
                                    </Typography.Text>
                                    <Typography.Text
                                        className="xxl:font-medium py-1 mx-2 md:text-xs"
                                        style={{ color: 'black', fontSize: '17px' }}
                                        onClick={showModal}
                                    >
                                        {hotelsRequest.rooms.length}{' '}
                                        {hotelsRequest.rooms.length === 1 ? 'Room' : 'Rooms'}
                                        ,&nbsp;&nbsp;
                                        {totalCount} {totalCount === 1 ? 'Guest' : 'Guests'}
                                    </Typography.Text>
                                </Flex>
                            </Card.Grid>
                        </Card>
                    </Col>
                    <Col className="gutter-row mt-3 md:mt-0" xs={24} sm={12} md={3} lg={3} xl={3}>
                        <Button
                            size="middle"
                            onClick={handleClick}
                            className=" w-full h-16 rounded-md text-center"
                            style={{
                                color: colorPrimary,
                                borderColor: colorPrimary,
                            }}
                        >
                            <Typography.Text className="text-bgOrange2 text-base">
                                Search
                            </Typography.Text>
                        </Button>
                    </Col>
                </Row>
                <BookModal
                    isModalOpen={isModalOpen}
                    handleCancel={handleCancel}
                    setRoomData={setRoomData}
                />
            </Flex>
        </>
    );
};

export default Detailshead;
