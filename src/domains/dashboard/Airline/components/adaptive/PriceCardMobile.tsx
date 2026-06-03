import { Col, Collapse, Divider, Row, Typography } from 'antd';

import { useAppSelector } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

const PriceCardMobile = () => {
    const airlineData = useAppSelector(state => state.reducer.airline.selectedAirline);
    const airlineFormData = useAppSelector(state => state.reducer.airline.formData);
    const priceWithoutTax = Number(airlineData.price) - Number(airlineData.totalTax);

    const totalGuests =
        airlineFormData.passengerData.adultCount +
        airlineFormData.passengerData.childCount +
        airlineFormData.passengerData.infantCount;

    return (
        <Row>
            <Col span={24}>
                <Typography.Paragraph className="font-semibold text-base leading-9">
                    Fare Details
                </Typography.Paragraph>
            </Col>
            <Col span={24} className="flex justify-between mt-2">
                <Typography.Text className="font-normal text-sm leading-8">
                    {`Base fare (${totalGuests} traveller)`}
                </Typography.Text>
                <Typography.Text className="font-normal text-sm leading-8">
                    AED {formatNumberWithLocalString(priceWithoutTax)}
                </Typography.Text>
            </Col>
            <Col span={24} className="flex justify-between">
                <Typography.Text className="font-normal text-sm leading-8">
                    Taxes and fees
                </Typography.Text>
                <Typography.Text className="font-normal text-sm leading-8">
                    AED {formatNumberWithLocalString(airlineData.totalTax)}
                </Typography.Text>
            </Col>
            <Divider className="border-t-2 my-2 mx-0" />
            <Col span={12}>
                <Typography.Paragraph className="font-medium text-sm leading-9">
                    Total Price
                </Typography.Paragraph>
            </Col>
            <Col span={12} className="flex justify-end items-center">
                <Typography.Text className="font-semibold text-lg leading-9">
                    AED {formatNumberWithLocalString(airlineData.price)}
                </Typography.Text>
            </Col>
            <Divider className="border-t-2 my-2 mx-0" />
            <Col span={24}>
                <Typography.Paragraph className="font-semibold text-base leading-9">
                    Fare Rules
                </Typography.Paragraph>
            </Col>
            <Divider className="border-t-2 my-2 mx-0" />
            <Col span={24} className="flex justify-between">
                <Typography.Text className="font-normal text-base leading-9">
                    {`${airlineData.offPoint} - ${airlineData.onPoint}`}
                </Typography.Text>
                <Typography.Text className="font-normal text-sm leading-9">
                    <Typography.Text className="text-primaryOrange">
                        Partially Refundable
                    </Typography.Text>
                </Typography.Text>
            </Col>
            <Divider className="border-t-2 my-2 mx-0" />
            <Col span={24}>
                <Collapse
                    size="small"
                    expandIconPosition="end"
                    className="w-full border-none bg-transparent"
                    style={{ padding: 0 }}
                >
                    {/* <Collapse.Panel
                        key="1"
                        style={{ borderBottom: 0 }}
                        header={<p className="text-sm m-0">Cancellation And Date Change Policy</p>}
                    >
                        cancellation policy here....
                    </Collapse.Panel> */}
                </Collapse>
            </Col>
            {/* <Divider className="border-t-2 my-2 mx-0" /> */}
        </Row>
    );
};

export default PriceCardMobile;
