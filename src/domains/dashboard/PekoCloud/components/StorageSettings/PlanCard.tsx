import React, { useState } from 'react';

import { Button, Col, Flex, Form, Skeleton, Typography } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import SelectInput from '@components/atomic/inputs/SelectInput';
import ExclamationCircleOutlined from '@domains/dashboard/PekoCloud/assets/icons/exclamation-circle-filled.svg';
import { useAppSelector } from '@src/hooks/store';
import useGetAddonDetails from '@src/hooks/useSubscriptionAddons';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';
import { packageAccessKeys } from '@utils/packageAccessKeys';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import PlanDetails from './PlanDetails';
import UsageBar from './UsageBar';
import { addOnSchema } from '../../schema';

const PlanCard = () => {
    const [totalAmount, setTotalAmount] = useState(0);
    const { user } = useAppSelector(state => state.reducer.user);

    const navigate = useNavigate();
    const { addonData, isLoading, purchaseData } = useGetAddonDetails(
        accessKeys.pekoCloud,
        packageAccessKeys['Peko Cloud']
    );
    return (
        <>
            {!purchaseData ? (
                <Skeleton />
            ) : (
                <PlanDetails
                    purchaseData={purchaseData.currentSubscription}
                    isGroupSubscription={purchaseData.isGroupSubscription}
                />
            )}
            {purchaseData?.addOns && <PlanDetails purchaseData={purchaseData.addOns} />}
            <UsageBar />
            {user?.roleName !== 'corporate sub user' && (
                <Col className="mt-10">
                    <Flex className="w-fit" justify="center" gap="middle" vertical>
                        <Typography.Text className="text-lg font-medium">
                            Get Additional Memory
                        </Typography.Text>
                        <Typography.Text
                            className="p-2.5 flex gap-1 text-sm"
                            style={{
                                border: '#FFFCEC',
                                textAlign: 'center',
                                backgroundColor: '#FFFCEC',
                            }}
                        >
                            <ReactSVG src={ExclamationCircleOutlined} />
                            Note: Pay AED {formatNumberWithLocalString(addonData?.unitPrice)}/month
                            for every 1 GB additional storage
                            {/* Note: You will have to pay AED{' '}
                            {formatNumberWithLocalString(addonData?.unitPrice)} per 1GB for adding
                            memory */}
                        </Typography.Text>
                    </Flex>
                    {isLoading ? (
                        <Skeleton />
                    ) : (
                        <Flex className="mt-5 " gap="middle" align="center">
                            <Col className="w-[360px] h-36 ">
                                <Formik
                                    initialValues={{ addonQuantity: '' }}
                                    onSubmit={values => {
                                        const quantity = values.addonQuantity;
                                        const addOnpaymentPayload = {
                                            pgAmount: totalAmount,
                                            addonsAccessKey: accessKeys.pekoCloud,
                                            packageId: addonData?.packageId,
                                            quantity,
                                            title: 'Peko Cloud',
                                            description: '',
                                            rows: [
                                                {
                                                    column1: 'Additional Memory',
                                                    column2: `${quantity} GB`,
                                                    column3: `AED ${formatNumberWithLocalString(totalAmount)} Monthly`,
                                                },
                                            ],
                                        };

                                        const details = {
                                            url: `/${paths.pekoCloud.index}`,
                                            service: 'Cloud',
                                        };
                                        sessionStorage.setItem(
                                            'PurchaseUrl',
                                            JSON.stringify(details)
                                        );

                                        navigate(
                                            `/${paths.plans.index}/${paths.plans.reviewOrder}`,
                                            {
                                                state: { isAddOns: true, addOnpaymentPayload },
                                            }
                                        );
                                    }}
                                    validationSchema={addOnSchema}
                                >
                                    {({ handleSubmit }) => (
                                        <Form
                                            onFinish={handleSubmit}
                                            layout="vertical"
                                            className="w-full"
                                        >
                                            <SelectInput
                                                name="addonQuantity"
                                                options={[
                                                    { label: '1 GB', value: 1 },
                                                    { label: '2 GB', value: 2 },
                                                    { label: '3 GB', value: 3 },
                                                    { label: '4 GB', value: 4 },
                                                    { label: '5 GB', value: 5 },
                                                    { label: '6 GB', value: 6 },
                                                    { label: '7 GB', value: 7 },
                                                    { label: '8 GB', value: 8 },
                                                ]}
                                                placeholder="Select additional storage"
                                                label="Choose Storage"
                                                showToolTip
                                                tooltipText="Select the addon storage you need to purchase"
                                                handleChange={quantity =>
                                                    setTotalAmount(
                                                        Number(quantity) * addonData!.unitPrice
                                                    )
                                                }
                                            />
                                            <Button
                                                className="px-10 mt-1.5"
                                                type="primary"
                                                htmlType="submit"
                                                danger
                                            >
                                                Submit
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>
                            </Col>
                            {totalAmount ? (
                                <Col className="pt-10 h-36">
                                    <Typography.Text className="whitespace-nowrap text-black/70 mb-44">
                                        Total additional amount{' '}
                                        <span className="font-medium text-black">
                                            AED {formatNumberWithLocalString(totalAmount)}/month
                                        </span>
                                    </Typography.Text>
                                </Col>
                            ) : (
                                ''
                            )}
                        </Flex>
                    )}
                </Col>
            )}
        </>
    );
};
export default PlanCard;
