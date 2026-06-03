/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { Button, Col, Flex, Row, Typography, theme, Grid, Skeleton, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';

// import Facilities from '@domains/dashboard/Hotels/Components/Facilities';
import Overview from '@src/domains/dashboard/Hotels/Components/ViewHotel/Overview';
import ViewHotel from '@src/domains/dashboard/Hotels/Components/ViewHotel/ViewHotel';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
// import useHotelDetailsApi from '../hooks/useHotelDetailsApi';
import { showToast } from '@src/slices/apiSlice';

import PriceChange from './PriceChange';
import Rooms from './Rooms';
import CheckoutTextRow from '../../../GiftCards/components/CheckoutTextRow';
import DateFields from '../../hooks/useDateField';
import usePrebookApi from '../../hooks/usePrebookApi';
import {
    getBookingKey,
    getPrebookData,
    resetRoomResponse,
    resetUserDetails,
    setNetAmount,
    setPrebookResponse,
    setRoom,
    setRoomDetails,
} from '../../slices/getHotelSlice';
import { HotelSearch, HotelDetail, roomDetails, Room } from '../../types/hotelTypes';

const { useBreakpoint } = Grid;

interface basicDetails {
    name: string;
    description: string;
    startRate: string;

    location: string;
    facilities: any;
    images: any;
}

const RoomSelection = () => {
    // const { isLoading } = useHotelDetailsApi();
    const navigate = useNavigate();
    const [Loading, setIsLoading] = useState(true);
    const [isloading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const { PrebookDetails } = usePrebookApi();
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const { hotelResponse, roomResponse, keyData, hotelsRequest } = useAppSelector(
        state => state.reducer.hotels
    );

    const [details, setDetails] = useState<basicDetails>();
    const [changedPrice, setChangedPrice] = useState<number | undefined>();
    const [roomInfo, setRoomInfo] = useState<Room[]>([]);
    const [combo, setCombo] = useState<any>();
    const [reset, setReset] = useState<boolean>(false);
    const [initialRoom, setInitialRoom] = useState<Room[]>([]);
    const { showModal, isModalOpen, handleCancel } = DateFields();
    let totalNet;

    const response = hotelResponse as HotelSearch;
    const [selectedRooms, setSelectedRooms] = useState<
        { roomIndex: number; name: string; price: number }[]
    >([]);
    const [total, setTotal] = useState(0);
    const { rooms } = hotelsRequest;

    const bookArr = roomResponse.map(value => ({
        roomKey: value.roomKey,
        roomIndex: value.roomIndex,
    }));

    useEffect(() => {
        if (response) {
            if (response.hotelDetails) {
                const firstItemData = response.hotelDetails.data as HotelDetail[];
                const firstItem = firstItemData[0];
                setDetails({
                    name: firstItem.name,
                    description: firstItem.description,
                    images: firstItem.images,
                    location: `${firstItem.city},${firstItem.address}`,
                    startRate: firstItem.starRating,
                    facilities: firstItem.hotelFacilities,
                });
                setIsLoading(false);
            }
            if (response.moreRooms) {
                const roomData = response.moreRooms.data as roomDetails[];

                if (roomData?.length > 0) {
                    const roomsArr = roomData[0].rooms;
                    setRoomInfo(roomsArr);
                    setInitialRoom(roomsArr);
                    setCombo(roomData[0].roomCombinations);
                }
            }
        }
    }, [response, keyData]);

    const minNetAmounts: { [key: number]: any } = {};
    roomInfo.forEach(room => {
        const { roomIndex } = room;
        const currentMinRoom = minNetAmounts[roomIndex];
        if (!currentMinRoom || room.roomRate.netAmount < currentMinRoom.roomRate.netAmount) {
            // If there's no current minimum or the current room has a smaller netAmount
            minNetAmounts[roomIndex] = room;
        }
    });
    const locationString = details?.location;
    const locationParts = locationString?.split(',');
    const reservedRoomData = Object.values(minNetAmounts);

    // const totalPrice = reservedRoomData?.reduce(
    //     (Price, roomData) => Price + Number(roomData?.roomRate?.netAmount),
    //     0
    // );
    const totalPrice = roomResponse?.reduce((Price, roomData) => Price + Number(roomData.price), 0);
    const handleReset = () => {
        if (roomResponse.length > 0) {
            setReset(true);
            setTimeout(() => {
                dispatch(resetRoomResponse());
                setRoomInfo(initialRoom);
                setReset(false);
            }, 500);
        }
    };

    const handleRoomSelect = (
        roomIndex: number,
        roomId: string,
        name: string,
        price: number,
        roomKey: string,
        isAdd: any
    ) => {
        dispatch(setRoom({ isAdd, roomInfo: { name, roomId, roomIndex, price, roomKey } }));

        // If the selected room has fixedcombo set to false, remove rooms with fixedcombo set to true
        const selectedRoom = roomInfo.find(room => room.roomKey === roomKey);
        if (selectedRoom && !selectedRoom.ratePlan.fixedCombo) {
            const filteredRoomInfo = roomInfo.filter(room => room.ratePlan.fixedCombo !== true);
            setRoomInfo(filteredRoomInfo);
        } else {
            // Check if any combo contains the selected room's roomId
            const selectedCombo = combo.find((comboArr: string[]) => comboArr.includes(roomId));
            if (selectedCombo) {
                const filteredRoomInfo = roomInfo.filter(room =>
                    selectedCombo.includes(room.roomId)
                );
                setRoomInfo(filteredRoomInfo);
            }
        }
    };

    useEffect(() => {
        dispatch(resetRoomResponse());
    }, []);

    const handleSubmit = () => {
        dispatch(setRoomDetails(reservedRoomData));
        if (rooms.length !== roomResponse.length) {
            dispatch(
                showToast({
                    description: 'Please select a room',
                    variant: 'error',
                })
            );
        } else {
            setLoading(true);
            PrebookDetails(
                keyData.hotelKey,
                keyData.conversationId,
                keyData.searchKey,
                bookArr
            ).then(data => {
                setLoading(false);
                dispatch(getBookingKey(data?.data[0]?.hotel.bookingKey));
                dispatch(getPrebookData(data?.data[0].hotel.rooms));
                dispatch(setPrebookResponse(data?.cancellationPolicy));

                dispatch(setNetAmount(data?.data[0].hotel.totalNet));
                setChangedPrice(data?.data[0]?.hotel?.totalNet);

                if (
                    data?.data[0]?.hotel?.priceChangeIndicator === true ||
                    data?.data[0]?.hotel?.totalNet !== totalPrice
                ) {
                    showModal();
                } else if (
                    data.data[0]?.mandatoryBookData?.PassportDetails?.isPassportMandatory === true
                ) {
                    dispatch(
                        showToast({
                            description: 'This hotel is not available for booking',
                            variant: 'error',
                        })
                    );
                    navigate(paths.hotels.details);
                } else {
                    dispatch(resetUserDetails());

                    // handleSubmission()
                    navigate(paths.hotels.userDetails);
                }
            });
        }
    };

    const screens = useBreakpoint();

    function filterRoomInfo(roomIndex: any) {
        return roomInfo.filter(info => info.roomIndex === roomIndex);
    }

    function renderRooms() {
        return rooms.map(room => {
            const filteredRoomInfo = roomInfo.filter(info => info.roomIndex === room.roomIndex);

            return (
                <Rooms
                    key={room.roomIndex}
                    filteredRoomInfo={filteredRoomInfo}
                    roomData={room}
                    handleRoomSelect={handleRoomSelect}
                    reset={reset}
                />
            );
        });
    }
    return (
        <>
            {Loading ? (
                <Row gutter={10}>
                    <Col span={18}>
                        <Skeleton.Input
                            style={{ height: '300px' }}
                            className="w-full mt-4"
                            active={Loading}
                            size="large"
                            block
                        />
                        <Skeleton className="mt-5" active paragraph={{ rows: 3 }} />
                    </Col>
                    <Col span={6}>
                        <Skeleton active paragraph={{ rows: 15 }} />
                    </Col>
                </Row>
            ) : (
                <>
                    <Typography.Text
                        className="font-medium"
                        data-testid="hotelname"
                        style={{ fontSize: '1.3rem' }}
                    >
                        {details?.name}
                    </Typography.Text>
                    <Flex justify="space-between" className="mt-3">
                        <Flex align="center">
                            <Typography.Text
                                data-testid="cityname"
                                className=" text-sm  text-slate-500"
                            >
                                {locationParts?.map(
                                    (part, index) =>
                                        index > 0 && (
                                            <span key={index}>
                                                {part.trim()}
                                                {index !== locationParts.length - 1 && ','}
                                                &nbsp;&nbsp;
                                            </span>
                                        )
                                )}
                            </Typography.Text>
                        </Flex>
                    </Flex>
                    <Row gutter={16} className="mt-5">
                        <Col xl={17} sm={24} className="">
                            <ViewHotel image={details?.images} />

                            <Overview description={details?.description} />

                            <Flex className="pt-5" justify="space-between">
                                <Typography.Text
                                    data-testid="selectroom"
                                    className="font-medium text-base"
                                >
                                    Select Room
                                </Typography.Text>
                                <Typography.Text
                                    className="font-medium text-red-500 cursor-pointer"
                                    onClick={!reset ? handleReset : undefined}
                                >
                                    Reset Rooms
                                </Typography.Text>
                            </Flex>

                            {renderRooms()}
                            <Divider className="mt-5" />
                        </Col>
                        <Col xl={7} sm={24} className=" w-full">
                            <Flex
                                vertical
                                className=" md:mt-0 mt-5 border border-gray-200 p-6  rounded"
                            >
                                <Typography.Title level={5}>Total Amount</Typography.Title>
                                <Flex vertical className=" mt-4" gap={15}>
                                    <CheckoutTextRow
                                        text="Sub total"
                                        value={totalPrice.toFixed(2)}
                                    />
                                    <CheckoutTextRow text="Taxes and fees" value="0.00" />
                                    {/* <CheckoutTextRow text="VAT " value="0" /> */}

                                    <Divider className="m-0" />

                                    <CheckoutTextRow
                                        text="Total"
                                        value={totalPrice.toFixed(2)}
                                        bold
                                    />
                                    {/* <Link to={paths.hotels.userDetails}> */}
                                    <Button
                                        danger
                                        type="primary"
                                        className="w-full font-medium px-5 h-10 "
                                        data-testid="bookahotel"
                                        onClick={handleSubmit}
                                        loading={isloading}
                                    >
                                        Book a Hotel
                                    </Button>
                                    {/* </Link> */}
                                </Flex>
                            </Flex>
                        </Col>
                    </Row>
                    <PriceChange
                        actualPrice={totalPrice}
                        changedPrice={changedPrice}
                        isModalOpen={isModalOpen}
                        handleCancel={handleCancel}
                    />
                </>
            )}
        </>
    );
};

export default RoomSelection;
