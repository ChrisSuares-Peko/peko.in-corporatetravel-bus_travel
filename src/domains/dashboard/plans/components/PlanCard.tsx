/* eslint-disable eqeqeq */
import { useState } from 'react';

import { Col, Flex, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import voucher from '@assets/svg/voucher.svg';
import { PekoPackages } from '@customtypes/general';
import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import ListPoints from './ListPoints';
import SubscriptionCodeModal from './SubscriptionCodeModal';
import { PlanType } from '../types';
import { calculateDiscount } from '../utils';

type Props = {
    planId: number;
    feature: string[];
    benefits?: string[];
    planName: string;
    price: string | number;
    discount: number;
    isPopular?: boolean;
    selectedType: PlanType;
    type: 'CURRENT' | 'UPGRADE' | 'DOWNGRADE';
};

const PlanCard = ({
    planId,
    isPopular,
    price,
    planName,
    feature,
    benefits,
    type,
    selectedType,
    discount,
}: Props) => {
    const navigate = useNavigate();

    const [openVoucherModal, setOpenModal] = useState(false);
    const { discountedAmount, discountPercentage } = calculateDiscount(price, discount);
    const { Text } = Typography;
    return (
        <Col key={planId} xs={24} sm={12} md={10} lg={11} xl={8} className="pt-3">
            <Flex className="flex-col h-full transition duration-300 transform border rounded-2xl">
                {isPopular && (
                    <Flex justify="center" className="w-full py-2 bg-red-50 rounded-t-2xl">
                        <Typography.Text className="text-base font-medium text-lightRed">
                            Most Popular
                        </Typography.Text>
                    </Flex>
                )}
                <Flex className="flex-col flex-grow gap-4 px-8 py-6">
                    <Flex className="flex-col flex-grow gap-4">
                        <Typography.Text className="text-lg font-medium md:text-xl text-lightRed">
                            {planName}
                        </Typography.Text>
                        <Flex vertical align="flex-start" justify="center">
                            <Typography.Text className="text-xl font-normal">
                                {price == 0 ? `` : `AED `}
                                <Typography.Text className="text-3xl font-medium ">
                                    {price == 0
                                        ? `Free`
                                        : `${formatNumberWithLocalString(discountedAmount, 0)} `}
                                    {price != 0 && (
                                        <>
                                            {discountedAmount != price ? (
                                                <Text className="text-2xl font-normal line-through text-textGray">
                                                    {formatNumberWithLocalString(price, 0)}
                                                </Text>
                                            ) : (
                                                ''
                                            )}
                                            {discountPercentage && discountPercentage > 0 ? (
                                                <Text className="h-full px-2 py-2 mx-2 text-base text-green-700 rounded-sm bg-green-50">
                                                    {formatNumberWithLocalString(
                                                        discountPercentage,
                                                        0,
                                                        0
                                                    )}
                                                    % off
                                                </Text>
                                            ) : (
                                                ''
                                            )}
                                        </>
                                    )}
                                </Typography.Text>
                            </Typography.Text>
                            {planName !== PekoPackages.Basic && (
                                <Typography.Text className="pt-1 text-xs">
                                    {selectedType === PlanType.Monthly ? 'per month' : 'per year'}
                                    {/* <Tooltip
                                        title={
                                            selectedType === PlanType.Monthly
                                                ? 'A month is considered to be 30 days.'
                                                : 'A year is considered to be 365 days.'
                                        }
                                    > */}
                                    {/* <InfoCircleOutlined className="ml-1" /> */}
                                    {/* </Tooltip> */}
                                </Typography.Text>
                            )}
                        </Flex>
                        <Typography.Text className="font-medium">Services</Typography.Text>
                        <ListPoints itemsWithTicks={feature} itemsWithoutTicks={benefits} />
                    </Flex>
                    <Flex className="mt-4">
                        {planName === PekoPackages.Basic ? (
                            <Button disabled className="w-full">
                                {type === 'CURRENT' ? 'Current Plan' : 'Basic Plan'}
                            </Button>
                        ) : (
                            <>
                                {type === 'CURRENT' && (
                                    <Button disabled className="w-full">
                                        Current Plan
                                    </Button>
                                )}
                                {type === 'UPGRADE' && (
                                    <Button
                                        className="w-full"
                                        type="primary"
                                        danger
                                        onClick={() => {
                                            const details = {
                                                planType: selectedType,
                                            };
                                            sessionStorage.setItem(
                                                'PurchaseUrl',
                                                JSON.stringify(details)
                                            );
                                            navigate(paths.plans.reviewOrder, {
                                                state: {
                                                    planId,
                                                    feature,
                                                    selectedType,
                                                    isAddOns: false,
                                                },
                                            });
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                )}
                                {type === 'DOWNGRADE' && (
                                    <Button disabled className="w-full">
                                        {planName} Plan
                                    </Button>
                                )}
                            </>
                        )}
                    </Flex>
                    {planName !== PekoPackages.Basic && type !== 'CURRENT' ? (
                        <Flex
                            justify="center"
                            align="center"
                            gap={5}
                            className="mt-2 cursor-pointer"
                            onClick={() => setOpenModal(true)}
                        >
                            <ReactSVG src={voucher} />
                            <Typography.Text>I have a voucher code</Typography.Text>
                        </Flex>
                    ) : (
                        <div className="min-h-7" />
                    )}
                </Flex>
            </Flex>
            {openVoucherModal && (
                <SubscriptionCodeModal
                    open={openVoucherModal}
                    handleCancel={() => setOpenModal(false)}
                />
            )}
        </Col>
    );
};

export default PlanCard;
