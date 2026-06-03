import React from 'react';

import { Button, Flex, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import useUpdateBooking from '../../hooks/useUpdateBooking';

const isUpcoming = (departure: string) => {
    const departureDate = new Date(departure);
    const now = new Date();
    return !(departureDate < now);
};
export default function HeadPart() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const orderDetails = useAppSelector(state => state.reducer.airline.orderDetails);
    const { bookingStatus } = orderDetails?.orderResponse?.data[0] || '';
    const departure =
        orderDetails?.orderResponse?.data[0]?.journey[0]?.flightSegments[0]?.departureDateTime;

    const { HandleUpdateBooking } = useUpdateBooking();
    const handleRetry = async (id: number) => {
        await HandleUpdateBooking(id);
        dispatch(showToast({ description: 'Booking request sent', variant: 'success' }));
    };
    return (
        <Row justify="space-between">
            <Flex vertical gap={14}>
                <Typography.Text className="text-xl font-medium">
                    Modify/Cancel Booking
                </Typography.Text>
            </Flex>
            {orderDetails && (
                <>
                    {bookingStatus === 'TICKETED' && isUpcoming(departure) && (
                        <Flex gap={10}>
                            <Button
                                type="primary"
                                danger
                                disabled
                                onClick={() =>
                                    navigate(
                                        `${paths.dashboard.corporateTravel}/${paths.airline.index}/${paths.airline.manage}/${paths.airline.bookingDetails}/${paths.airline.modify}`
                                    )
                                }
                            >
                                Modify Booking
                            </Button>
                            <Button
                                danger
                                onClick={() =>
                                    navigate(
                                        `${paths.dashboard.corporateTravel}/${paths.airline.index}/${paths.airline.manage}/${paths.airline.bookingDetails}/${paths.airline.cancelDetails}`
                                    )
                                }
                            >
                                Cancel Booking
                            </Button>
                        </Flex>
                    )}

                    {orderDetails?.ecomOrderStatus === 'CANCELLED' && (
                        <Typography.Text className="text-red-400">
                            Cancelled and refund requested
                        </Typography.Text>
                    )}
                    {orderDetails?.ecomOrderStatus === 'REFUNDED' && (
                        <Typography.Text className="text-red-400">
                            Cancelled and refunded
                        </Typography.Text>
                    )}
                    {(bookingStatus === 'BOOKING FAILED' ||
                        bookingStatus.status === 'PNR FAILED') && (
                        <Typography.Text className="text-red-400">Booking failed</Typography.Text>
                    )}
                    {bookingStatus === 'OK TO TICKET' && (
                        <>
                            <Typography.Text className="text-red-400 text-center">
                                Booking is pending retry after <br />
                                some time
                            </Typography.Text>
                            <Button
                                danger
                                type="primary"
                                className="w-40 flex justify-center"
                                style={{ borderRadius: '0.125rem' }}
                                onClick={() => handleRetry(Number(orderDetails.id))}
                            >
                                Retry
                            </Button>
                        </>
                    )}
                </>
            )}
        </Row>
    );
}
