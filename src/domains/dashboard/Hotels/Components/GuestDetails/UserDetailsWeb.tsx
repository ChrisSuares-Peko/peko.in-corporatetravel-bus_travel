import { createRef, useCallback, useRef, useState } from 'react';

import { Button, Col, Divider, Flex, Grid, Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { roomDetails } from '@domains/dashboard/Hotels/utils/data';
import DetailBookings from '@src/domains/dashboard/Hotels/Components/GuestDetails/DetailBookings';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import RoomDetails from './RoomDetails';
import CheckoutTextRow from '../../../GiftCards/components/CheckoutTextRow';
import { employeeTypes } from '../../../Payroll/types/docAndAssetsTypes';
import { resetUserDetails } from '../../slices/getHotelSlice';

const { useBreakpoint } = Grid;
const UserDetailsWeb = ({
    employeesList,
    generateEmployeesDropdown,
}: {
    employeesList: employeeTypes[];
    generateEmployeesDropdown: (data: employeeTypes[]) => {
        fullName: string;
        value: string;
        label: string;
        dateOfBirth: string;
        gender: string;
        mobileNo: string;
        personalEmail: string;
        passportExpiryDate: string;
    }[];
}) => {
    const screens = useBreakpoint();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        hotelsRequest,
        keyData,
        reservedData,
        formCount,
        roomResponse,
        prebookRoomData,
        prebookResponse,
        netAmount,
    } = useAppSelector(state => state.reducer.hotels);

    const { rooms } = hotelsRequest;
    const roomInfo = rooms as any;
    const [totalForm, setTotalForm] = useState<string[]>([]);

    // const [totalForm, setTotalForm] = useState<string[]>([]);
    let totalCount = 0;

    rooms.forEach(entry => {
        totalCount += entry.adult + entry.child;
    });

    const bookArr = roomResponse.map(value => ({
        roomKey: value.roomKey,
        roomIndex: value.roomIndex,
    }));

    const totalPrice = roomResponse?.reduce((Price, roomData) => Price + Number(roomData.price), 0);
    const formRef = useRef(Array.from({ length: totalCount }, () => createRef()));

    const renderPassengerCard = useCallback(
        (
            passengerType: string,
            roomIndex: number,
            bookingInfo: any,
            passengerKey: number,
            childAge?: number,
            passengerCount?: number
        ) => (
            <DetailBookings
                formRef={formRef.current[roomIndex]}
                passengerType={passengerType}
                passengerKey={passengerKey}
                key={passengerKey}
                roomKey={bookingInfo.roomKey}
                roomIndex={bookingInfo.roomIndex}
                totalForm={totalForm}
                setTotalForm={setTotalForm}
                childAge={childAge} // Pass the child age as a prop
                passengerCount={passengerCount}
                data={employeesList}
                generateEmployeesDropdown={generateEmployeesDropdown}
            />
        ),
        [formRef, totalForm, setTotalForm, employeesList, generateEmployeesDropdown]
    );

    const renderRoomCards = useCallback(() => {
        let totalAdultCount = 0;
        let totalChildCount = 0;

        return rooms.map((room, index) => {
            const bookingInfo = index < roomResponse.length ? roomResponse[index] : null;

            return (
                <div key={index}>
                    {bookingInfo &&
                        Array.from(
                            { length: roomInfo[index].adult + roomInfo[index].child },
                            (_, idx) => {
                                const passengerKey = idx + 1;
                                const passengerType =
                                    idx < roomInfo[index].adult ? 'adult' : 'child';
                                const childAge =
                                    passengerType === 'child'
                                        ? roomInfo[index].childAge[idx - roomInfo[index].adult]
                                        : undefined;

                                let passengerCount;
                                if (passengerType === 'adult') {
                                    totalAdultCount += 1;
                                    passengerCount = totalAdultCount;
                                } else {
                                    totalChildCount += 1;
                                    passengerCount = totalChildCount;
                                }

                                return renderPassengerCard(
                                    passengerType,
                                    idx,
                                    bookingInfo,
                                    passengerKey,
                                    childAge,
                                    passengerCount
                                );
                            }
                        )}
                </div>
            );
        });
    }, [rooms, roomResponse, roomInfo, renderPassengerCard]);

    console.log('prebookResponse', prebookResponse);

    const handleFormSubmit = () => {
        // formRef.current.forEach((ref: any) => ref.current.handleSubmit());
        // if (formCount.length < totalCount)
        formRef.current.forEach((ref: any) => {
            if (ref?.current) {
                ref.current.handleSubmit();
            } else {
                console.log('Form reference is null');
            }
        });

        if (formCount.length === totalCount) {
            dispatch(resetUserDetails());

            navigate(paths.hotels.bookings);
        }
    };

    return (
        <>
            {screens.md ? (
                <Row className="mt-5" gutter={14}>
                    <Col xl={17} sm={24} xs={24}>
                        {renderRoomCards()}
                        {reservedData.map((item, index) => {
                            const policyForRoom = prebookResponse.find((policy: any) => {
                                if (policy.isCombinePolicy) {
                                    return policy.roomIndex.includes(index + 1);
                                }
                                return policy.roomIndex[0] === index + 1;
                            });

                            return (
                                <RoomDetails
                                    key={index}
                                    meal={item.ratePlan.meal}
                                    name={item.roomTypeDesc}
                                    sqft={roomDetails.sqft}
                                    refund={item.ratePlan.cancelPolicyIndicator}
                                    cancellation={item.ratePlan.lastCancellationDate}
                                    rateNotes={prebookRoomData[index]?.rateNotes}
                                    cancellationPolicy={
                                        policyForRoom?.description ||
                                        'No cancellation policy available.'
                                    }
                                />
                            );
                        })}
                    </Col>
                    <Col xl={7} sm={24} className="w-full">
                        <Flex
                            vertical
                            className=" md:mt-0 mt-5 border border-gray-200 p-6  rounded"
                        >
                            <Typography.Title level={5}>Total Amount</Typography.Title>
                            <Flex vertical className=" mt-4" gap={15}>
                                <CheckoutTextRow text="Sub Total" value={totalPrice} />
                                <CheckoutTextRow text="Taxes and Fees" value="0.00" />
                                {/* <CheckoutTextRow text="VAT " value="0" /> */}

                                <Divider className="m-0" />

                                <CheckoutTextRow text="Total" value={totalPrice} bold />
                                <div data-testid="continue">
                                    <Button
                                        danger
                                        type="primary"
                                        className="w-full font-medium px-5 h-10"
                                        onClick={handleFormSubmit}
                                    >
                                        Continue
                                    </Button>
                                </div>
                            </Flex>
                        </Flex>
                    </Col>
                </Row>
            ) : (
                <>
                    <Flex>
                        <Typography.Title level={4}> Guest Details</Typography.Title>
                    </Flex>
                    <Row className="mt-5" gutter={16}>
                        <Col xl={17} sm={24}>
                            <Content
                                style={{
                                    border: '0.0625rem solid #E1E7EE',
                                    borderRadius: '0.3125rem',
                                }}
                            >
                                {renderRoomCards()}
                            </Content>
                            {reservedData.map((item, index) => (
                                <RoomDetails
                                    meal={item.ratePlan.meal}
                                    key={index}
                                    name={item?.roomTypeDesc}
                                    sqft={roomDetails.sqft}
                                    refund={item?.ratePlan.cancelPolicyIndicator}
                                    cancellation={item.ratePlan.lastCancellationDate}
                                    rateNotes={prebookRoomData[index]?.rateNotes}
                                />
                            ))}
                        </Col>
                        <Col sm={24} className="w-full">
                            <Flex
                                vertical
                                className=" md:mt-0 mt-5 border border-gray-200 p-6  rounded"
                            >
                                <Typography.Title level={5}>Total Amount</Typography.Title>
                                <Flex vertical className=" mt-4" gap={15}>
                                    <CheckoutTextRow text="Sub Total" value={netAmount} />
                                    <CheckoutTextRow text="Taxes and Fees" value="0.00" />
                                    {/* <CheckoutTextRow text="VAT " value="0" /> */}

                                    <Divider className="m-0" />

                                    <CheckoutTextRow text="Total" value={netAmount} bold />
                                    <div data-testid="continue">
                                        <Button
                                            danger
                                            type="primary"
                                            className="w-full font-medium px-5 h-10"
                                            onClick={handleFormSubmit}
                                        >
                                            Continue
                                        </Button>
                                    </div>
                                </Flex>
                            </Flex>
                        </Col>
                    </Row>
                    {/* <CheckInRoomDetails roomData={} isModalOpen={isModalOpen} handleCancel={handleCancel}/> */}
                </>
            )}
        </>
    );
};

export default UserDetailsWeb;
