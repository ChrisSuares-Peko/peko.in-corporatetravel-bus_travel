import { Col, Grid, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';

import { useAppSelector } from '@src/hooks/store';

import Bookings from '../Components/BookingReview/Bookings';
import PriceSummary from '../Components/BookingReview/PriceSummary';
import Summary from '../Components/BookingReview/Summary';
import { HotelSearch } from '../types/hotelTypes';

const { useBreakpoint } = Grid;
const BookingDetails = () => {
    const screens = useBreakpoint();
    const { hotelResponse, hotelsRequest } = useAppSelector(state => state.reducer.hotels);
    const response = hotelResponse as HotelSearch;

    return (
        <Content>
            {screens.md ? (
                <Row gutter={[30, 30]}>
                    <Col xs={24} md={10} lg={12} xl={10} xxl={10}>
                        <Summary />
                    </Col>
                    <Col xs={24} md={14} lg={12}>
                        <Bookings
                            hotel={response.hotelDetails.data[0].name}
                            details={hotelsRequest}
                            checkInTime={response.hotelDetails.data[0].checkInTime}
                            checkoutTime={response.hotelDetails.data[0].checkOutTime}
                        />
                        <PriceSummary />
                    </Col>
                </Row>
            ) : (
                <>
                    {/* <Bookings
                            hotel={response.hotelDetails.data[0].name}
                            details={hotelsRequest}
                            checkInTime={response.hotelDetails.data[0].checkInTime}
                            checkoutTime={response.hotelDetails.data[0].checkOutTime}
                        />
                    <Button
                        size="middle"
                        className="px-8 w-full rounded-md mt-5"
                        onClick={handleSubmit}
                        style={{
                            backgroundColor: colorPrimary,
                            color: 'white',
                        }}
                    >
                        Continue
                    </Button> */}
                    <Row gutter={[30, 30]}>
                        <Col xs={24} md={10} lg={12} xl={10} xxl={10}>
                            <Summary />
                        </Col>
                        <Col xs={24} md={14} lg={12}>
                            <Bookings
                                hotel={response.hotelDetails.data[0].name}
                                details={hotelsRequest}
                                checkInTime={response.hotelDetails.data[0].checkInTime}
                                checkoutTime={response.hotelDetails.data[0].checkOutTime}
                            />
                            <PriceSummary />
                        </Col>
                    </Row>
                </>
            )}
        </Content>
    );
};

export default BookingDetails;
