import { Grid, Typography, Row, Col } from 'antd';
import { Content } from 'antd/es/layout/layout';

import { useAppSelector } from '@src/hooks/store';

import useTimeConvert from '../../hooks/useTimeConvertHook';

const { useBreakpoint } = Grid;
const { Text } = Typography;

interface HotelProps {
    hotel?: string;
    details?: any;
    checkInTime?: any;
    checkoutTime?: any;
}

const Bookings = ({ hotel, details, checkoutTime, checkInTime }: HotelProps) => {
    const screens = useBreakpoint();
    const { hotelsRequest, roomResponse, hotelResponse } = useAppSelector(
        state => state.reducer.hotels
    );
    const { convertToAMPM } = useTimeConvert();

    const totalAdult = hotelsRequest.rooms.reduce((total, obj) => total + (obj.adult || 0), 0);
    const totalChild = hotelsRequest.rooms.reduce((total, obj) => total + (obj.child || 0), 0);
    const totalAmt =
        roomResponse?.reduce((totalPrice, roomData) => totalPrice + Number(roomData?.price), 0) ??
        0;

    const checkIn = new Date(hotelsRequest.checkIn);
    const checkout = new Date(hotelsRequest.checkOut);
    const timeDiff = checkout.getTime() - checkIn.getTime();
    const nightDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const inTime = checkInTime === '' ? '' : convertToAMPM(checkInTime);
    const outTime = checkoutTime === '' ? '' : convertToAMPM(checkoutTime);

    return (
        <Content className="">
            <Content className="rounded-md border border-gray-200">
                <Content className="p-5" style={screens.md ? { width: '26.56rem' } : {}}>
                    <Text className="font-bold mt-3">Your Booking Summary</Text>

                    <Row gutter={[16, 16]} className="pt-5">
                        <Col span={12}>
                            <Text className="text-textGreyColor">Check In</Text>
                            <Text className="mt-1 block text-base" data-testid="checkin">
                                {checkIn.toLocaleDateString()}
                            </Text>
                            <Text className="text-sm">{inTime}</Text>
                        </Col>
                        <Col span={12}>
                            <Text className="text-textGreyColor">Check Out</Text>
                            <Text className="mt-1 block text-base" data-testid="checkout">
                                {checkout.toLocaleDateString()}
                            </Text>
                            <Text className="text-sm">{outTime}</Text>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} className="pt-5">
                        <Col span={12}>
                            <Text className="text-textGreyColor">Total guests</Text>
                            <Text className="mt-1 block text-base">
                                {totalAdult} {totalAdult === 1 ? 'Adult' : 'Adults'},&nbsp;
                                {totalChild} {totalChild <= 1 ? 'Child' : 'Children'}
                            </Text>
                        </Col>
                        <Col span={12}>
                            <Text className="text-textGreyColor">Total rooms</Text>
                            <Text className="mt-1 block text-base">
                                {hotelsRequest.rooms.length}{' '}
                                {hotelsRequest.rooms.length === 1 ? 'Room' : 'Rooms'}
                            </Text>
                        </Col>
                    </Row>

                    <Row className="pt-5">
                        <Col span={24}>
                            <Text className="text-textGreyColor">Total length of stay</Text>
                            <Text className="mt-1 block text-base">
                                {nightDifference} {nightDifference === 1 ? 'Night' : 'Nights'}
                            </Text>
                        </Col>
                    </Row>
                </Content>
            </Content>
        </Content>
    );
};

export default Bookings;
