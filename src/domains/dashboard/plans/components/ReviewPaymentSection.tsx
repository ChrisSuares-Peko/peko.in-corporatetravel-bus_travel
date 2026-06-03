import React from 'react';

import { Button, Card, Divider, Flex, Image, Row, Typography } from 'antd';

import { FRONTEND_BASE_URL } from '@src/config-global';
import cardLogo from '@src/domains/dashboard/payments/assets/svg/card-logo.svg';
import { paths } from '@src/routes/paths';

import { GrayText, BoldText } from './CustomText';
import usePaymentRequest from '../hooks/usePaymentRequset';
import { PackageDetailsResponse, SelectedType } from '../types';

type Props = {
    data: PackageDetailsResponse;
    selectedType: SelectedType;
    finalPrice: number;
    planId: number;
    currentPlanDiscount: number;
};

const ReviewPaymentSection = ({
    data,
    selectedType,
    finalPrice,
    planId,
    currentPlanDiscount,
}: Props) => {
    const { Text } = Typography;
    const { handlePaymentRequest, isLoading: paymentLoading } = usePaymentRequest();
    const handleSubscribePackage = () => {
        handlePaymentRequest({
            billingType: selectedType.toUpperCase(),
            amount: finalPrice,
            packageId: planId,
            successUrl: `${FRONTEND_BASE_URL}/${paths.plans.index}/${paths.plans.paymentsuccess}`,
            failureUrl: `${FRONTEND_BASE_URL}/${paths.plans.index}/${paths.plans.paymentFailure}`,
        });
    };
    return (
        <Flex
            className="w-full h-full text-xs md:w-3/6 lg:w-2/6"
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
                    <GrayText text="Base Price" />
                    <BoldText text={`AED ${data?.packageDetails?.packagePrices[selectedType]}`} />
                </Flex>
                <Flex justify="space-between">
                    <GrayText text="Discount" />
                    <BoldText text={`AED ${data?.packageDetails?.discount[selectedType]}`} />
                </Flex>
                {currentPlanDiscount !== 0 ? (
                    <>
                        <Flex justify="space-between">
                            <GrayText text="Current Plan Balance" />
                            <BoldText text={`AED ${currentPlanDiscount}`} />
                        </Flex>
                        <Typography.Text className="text-xs text-green-500">
                            {data?.discount.message}
                        </Typography.Text>
                    </>
                ) : (
                    <Flex justify="space-between">
                        <GrayText text="Total Amount" />
                        <BoldText text={`AED ${finalPrice}`} />
                    </Flex>
                )}

                <Divider />
                <Flex justify="space-between">
                    <BoldText text="Total" />
                    <BoldText text={`AED ${finalPrice}`} />
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
    );
};

export default ReviewPaymentSection;
