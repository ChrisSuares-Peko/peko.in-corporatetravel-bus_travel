import React from 'react';

import { Result, Button, Typography, Image, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';

import verified from '@assets/icons/Verified.svg';
import { paths } from '@src/routes/paths';

const { Title, Text } = Typography;

const OrderPlaced: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Result
            icon={<Image src={verified} alt="Verified" className="mx-auto object-cover" />}
            title={
                <Title level={4} className="font-roboto font-medium text-text-gray-900">
                    Voila! Your order has been successfully placed
                </Title>
            }
            subTitle={
                <Flex className="w-full md:w-1/2 mx-auto">
                    <Text className="font-roboto text-sm text-gray-500">
                        Your top-up for +971 589126729 is successful. You will receive a
                        confirmation email once the process is completed. Thank you for using Peko.
                    </Text>
                </Flex>
            }
            extra={[
                <Button
                    key="goToOfficeSupplies"
                    className="rounded-sm bg-bgOrange text-xs md:text-base "
                    type="primary"
                    onClick={() => navigate(`/${paths.officeSupplies.index}`)}
                >
                    Go to Office Supplies
                </Button>,
                <Button
                    key="trackShipment"
                    className="rounded-sm text-xs md:text-base"
                    onClick={() => navigate(`/${paths.officeSupplies.index}`)}
                >
                    Track your shipment
                </Button>,
            ]}
        />
    );
};

export default OrderPlaced;
