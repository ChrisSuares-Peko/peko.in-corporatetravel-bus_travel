import { useEffect } from 'react';

import { Col, Flex, Row, Skeleton } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import BookingDetailsBody from '../components/BookingDetails/BookingDetailsBody';
import HeadCancelBooking from '../components/BookingDetails/HeadCancelBooking';
import useBookingDetails from '../hooks/useBookingDetails';

const BookingDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderDetails = useAppSelector(state => state.reducer.airline.orderDetails);
    const { corporateTxnId, refresh } = location.state || {};

    const { getBookingDetails, isLoading } = useBookingDetails();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            const res = await getBookingDetails(corporateTxnId, refresh);
            if (!res)
                navigate(
                    `${paths.dashboard.corporateTravel}/${paths.airline.index}/${paths.airline.manage}`
                );
        };
        fetchBookingDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [corporateTxnId, navigate, refresh]);

    return (
        <Row>
            <Col span={24}>
                <Flex vertical gap={40}>
                    <HeadCancelBooking />
                    {isLoading || !orderDetails ? <Skeleton /> : <BookingDetailsBody />}
                </Flex>
            </Col>
        </Row>
    );
};

export default BookingDetails;
