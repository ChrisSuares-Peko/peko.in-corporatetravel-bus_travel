// Deprecated component
import React from 'react';

import { Flex, Typography, Skeleton, Button, Divider, Card, Row, Image, Form } from 'antd';
import { Formik } from 'formik';
import { capitalize } from 'lodash';
import { ReactSVG } from 'react-svg';

import TextInput from '@components/atomic/inputs/TextInput';
import walletIcon from '@domains/dashboard/plans/assets/icons/wallet.svg';
import { FRONTEND_BASE_URL } from '@src/config-global';
import cardLogo from '@src/domains/dashboard/payments/assets/svg/card-logo.svg';
import useScreenSize from '@src/hooks/useScreenSize';
import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { BoldText, GrayText } from './CustomText';
import ReviewLists from './ReviewLists';
import useApplyCoupon from '../hooks/useApplyCoupon';
import useGetPackageDetails from '../hooks/useGetPackageDetails';
import usePaymentRequest from '../hooks/usePaymentRequset';
import { couponSchema } from '../schema';
import { SelectedType } from '../types';

type Props = {
    selectedType: SelectedType;
    planId: number;
    services?: string[];
};

const PlanDetailsCard = ({ planId, selectedType, services }: Props) => {
    const { data, isLoading } = useGetPackageDetails(planId);

    const packagePrice = data?.packageDetails?.packagePrices?.[selectedType] ?? 0;
    const packageDiscount = data?.packageDetails.discount?.[selectedType] ?? 0; // plans predefined discount
    const currentPlanDiscount = data?.discount?.price ?? 0; // amount of existing plans discount
    const totalPrice = packagePrice - currentPlanDiscount - packageDiscount;
    const {
        isApplied,
        applyCoupon,
        discountAmount,
        isLoading: couponLoading,
        removeCoupon,
        coupon,
    } = useApplyCoupon();
    const finalPrice = totalPrice - discountAmount > 0 ? totalPrice - discountAmount : 0;
    const { handlePaymentRequest, isLoading: paymentLoading } = usePaymentRequest();
    const { lg } = useScreenSize();
    const feature = data?.packageDetails.description.split('\n') || [];
    if (isLoading) {
        return <Skeleton active paragraph={{ rows: 5 }} className="py-20" />;
    }
    const handleSubscribePackage = () => {
        handlePaymentRequest({
            billingType: selectedType.toUpperCase(),
            amount: finalPrice,
            packageId: planId,
            couponCode: isApplied ? coupon : undefined,
            successUrl: `${FRONTEND_BASE_URL}/${paths.plans.index}/${paths.plans.paymentsuccess}`,
            failureUrl: `${FRONTEND_BASE_URL}/${paths.plans.index}/${paths.plans.paymentFailure}`,
        });
    };
    const { Text } = Typography;
    return (
        <Flex gap={30} vertical={!lg}>
            <Flex
                className="w-full h-full px-10 py-8 text-xs border border-gray-200 border-solid lg:w-4/6 rounded-xl"
                justify="space-between"
                align="flex-start"
                vertical
                gap={24}
            >
                <Flex justify="center" align="center">
                    <Text className="text-lg font-medium">
                        {Array.isArray(services) && services?.length > 0 ? (
                            <Typography.Text className="space-x-1 text-lg">
                                {data?.packageDetails.packageName} {capitalize(selectedType)}
                            </Typography.Text>
                        ) : (
                            `${data?.packageDetails.packageName} ${capitalize(selectedType)}`
                        )}
                    </Text>
                    {/* <Tag bordered={false} className="mx-2 text-red-500 rounded-sm bg-red-50">
                    15% off
                </Tag> */}
                </Flex>
                {Array.isArray(services) && services?.length > 0 && (
                    <ReviewLists
                        items={services}
                        itemsPerColumn={Math.ceil(services.length / 2)}
                        showTicks
                        title="Services"
                    />
                )}
                {Array.isArray(feature) && !services && feature?.length > 0 && (
                    <ReviewLists
                        items={feature}
                        itemsPerColumn={Math.ceil(feature.length / 2)}
                        showTicks={false}
                        title="Features"
                    />
                )}
            </Flex>
            <Flex
                className="w-full h-full text-xs md:w-4/6 lg:w-2/6"
                justify="space-between"
                align="flex-start"
                vertical
                gap={24}
            >
                <Flex
                    className="w-full h-full px-6 pt-5 pb-2 text-xs border border-gray-200 border-solid rounded-xl"
                    justify="space-between"
                    align="flex-start"
                    vertical
                    gap={5}
                >
                    <Typography.Text className="text-lg font-medium">
                        Apply Coupon Or Gift Card
                    </Typography.Text>
                    <Typography.Text className="text-base font-normal text-gray-500">
                        Have a discount/coupon code to redeem
                    </Typography.Text>
                    <Formik
                        initialValues={{ couponCode: '' }}
                        onSubmit={values => {
                            applyCoupon(values.couponCode, totalPrice);
                        }}
                        onReset={(values, { setSubmitting, setErrors }) => {
                            setSubmitting(false);
                            removeCoupon();
                            setTimeout(() => setErrors({}), 100);
                        }}
                        validationSchema={couponSchema}
                    >
                        {({ handleSubmit, resetForm }) => (
                            <Form
                                onFinish={handleSubmit}
                                className="flex w-full gap-4 mt-5 align-middle"
                                layout="vertical"
                            >
                                <TextInput
                                    name="couponCode"
                                    placeholder="Enter coupon/discount code"
                                    type="text"
                                    size="large"
                                    isDisabled={isApplied}
                                    maxLength={25}
                                />

                                {isApplied ? (
                                    <Button
                                        htmlType="reset"
                                        size="large"
                                        type="primary"
                                        danger
                                        onClick={() => {
                                            // removeCoupon()
                                            resetForm();
                                        }}
                                    >
                                        Remove
                                    </Button>
                                ) : (
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        size="large"
                                        danger
                                        loading={couponLoading}
                                    >
                                        Apply
                                    </Button>
                                )}
                            </Form>
                        )}
                    </Formik>
                </Flex>
                {isApplied && (
                    <Flex
                        className="w-full h-full px-5 py-4 text-xs duration-100 ease-in-out border border-gray-200 border-solid bg-paymentGreen rounded-xl"
                        justify="space-between"
                        align="center"
                        gap={24}
                    >
                        <ReactSVG src={walletIcon} />
                        <Typography.Text className="text-sm font-normal text-textWhite">
                            Congratulations! Your coupon code applied to payment
                        </Typography.Text>
                    </Flex>
                )}
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
                    <Typography.Text className="text-lg font-medium text-zinc-900">
                        Total Amount
                    </Typography.Text>
                    <Flex justify="space-between">
                        <GrayText text="Base price" />
                        <BoldText
                            text={`AED ${formatNumberWithLocalString(data?.packageDetails?.packagePrices[selectedType])}`}
                        />
                    </Flex>
                    <Flex justify="space-between">
                        <GrayText text="Discount" />
                        <BoldText
                            text={`AED ${formatNumberWithLocalString(data?.packageDetails?.discount[selectedType])}`}
                        />
                    </Flex>
                    {currentPlanDiscount !== 0 ? (
                        <>
                            <Flex justify="space-between">
                                <GrayText text="Current Plan Balance" />
                                <BoldText
                                    text={`AED ${formatNumberWithLocalString(currentPlanDiscount)}`}
                                />
                            </Flex>
                            <Typography.Text className="text-xs text-green-500">
                                {data?.discount.message}
                            </Typography.Text>
                        </>
                    ) : (
                        ''
                    )}
                    {isApplied && (
                        <Flex justify="space-between">
                            <GrayText text="Coupon discount" />
                            <BoldText text={`AED ${formatNumberWithLocalString(discountAmount)}`} />
                        </Flex>
                    )}

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

export default PlanDetailsCard;
