import { Flex, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import TruckSvg from '@domains/dashboard/logistics/assets/images/truck.svg';
import { useAppSelector } from '@src/hooks/store';

import { GrayTextLeft } from './CustomText';

type Props = {};

const ReviewLeftCard = (props: Props) => {
    const { originAddress, destinationAddress, shipmentDetails, shippingAmount } = useAppSelector(
        state => state.reducer.logistics
    );

    return (
        <Flex
            vertical
            justify="space-around"
            className="h-full px-6 py-5 border rounded-md sm:rounded-xl border-stone-300 sm:px-12"
        >
            <Flex vertical>
                <ReactSVG className="mb-3 more-services" src={TruckSvg} />
                <Typography.Text className="text-xl font-medium text-gray-800">
                    {shippingAmount.type}
                </Typography.Text>
            </Flex>
            <Flex vertical>
                <Typography.Text className="pb-2 text-sm font-medium">
                    Sender details
                </Typography.Text>
                <GrayTextLeft text={originAddress.Line1} />
                <GrayTextLeft
                    text={`${originAddress.Line2.trim()}, ${originAddress.City}, ${originAddress.CountryCode}`}
                />
                <GrayTextLeft text={`${originAddress.Description}`} />
                <GrayTextLeft text={`${originAddress.Line3}`} />
            </Flex>

            <Flex vertical>
                <Typography.Text className="pb-2 text-sm font-medium ">
                    Receiver details
                </Typography.Text>
                <GrayTextLeft text={destinationAddress.Line1} />
                <GrayTextLeft
                    text={`${destinationAddress.Line2.trim()}, ${destinationAddress.City}, ${destinationAddress.CountryCode}`}
                />
                <GrayTextLeft text={`${destinationAddress.Description}`} />
                <GrayTextLeft text={`${destinationAddress.Line3}`} />
            </Flex>

            <Flex vertical>
                <Typography.Text className="pb-2 text-sm font-medium ">
                    Shipment Content(s)
                </Typography.Text>
                <GrayTextLeft
                    text={shipmentDetails.shipmentContent === 'parcel' ? 'Parcel' : 'Document'}
                />
            </Flex>

            <Flex vertical>
                <Typography.Text className="pb-2 text-sm font-medium ">
                    Number of Pieces
                </Typography.Text>
                <GrayTextLeft text={shipmentDetails.quantity.toString()} />
            </Flex>
            <Flex vertical>
                <Typography.Text className="pb-2 text-sm font-medium ">Weight</Typography.Text>
                <GrayTextLeft text={`${shipmentDetails.actualWeight.toString()} Kg`} />
            </Flex>
        </Flex>
    );
};

export default ReviewLeftCard;
