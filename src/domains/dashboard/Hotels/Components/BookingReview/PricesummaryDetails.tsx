import { Col, Flex, Row, Typography, theme } from 'antd';

import { useAppSelector } from '@src/hooks/store';

const { Text } = Typography;

interface price {
    total: number;
    room: number;
    taxes: number;
    mediCancel: number;
    ct: number;
}

const PricesummaryDetails = ({ total, room, taxes, mediCancel, ct }: price) => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const { roomResponse, reservedData, netAmount } = useAppSelector(state => state.reducer.hotels);
    // const totalAmt =
    //     reservedData?.reduce(
    //         (totalPrice, roomData) => totalPrice + Number(roomData?.roomRate?.netAmount),
    //         0
    //     ) ?? 0;
    const totalAmt =
        roomResponse?.reduce((totalPrice, roomData) => totalPrice + Number(roomData?.price), 0) ??
        0;
    const bookArr = roomResponse.map(value => value.price);
    return (
        <>
            <Text className="font-bold mt-3">Your Price Summary</Text>
            <Flex vertical>
                {/* {bookArr.map((item, index) => (
                    <>
                        <Flex className="pt-5" justify="space-between">
                            <Text className="mt-1 ">Room {index + 1}</Text>
                            <Text className="mt-1">AED {item}</Text>
                        </Flex>
                        <Flex className="" justify="space-between">
                            <Text className="mt-1">Offer Discount</Text>
                            <Text className="mt-1">AED {0}</Text>
                        </Flex>
                    </>
                ))} */}

                <Row gutter={[16, 16]} className="pt-5">
                    <Col span={12}>
                        <Text className="mt-1">Sub Total</Text>
                    </Col>
                    <Col span={12}>
                        <Text className="mt-1">AED {netAmount}</Text>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} className="pt-5">
                    <Col span={12}>
                        <Text className="mt-1">Taxes and Fees</Text>
                    </Col>
                    <Col span={12}>
                        <Text className="mt-1">AED 0.00</Text>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} className="pt-5">
                    <Col span={12}>
                        <Text className="mt-1">Total Price</Text>
                    </Col>
                    <Col span={12}>
                        <Text className="mt-1">AED {netAmount}</Text>
                    </Col>
                </Row>
            </Flex>
        </>
    );
};

export default PricesummaryDetails;
