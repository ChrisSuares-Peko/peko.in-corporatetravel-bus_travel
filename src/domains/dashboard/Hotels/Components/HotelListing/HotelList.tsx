import { RightOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Image, Rate, Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import defaultHotel from '../../Assets/defaultImage.jpg';
import useHotelDetailsApi from '../../hooks/useHotelDetailsApi';
import { resetData, resetRoomResponse, setKeys } from '../../slices/getHotelSlice';

import '../../Assets/style.css';

interface hotelDetails {
    hotelKey: string;
    image: string;
    name: string;
    facilities: string;
    reviews: string;
    searchKey: string;
    conversationId: string;
    price: number;
    style?: React.CSSProperties;
    cancellationPolicy: string;
}

const HotelList = ({
    hotelKey,
    image,
    name,
    facilities,
    reviews,
    style,
    searchKey,
    conversationId,
    price,
    cancellationPolicy,
}: hotelDetails) => {
    const dispatch = useAppDispatch();
    const { hotelDetails } = useHotelDetailsApi();

    const navigate = useNavigate();
    const handleClick = () => {
        dispatch(resetData());
        dispatch(resetRoomResponse());

        dispatch(setKeys({ hotelKey, conversationId, searchKey }));
        hotelDetails(hotelKey, searchKey, conversationId);
        navigate(paths.hotels.hotelView);
    };
    return (
        <Content className="px-7 mt-5">
            <Row
                gutter={[15, 15]}
                className="search-result-card p-3 rounded-md "
                style={{ ...style, background: 'white' }}
            >
                <Col className="" span={7}>
                    <Image
                        width="100%"
                        height={150}
                        className={`rounded-lg object-cover mt-1 ${
                            image === '' ? 'border-b border-t' : ''
                        }`}
                        src={image !== '' ? image : defaultHotel}
                        preview={false}
                    />
                </Col>
                <Col className=" mt-3 " span={17}>
                    <Flex className="w-full" justify="space-between" gap={10}>
                        <Flex className="w-2/3" vertical>
                            {/* <Typography.Text className="text-xs text-gray-500">
                                Entire home in {name}
                            </Typography.Text> */}
                            <Typography.Text className="font-medium text-xl">
                                {name}
                            </Typography.Text>

                            <Flex className="mt-2">
                                <Typography.Text className="text-md text-gray-500">
                                    {facilities}
                                </Typography.Text>
                            </Flex>
                            {/* <Flex className="w-16 mt-1">
                                <Divider />
                            </Flex> */}
                            <Flex vertical className="mt-5">
                                {/* <Flex>
                                    <Typography.Text className="text-sm text-green-700 text-end">
                                        {cancellationPolicy}
                                    </Typography.Text>
                                </Flex> */}
                                <Flex>
                                    <Rate
                                        disabled
                                        defaultValue={Number(reviews)}
                                        className="text-sm mt-1"
                                    />
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex vertical className="">
                            <Flex vertical className="mt-4 w-full" style={{ alignItems: 'center' }}>
                                {/* <Typography.Text className=" text-gray-500">Price</Typography.Text> */}
                                <Typography.Text className="font-medium text-xl">
                                    AED {price.toFixed(2)}
                                </Typography.Text>
                                <Typography.Text className=" text-gray-500 text-sm mt-1">
                                    Includes taxes and charges
                                </Typography.Text>
                            </Flex>

                            <Button
                                danger
                                type="primary"
                                className="w-32 font-medium px-5 ml-5 mt-3 flex items-center justify-center"
                                onClick={handleClick}
                            >
                                <Flex gap={4}>
                                    <Typography.Text className="text-sm text-white  ">
                                        Select Rooms
                                    </Typography.Text>
                                    <RightOutlined className="text-xs font-bold" />
                                    {/* <ReactSVG src={arrow} className='mt-1'/> */}
                                </Flex>
                            </Button>
                        </Flex>
                    </Flex>
                </Col>
            </Row>
        </Content>
    );
};

export default HotelList;
