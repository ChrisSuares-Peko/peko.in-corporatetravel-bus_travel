import { Suspense, useState } from 'react';

import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, Image, Row, Skeleton, Typography } from 'antd';
import { capitalize } from 'lodash';
import { Link } from 'react-router-dom';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import { PekoPackages } from '@customtypes/general';
import PekoOne from '@src/domains/dashboard/plans/assets/logo/PekoOne.png';
import { useAppSelector } from '@src/hooks/store';
import useUserInfo from '@src/hooks/useUserInfo';
import { paths } from '@src/routes/paths';
import { formattedDateOnly } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import TextCard from './billing_saved_cards/TextCard';
import ListPoints from './subscription_plans/ListPoints';
import useCurrentSubscription from '../hooks/subscriptions/useCurrentSubscription';
import { BillingTypes, PackageStatus } from '../types/subscription';
import { servicesPremium, servicesStandard } from '../utils';

const SubscriptionPlans = () => {
    const initialValues = {
        page: 1,
        itemsPerPage: 1000,
        status: PackageStatus.Active,
    };
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [packageId, setPackageId] = useState<number | undefined>(undefined);
    const [selBillingType, setSelBillingType] = useState<string>('');
    const { packageName } = useAppSelector(state => state.reducer.auth);
    const { isLoading, data, individualPackages, handleCancelSubscription } =
        useCurrentSubscription(initialValues);
    const { getUserServicesData } = useUserInfo();
    const handleCancelModal = () => {
        setOpenConfirmationModal(false);
        setPackageId(undefined);
    };
    const handleOpenCancelModal = (id: number, billingType: string) => {
        setSelBillingType(billingType);
        setPackageId(id);
        setOpenConfirmationModal(true);
    };
    const handleConfirmation = () => {
        handleCancelSubscription(packageId!).then(success => {
            setOpenConfirmationModal(false);
            getUserServicesData();
        });
    };
    const featuresArray = data?.package.description.split('\n') || [];
    const servicesArray =
        data?.package.packageName === PekoPackages.Standard ? servicesStandard : servicesPremium;
    if (isLoading) {
        return (
            <Row
                className="h-full mt-8 rounded-md"
                justify="center"
                align="middle"
                gutter={[0, 20]}
            >
                <Skeleton active />
            </Row>
        );
    }
    if (!data && (!individualPackages || individualPackages.length === 0)) {
        return (
            <Row
                className="h-full mt-8 rounded-md "
                justify="center"
                align="middle"
                gutter={[0, 20]}
            >
                <Empty description="No Plans Available" />
            </Row>
        );
    }
    return (
        <>
            <Row
                className="h-full rounded-md sm:mt-4 "
                justify="center"
                align="middle"
                gutter={[0, 20]}
            >
                {data && (
                    <>
                        <Flex
                            className="flex-col w-full h-full p-8 border border-gray-200 border-solid md:flex-row rounded-2xl xs:bg-bgLightGray md:bg-white"
                            justify="space-between"
                            align="center"
                            gap={60}
                        >
                            <Flex>
                                <Image src={PekoOne} preview={false} width={130} />
                            </Flex>
                            <Flex className="flex flex-1">
                                <Row gutter={[10, 20]} className="w-full">
                                    <Row>
                                        <Typography.Text className="text-xl font-medium">
                                            {data?.package?.packageName}{' '}
                                            {capitalize(data?.billingType)}
                                            {/* <Tag
        bordered={false}
        className="mx-2 text-lightRed bg-bgLightOrange"
    >
        15% off
    </Tag> */}
                                        </Typography.Text>
                                    </Row>
                                    <Row
                                        justify="start"
                                        className="w-full gap-16 xl:gap-32"
                                        gutter={[0, 30]}
                                    >
                                        <TextCard
                                            label="Total Amount"
                                            value={`AED ${formatNumberWithLocalString(data.subscriptionAmountPaid)}`}
                                        />
                                        <TextCard label="Status" value={capitalize(data.status)} />
                                        <TextCard
                                            label="Plan Started"
                                            value={formattedDateOnly(
                                                new Date(data.subscriptionStartDate)
                                            )}
                                        />
                                        <TextCard
                                            label="Valid Until"
                                            value={formattedDateOnly(
                                                new Date(data.subscriptionEndDate)
                                            )}
                                        />
                                        <TextCard label="Payment Mode" value="Auto" />
                                    </Row>
                                </Row>
                            </Flex>
                            <Flex justify="end" vertical gap={20} align="center">
                                {data?.package.packageName === PekoPackages.Standard && (
                                    <Link to={`/${paths.plans.index}`}>
                                        <Button danger className="text-xs font-medium">
                                            Upgrade Plan
                                        </Button>
                                    </Link>
                                )}

                                <Typography.Text
                                    onClick={() => handleOpenCancelModal(data.id, data.billingType)}
                                    className="text-red-700 cursor-pointer"
                                >
                                    <CloseCircleOutlined className="pe-2" />
                                    Cancel my plan
                                </Typography.Text>
                            </Flex>
                        </Flex>
                        <ListPoints
                            title="Services"
                            items={servicesArray}
                            showTicks
                            itemsPerColumn={4}
                        />

                        <ListPoints
                            title="Features"
                            items={featuresArray}
                            showTicks={false}
                            itemsPerColumn={featuresArray.length}
                        />
                    </>
                )}
                {individualPackages &&
                    individualPackages.length > 0 &&
                    individualPackages.map(individualPlan => (
                        <Flex
                            key={individualPlan.id}
                            className="flex-col w-full h-full p-8 px-10 border border-gray-200 border-solid md:flex-row rounded-2xl xs:bg-bgLightGray md:bg-white"
                            justify="space-between"
                            align="center"
                            gap={60}
                        >
                            <Flex className="flex flex-1">
                                <Row gutter={[10, 20]} className="w-full">
                                    <Row>
                                        <Typography.Text className="text-xl font-medium">
                                            {individualPlan.isCustom
                                                ? `${individualPlan.package.packageName} - Add on `
                                                : individualPlan.package.packageName}{' '}
                                            {capitalize(individualPlan.billingType)}
                                        </Typography.Text>
                                    </Row>
                                    <Row className="w-full">
                                        <Flex
                                            wrap="wrap"
                                            justify="start"
                                            className="w-full gap-10 xl:gap-24"
                                        >
                                            <TextCard
                                                label="Total Amount"
                                                value={`AED ${formatNumberWithLocalString(individualPlan.subscriptionAmountPaid)}`}
                                            />
                                            <TextCard
                                                label="Status"
                                                value={capitalize(individualPlan.status)}
                                            />
                                            <TextCard
                                                label="Plan Started"
                                                value={formattedDateOnly(
                                                    new Date(individualPlan.subscriptionStartDate)
                                                )}
                                            />
                                            <TextCard
                                                label="Valid Until"
                                                value={formattedDateOnly(
                                                    new Date(individualPlan.subscriptionEndDate)
                                                )}
                                            />
                                            <TextCard label="Payment Mode" value="Auto" />
                                        </Flex>
                                    </Row>
                                </Row>
                            </Flex>
                            <Flex justify="end" vertical gap={20} align="center">
                                {packageName !== PekoPackages.Premium &&
                                !individualPlan.isCustom ? (
                                    <Link to={`/${paths.plans.index}`}>
                                        <Button danger className="text-xs font-medium">
                                            Upgrade Plan
                                        </Button>
                                    </Link>
                                ) : (
                                    ''
                                )}
                                {individualPlan.isCancelled ? (
                                    <Typography.Text className="text-red-700 cursor-pointer">
                                        Cancellation effective on{' '}
                                        {formattedDateOnly(
                                            new Date(individualPlan.subscriptionEndDate)
                                        )}
                                    </Typography.Text>
                                ) : (
                                    <Typography.Text
                                        onClick={() =>
                                            handleOpenCancelModal(
                                                individualPlan.id,
                                                individualPlan.billingType
                                            )
                                        }
                                        className="text-red-700 cursor-pointer"
                                    >
                                        <CloseCircleOutlined className="pe-2" />
                                        Cancel my plan
                                    </Typography.Text>
                                )}
                            </Flex>
                        </Flex>
                    ))}
            </Row>
            <Suspense>
                <ConfirmationModal
                    isOpen={openConfirmationModal}
                    handleCancel={handleCancelModal}
                    title={`Are you sure you want to cancel your ${selBillingType === BillingTypes.Annually ? 'annual' : 'monthly'} subscription?. All of your add-ons will also be cancelled.`}
                    handleSubmit={() => handleConfirmation()}
                    isLoading={isLoading!}
                />
            </Suspense>
        </>
    );
};

export default SubscriptionPlans;
