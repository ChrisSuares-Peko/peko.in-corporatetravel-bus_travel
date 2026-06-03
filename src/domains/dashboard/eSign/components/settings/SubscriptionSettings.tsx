import React, { useState } from 'react';

import { Button, Flex, Progress, Skeleton, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';

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
import SignTag from './SignTag';
import useGetESignCount from '../../hooks/useGetESignCount';

type Props = {};

const SubscriptionSettings = (props: Props) => {
    const navigate = useNavigate();
    const { user } = useAppSelector(state => state.reducer.user);
    const [signCount, setSignCount] = useState<number | null>(null);
    const [error, setError] = useState<string>();
    const [totalAmount, setTotalAmount] = useState(0);
    const { count, lastAdded } = useGetESignCount();
    const { md } = useScreenSize();
    const denominations = [5, 10, 30];
    const {
        addonData,
        isLoading: addOnLoading,
        purchaseData,
    } = useGetAddonDetails(accessKeys.eSign, packageAccessKeys.eSign);
    const handleUpdateCount = (sign: number) => {
        setError('');
        setSignCount(sign);
        setTotalAmount(Number(sign) * addonData!.unitPrice);
    };

    const handleUpgrade = () => {
        if (!totalAmount) {
            setError('Please select number of additional eSigns.');
            return;
        }
        const addOnpaymentPayload = {
            pgAmount: totalAmount,
            addonsAccessKey: accessKeys.eSign,
            packageId: addonData?.packageId,
            quantity: signCount,
            title: 'eSign',
            description: '',
            rows: [
                {
                    column1: 'Additional eSigns',
                    column2: `${signCount} eSign`,
                    column3: `AED ${formatNumberWithLocalString(totalAmount)} Monthly`,
                },
            ],
        };

        const details = {
            url: `${paths.dashboard.moreServices}/${paths.eSign.index}`,
            service: 'eSign',
        };
        sessionStorage.setItem('PurchaseUrl', JSON.stringify(details));

        navigate(`/${paths.plans.index}/${paths.plans.reviewOrder}`, {
            state: { isAddOns: true, addOnpaymentPayload },
        });
    };
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

            <Flex vertical className="w-full mt-6 xl:w-2/3">
                <Typography.Text className="font-medium " style={{ fontSize: '0.9rem' }}>
                    eSign Limit
                </Typography.Text>
                <Flex
                    align={md ? 'center' : 'self-start'}
                    gap={10}
                    className="flex-col w-full mt-2 align-middle md:flex-row"
                >
                    <Progress
                        className="w-full mt-2 md:w-5/12"
                        percent={calculatePercentage(count, addonData?.maxLimit)}
                        strokeColor="#05BE63"
                    />
                    <Typography.Text className="flex-wrap text-xs sm:text-sm">
                        {count} Signs used of {addonData?.maxLimit} Signs
                    </Typography.Text>
                    {lastAdded && (
                        <Typography.Text
                            className="font-medium text-gray-400 md:hidden"
                            style={{ fontSize: '0.9rem' }}
                        >
                            Last eSign added on {formattedDateOnly(new Date(lastAdded!))}
                        </Typography.Text>
                    )}
                </Flex>
                {lastAdded && (
                    <Typography.Text
                        className="hidden font-medium text-gray-400 md:flex"
                        style={{ fontSize: '0.9rem' }}
                    >
                        Last eSign added on {formattedDateOnly(new Date(lastAdded!))}
                    </Typography.Text>
                )}
                {user?.roleName !== 'corporate sub user' && (
                    <>
                        <Typography.Text
                            className="font-medium mt-7"
                            style={{ fontSize: '0.9rem' }}
                        >
                            Manage Additional eSign
                        </Typography.Text>

                        <Flex vertical>
                            <Flex align="center" wrap="wrap">
                                <Flex className="overflow-hidden overflow-x-auto xs:flex-wrap">
                                    {denominations?.map((signs, index) => (
                                        <SignTag
                                            key={index}
                                            signs={signs}
                                            onClick={() => handleUpdateCount(signs)}
                                            selected={signCount === signs}
                                        />
                                    ))}
                                </Flex>
                                {totalAmount ? (
                                    <Typography.Text className="pb-5 mt-2 md:px-4 md:pb-0 whitespace-nowrap text-black/70">
                                        Total additional amount{' '}
                                        <span className="font-medium text-black">
                                            AED {formatNumberWithLocalString(totalAmount)}
                                        </span>
                                    </Typography.Text>
                                ) : (
                                    ''
                                )}
                            </Flex>
                            <Typography.Text className="pt-1 text-red-600">{error}</Typography.Text>
                            <Button
                                className="px-6 mt-4 w-fit"
                                type="primary"
                                onClick={handleUpgrade}
                                danger
                            >
                                Upgrade
                            </Button>
                        </Flex>
                    </>
                )}
            </Flex>
        </Content>
    );
};

export default SubscriptionSettings;
