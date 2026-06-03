import React, { useState } from 'react';

import { Alert, Button, Flex, Form, Progress, Skeleton, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';
import useScreenSize from '@src/hooks/useScreenSize';
import useGetAddonDetails from '@src/hooks/useSubscriptionAddons';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';
import { calculatePercentage } from '@utils/calculatePercentage';
import { formattedDateOnly } from '@utils/dateFormat';
import { packageAccessKeys } from '@utils/packageAccessKeys';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import PlanDetails from './PlanDetails';
import useGetEmployeeCount from '../../hooks/dashboardHooks/useGetEmployeeCount';
import { addOnSchema } from '../../schema/hrSettings';

const SubscriptionSettings = () => {
    const { md } = useScreenSize();
    const [totalAmount, setTotalAmount] = useState(0);
    const { count, date } = useGetEmployeeCount();
    const { user } = useAppSelector(state => state.reducer.user);

    const { addonData, purchaseData } = useGetAddonDetails(
        accessKeys.payroll,
        packageAccessKeys.Payroll
    );
    const navigate = useNavigate();
    return (
        <Content>
            {!purchaseData ? (
                <Skeleton />
            ) : (
                <PlanDetails
                    purchaseData={purchaseData.currentSubscription}
                    isGroupSubscription={purchaseData.isGroupSubscription}
                />
            )}
            {purchaseData?.addOns && <PlanDetails purchaseData={purchaseData.addOns} />}
            <Flex vertical className="w-full mt-8">
                <Typography.Text className="font-medium " style={{ fontSize: '0.9rem' }}>
                    Number of added employees: {count} employees
                </Typography.Text>

                <Flex
                    align={md ? 'center' : 'self-start'}
                    gap={10}
                    className="flex-col w-full mt-2 align-middle md:flex-row"
                >
                    <Progress
                        className="w-full mt-2 md:w-7/12"
                        percent={calculatePercentage(count, addonData?.maxLimit)}
                        strokeColor="#05BE63"
                    />
                    <Typography.Text className="flex-wrap text-xs sm:text-sm">
                        {Number(addonData?.maxLimit) - Number(count)} Left of {addonData?.maxLimit}{' '}
                        Employees
                    </Typography.Text>
                </Flex>
                {date && (
                    <Typography.Text
                        className="font-medium text-gray-400"
                        style={{ fontSize: '0.9rem' }}
                    >
                        Last employee added on {formattedDateOnly(new Date(date!))}
                    </Typography.Text>
                )}
                {user?.roleName !== 'corporate sub user' && (
                    <>
                        <Typography.Text
                            className="font-medium mt-7"
                            style={{ fontSize: '0.9rem' }}
                        >
                            Manage Additional Employees
                        </Typography.Text>

                        <Flex className="w-full mt-6 xl:w-2/3">
                            <Alert
                                message={`Note: You will have to pay AED ${formatNumberWithLocalString(addonData?.unitPrice)} for adding new employees.`}
                                type="warning"
                                showIcon
                            />
                        </Flex>
                        <Flex className="mt-7">
                            <Formik
                                initialValues={{ addonQuantity: '' }}
                                onSubmit={values => {
                                    const quantity = Number(values.addonQuantity);
                                    const addOnpaymentPayload = {
                                        pgAmount: totalAmount,
                                        addonsAccessKey: accessKeys.payroll,
                                        packageId: addonData?.packageId,
                                        quantity,
                                        title: 'Payroll',
                                        description: '',
                                        rows: [
                                            {
                                                column1: 'Additional Employee',
                                                column2: `${quantity} employee`,
                                                column3: `AED ${formatNumberWithLocalString(totalAmount)} Monthly`,
                                            },
                                        ],
                                    };

                                    const details = {
                                        url: `/${paths.payroll.index}`,
                                        service: 'Payroll',
                                    };
                                    sessionStorage.setItem('PurchaseUrl', JSON.stringify(details));

                                    navigate(`/${paths.plans.index}/${paths.plans.reviewOrder}`, {
                                        state: { isAddOns: true, addOnpaymentPayload },
                                    });
                                }}
                                validationSchema={addOnSchema}
                            >
                                {({ handleSubmit }) => (
                                    <Form onFinish={handleSubmit} layout="vertical">
                                        <Flex align="center" vertical={!md}>
                                            <TextInput
                                                type="text"
                                                label="Number of additional employees"
                                                name="addonQuantity"
                                                allowNumbersOnly
                                                classes="w-full"
                                                handleChange={quantity =>
                                                    setTotalAmount(
                                                        Number(quantity) * addonData!.unitPrice
                                                    )
                                                }
                                                maxLength={6}
                                            />
                                            {totalAmount ? (
                                                <Typography.Text className="pb-5 md:px-5 md:pb-0 whitespace-nowrap text-black/70">
                                                    Total additional amount{' '}
                                                    <span className="font-medium text-black">
                                                        AED{' '}
                                                        {formatNumberWithLocalString(totalAmount)}
                                                    </span>
                                                </Typography.Text>
                                            ) : (
                                                ''
                                            )}
                                        </Flex>
                                        <Button
                                            className="px-12"
                                            type="primary"
                                            danger
                                            htmlType="submit"
                                        >
                                            Submit
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </Flex>
                    </>
                )}
            </Flex>
        </Content>
    );
};

export default SubscriptionSettings;
