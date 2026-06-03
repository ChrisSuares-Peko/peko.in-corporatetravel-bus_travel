import React from 'react';

import { Button, Flex, Form, Modal, Typography } from 'antd';
import { Formik } from 'formik';
import Lottie from 'react-lottie';
import * as Yup from 'yup';

import giftboxAnimation from '@assets/animation/giftboxAnimation.json';
import TextInput from '@components/atomic/inputs/TextInput';
import useSubscriptionCodes from '@src/hooks/useSubscriptionCodes';

interface PropType {
    open: boolean;
    handleCancel: () => void;
}
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: giftboxAnimation,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

const SubscriptionCodeModal = ({ open, handleCancel }: PropType) => {
    const { initialSubmit, checkCouponIsValid, activateSubscriptionCode, isLoading, couponData } =
        useSubscriptionCodes();

    return (
        <Modal
            title={
                <Flex justify="space-between" align="center">
                    <Typography.Text className="text-sm">Voucher Code</Typography.Text>
                </Flex>
            }
            open={open}
            onCancel={handleCancel}
            footer={null}
            centered
        >
            <Formik
                initialValues={{
                    activationCode: '',
                }}
                validationSchema={Yup.object().shape({
                    activationCode: Yup.string()
                        .trim()
                        .required('Please enter your voucher code')
                        .matches(/^[A-Z0-9]{16}$/, 'Invalid voucher code'),
                })}
                onSubmit={async ({ activationCode }) => checkCouponIsValid(activationCode)}
            >
                {({ setFieldValue, handleSubmit, values }) =>
                    initialSubmit ? (
                        <Form>
                            <Typography.Text className="text-base font-textDarkGray">
                                Enter your voucher code to redeem
                            </Typography.Text>
                            <Flex className="mt-4 w-full flex-col md:flex-row md:gap-8">
                                <div className="w-full md:w-[70%]">
                                    <TextInput
                                        name="activationCode"
                                        type="text"
                                        placeholder="Ex: XJHFGSKJFGSDJKHV"
                                        isRequired
                                        classes="rounded-sm h-10 w-full"
                                        maxLength={16}
                                        allowAlphabetsAndNumbersOnly
                                        handleChange={value =>
                                            setFieldValue('activationCode', value.toUpperCase())
                                        }
                                    />
                                </div>
                                <Button
                                    key="submit"
                                    type="primary"
                                    htmlType="submit"
                                    danger
                                    className="h-10 w-full md:w-[30%]"
                                    onClick={() => handleSubmit()}
                                    loading={isLoading}
                                >
                                    Apply
                                </Button>
                            </Flex>
                        </Form>
                    ) : (
                        <Flex vertical gap={5}>
                            <Lottie options={defaultOptions} height={70} width={100} />
                            <Typography.Text className="text-base font-textDarkGray">
                                Congratulations! Your coupon code is valid. Would you like to
                                activate the {couponData?.package.packageName}{' '}
                                {couponData?.billingType === 'ANNUALLY' ? 'annual' : 'monthly'}{' '}
                                subscription now?
                            </Typography.Text>
                            <Flex className="w-full mt-5" justify="flex-end" gap={20}>
                                <Button key="back" onClick={handleCancel} className="rounded-sm">
                                    Cancel
                                </Button>
                                <Button
                                    key="submit"
                                    type="primary"
                                    danger
                                    loading={isLoading}
                                    onClick={() => activateSubscriptionCode(values.activationCode)}
                                    className="rounded-sm"
                                >
                                    Confirm
                                </Button>
                            </Flex>
                        </Flex>
                    )
                }
            </Formik>
        </Modal>
    );
};

export default SubscriptionCodeModal;
