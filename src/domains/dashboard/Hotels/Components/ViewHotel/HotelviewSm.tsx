import { Flex, Image, Typography, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';

import starIcon from '@domains/dashboard/Hotels/Assets/icons/Stars.jpg';

interface basicDetails {
    name: string;
    description: string;
    startRate: string;

    location: string;
    facilities: any;
    images: string;
}
interface detailsProps {
    details: basicDetails | undefined;
    price?: number;
}
const HotelviewSm = ({ details, price }: detailsProps) => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    return (
        <Content className="w-full mt-4 bg-bgLightGray">
            <Content className="p-3">
                <Image src={details?.images} />
                <Flex justify="space-between">
                    <Flex vertical>
                        <Typography.Text className="text-xs font-medium text-gray-400">
                            Entire home in {details?.name}
                        </Typography.Text>
                        <Typography.Text className="font-bold text-gray-500">
                            {details?.name}
                        </Typography.Text>
                    </Flex>
                    <Flex vertical className="mt-2">
                        <Typography.Text
                            className="font-bold mt-1 text-gray-400"
                            style={{ fontSize: '0.57rem' }}
                        >
                            Price/night
                        </Typography.Text>
                        <Typography.Text className="font-bold">AED {price}</Typography.Text>
                    </Flex>
                </Flex>
                <Flex className="pt-3" justify="space-between">
                    <Flex gap="small">
                        <Typography.Text>{details?.startRate}</Typography.Text>
                        <Image
                            className="mt-1"
                            style={{ width: '0.87rem', height: '0.87rem' }}
                            src={starIcon}
                        />
                        <Typography.Text>(318 Revies)</Typography.Text>
                    </Flex>
                </Flex>
            </Content>
        </Content>
    );
};

export default HotelviewSm;
