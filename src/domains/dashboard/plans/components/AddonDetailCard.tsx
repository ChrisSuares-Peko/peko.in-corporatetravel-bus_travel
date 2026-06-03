import React from 'react';

import { Button, Card, Divider, Flex, Image, Row, Typography } from 'antd';

import { FRONTEND_BASE_URL } from '@src/config-global';
import cardLogo from '@src/domains/dashboard/payments/assets/svg/card-logo.svg';
import useScreenSize from '@src/hooks/useScreenSize';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import AddonDetails from './AddonDetails';
import { BoldText, GrayText } from './CustomText';
import usePaymentRequest from '../hooks/usePaymentRequset';

type Props = {
    paymentPayload: {
        addonsAccessKey: string;
        packageId: number;
        pgAmount: number;
        quantity: number;
        title: string;
        description: string;
        rows: {
            column1: string;
            column2: string;
            column3: string;
        }[];
    };
};

const AddonDetailCard = ({ paymentPayload }: Props) => {
    const finalPrice = paymentPayload.pgAmount;
    const { lg } = useScreenSize();
    const { Text } = Typography;
    const { handleAddOnPaymentRequest, isLoading: paymentLoading } = usePaymentRequest();
    const { description, rows, title, ...rest } = paymentPayload;
    const handleSubscribePackage = () => {
        handleAddOnPaymentRequest({
            ...rest,
            isAddOns: true,
            accessKey: accessKeys.purchaseSubscription,
            successUrl: `${FRONTEND_BASE_URL}/${paths.plans.index}/${paths.plans.paymentsuccess}`,
            failureUrl: `${FRONTEND_BASE_URL}/${paths.plans.index}/${paths.plans.paymentFailure}`,
        });
    };
    return (
        <Flex gap={30} vertical={!lg}>
            <AddonDetails title={title} description={description} rows={rows} />
            <Flex
                className="w-full h-full text-xs md:w-4/6 lg:w-2/6"
                justify="space-between"
                align="flex-start"
                vertical
                gap={24}
            >
                <Flex
                    className="w-full h-full px-6 py-8 text-xs border border-gray-200 border-solid rounded-xl"
                    justify="space-between"
                    align="flex-start"
                    vertical
                    gap={24}
                >
                    <Typography.Text className="text-lg font-medium">
                        Select Payment Method
                    </Typography.Text>
                    <Card
                        size="small"
                        bordered={false}
                        className="w-full p-3 border border-solid cursor-pointer rounded-xl border-bgOrange2"
                    >
                        <Flex gap={22} align="center">
                            <Image
                                src={cardLogo}
                                alt="logo"
                                className="bg-transparent "
                                preview={false}
                            />
                            <Row className="items-center gap-2 bg-slate-90 sm:gap-5">
                                <Typography.Text className="text-xs sm:text-sm">
                                    Debit/Credit/ATM Cards
                                </Typography.Text>
                            </Row>
                        </Flex>
                    </Card>
                </Flex>
                <Flex
                    className="w-full h-auto px-8 py-6 text-xs border border-gray-200 border-solid rounded-xl"
                    justify="space-between"
                    vertical
                    gap={18}
                >
                    <Text className="text-lg font-medium text-zinc-900">Total Amount</Text>
                    <Flex justify="space-between">
                        <GrayText text="Base price" />
                        <BoldText text={`AED ${formatNumberWithLocalString(finalPrice)}`} />
                    </Flex>
                    <Divider />
                    <Flex justify="space-between">
                        <BoldText text="Total amount" />
                        <BoldText text={`AED ${formatNumberWithLocalString(finalPrice)}`} />
                    </Flex>

                    <Button
                        loading={paymentLoading}
                        onClick={handleSubscribePackage}
                        htmlType="submit"
                        danger
                        type="primary"
                        className="w-full"
                    >
                        Pay Now
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AddonDetailCard;
