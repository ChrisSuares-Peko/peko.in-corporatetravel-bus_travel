import { useEffect, useState } from 'react';

import { Button, Col, Divider, Flex, Row, Skeleton, Typography, theme } from 'antd';
import { useNavigate } from 'react-router-dom';

import HotelviewSm from '@domains/dashboard/Hotels/Components/ViewHotel/HotelviewSm';
import CheckoutTextRow from '@src/domains/dashboard/GiftCards/components/CheckoutTextRow';
import Overview from '@src/domains/dashboard/Hotels/Components/ViewHotel/Overview';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import Rooms from './Rooms';
import DateFields from '../../hooks/useDateField';
import usePrebookApi from '../../hooks/usePrebookApi';
import {
    getBookingKey,
    getPrebookData,
    resetRoomResponse,
    resetUserDetails,
    setRoom,
    setRoomDetails,
} from '../../slices/getHotelSlice';
import { HotelDetail, HotelSearch, Room, roomDetails } from '../../types/hotelTypes';

interface basicDetails {
    name: string;
    description: string;
    startRate: string;

    location: string;
    facilities: any;
    images: string;
}

const HotelviewSmall = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState<boolean>(false);
    const [isloading, setLoading] = useState(false);
    const [Loading, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    const [changedPrice, setChangedPrice] = useState<number | undefined>();
    const { PrebookDetails } = usePrebookApi();
    const { hotelResponse, roomResponse, hotelsRequest, keyData } = useAppSelector(
        state => state.reducer.hotels
    );
    const { showModal, isModalOpen, handleCancel } = DateFields();

    const {
        token: { colorPrimary },
    } = theme.useToken();

    const [details, setDetails] = useState<basicDetails>();
    const [roomInfo, setRoomInfo] = useState<Room[]>([]);
    const [combo, setCombo] = useState<any>();
    const [reset, setReset] = useState<boolean>(false);
    const [initialRoom, setInitialRoom] = useState<Room[]>([]);
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

    const handleRoomSelect = (
        roomIndex: number,
        roomId: string,
        name: string,
        price: number,
        roomKey: string,
        isAdd: any
    ) => {
        dispatch(setRoom({ isAdd, roomInfo: { name, roomId, roomIndex, price, roomKey } }));
        const selectedRoom = roomInfo.find(room => room.roomKey === roomKey);
        if (selectedRoom && !selectedRoom.ratePlan.fixedCombo) {
            const filteredRoomInfo = roomInfo.filter(room => room.ratePlan.fixedCombo !== true);
            setRoomInfo(filteredRoomInfo);
        } else {
            const selectedCombo = combo.find((comboArr: string[]) => comboArr.includes(roomId));
            if (selectedCombo) {
                const filteredRoomInfo = roomInfo.filter(room =>
                    selectedCombo.includes(room.roomId)
                );
                setRoomInfo(filteredRoomInfo);
            }
        }
    };

    const handleSubmit = () => {
        const reservedRoomData = Object.values(minNetAmounts);
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
                setChangedPrice(data?.data[0]?.hotel?.totalNet);

                if (
                    data?.data[0]?.hotel?.priceChangeIndicator === true ||
                    data?.data[0]?.hotel?.totalNet !== totalPrice
                ) {
                    showModal();
                } else {
                    dispatch(resetUserDetails());

                    // handleSubmission()
                    navigate(paths.hotels.userDetails);
                }
            });
        }
    };

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

    useEffect(() => {
        if (response) {
            if (response.hotelDetails) {
                const firstItemData = response.hotelDetails.data as HotelDetail[];
                const firstItem = firstItemData[0];
                setDetails({
                    name: firstItem.name,
                    description: firstItem.description,
                    images: firstItem.images[0]?.path,
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
    }, [response]);

    const minNetAmounts: { [key: number]: any } = {};
    roomInfo.forEach(room => {
        const { roomIndex } = room;
        const currentMinRoom = minNetAmounts[roomIndex];
        if (!currentMinRoom || room.roomRate.netAmount < currentMinRoom.roomRate.netAmount) {
            minNetAmounts[roomIndex] = room;
        }
    });
    const reservedRoomData = Object.values(minNetAmounts);
    const totalPrice = reservedRoomData?.reduce(
        (Price, roomData) => Price + Number(roomData?.roomRate?.netAmount),
        0
    );

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
                <Skeleton />
            ) : (
                <>
                    <HotelviewSm details={details} price={totalPrice.toFixed(2)} />
                    <Overview description={details?.description} />
                    <Flex className="pt-5" justify="space-between">
                        <Typography.Text className="font-medium text-base">
                            Select Room
                        </Typography.Text>
                        <Typography.Text
                            className="text-red-500 cursor-pointer font-medium"
                            onClick={handleReset}
                        >
                            Reset Rooms
                        </Typography.Text>
                    </Flex>
                    {renderRooms()}
                    <Divider className="mt-5" />
                    <Row>
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
                </>
            )}
        </>
    );
};

export default HotelviewSmall;
