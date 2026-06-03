import { Col, Flex, Image, Rate, Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

// import hotel1 from '@domains/dashboard/Hotels/Assets/hotel1.png';
import location from '@domains/dashboard/Hotels/Assets/icons/locationIcon.svg';
import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import defaultHotel from '../../Assets/defaultImage.jpg';
import useHotelDetailsApi from '../../hooks/useHotelDetailsApi';
import { setKeys } from '../../slices/getHotelSlice';

interface booked {
    hotelKey: string;
    image: string;
    name: string;
    facilities: string;
    reviews: string;
    searchKey: string;
    conversationId: string;
    price: number;
    cancellationPolicy: string;
}
const BookedSm = ({
    hotelKey,
    image,
    name,
    facilities,
    reviews,
    searchKey,
    conversationId,
    price,
    cancellationPolicy,
}: booked) => {
    const dispatch = useAppDispatch();
    const { hotelDetails } = useHotelDetailsApi();
    const navigate = useNavigate();
    // const address = facilities.split(',');
    // const desc = address[0].trim();
    const handleClick = () => {
        dispatch(setKeys({ hotelKey, conversationId, searchKey }));
        hotelDetails(hotelKey, searchKey, conversationId);
        navigate(paths.hotels.hotelView);
    };
    return (
        <Content
            onClick={handleClick}
            className="w-full border border-solid border-gray-200 rounded-md "
            style={{ boxShadow: '0px 2.248px 18.19px 0px rgba(0, 0, 0, 0.10)' }}
        >
            <Row gutter={12}>
                {/* <Col span={8} style={{ padding: '0.7rem' }}>
                    <Image
                        width={90}
                        height={80}
                        src={image}
                        className="mt-1"
                        style={{ borderRadius: ' 0.425rem 0.425rem 0.425rem 0.425rem ' }}
                    />
                </Col> */}
                <Col span={24} style={{ padding: '0.7rem' }}>
                    <Image
                        width="100%"
                        height={200}
                        src={image !== '' ? image : defaultHotel}
                        className="mt-1"
                        style={{ borderRadius: ' 0.425rem 0.425rem 0.425rem 0.425rem ' }}
                    />
                </Col>
                <Col span={24} className="px-3">
                    <Flex vertical className="px-2">
                        <Flex justify="space-between">
                            <Typography.Text className="font-bold text-medium">
                                {name}
                            </Typography.Text>
                            <Typography.Text className="font-bold">
                                AED {price.toFixed(2)}
                            </Typography.Text>
                        </Flex>
                        <Flex>
                            <Rate
                                disabled
                                defaultValue={Number(reviews)}
                                className="text-xs mt-1"
                            />
                        </Flex>

                        <Flex gap="" className="mb-3">
                            <ReactSVG className="mt-1 fill-amber-600" src={location} />
                            <Typography.Text className="text-xs mt-1 ml-1 ">
                                {facilities}
                            </Typography.Text>
                        </Flex>
                    </Flex>
                </Col>
            </Row>
        </Content>
    );
};

export default BookedSm;
