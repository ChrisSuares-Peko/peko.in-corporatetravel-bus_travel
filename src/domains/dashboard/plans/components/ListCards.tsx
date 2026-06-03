/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import { Col, Row, Typography } from 'antd';

import { PekoPackages } from '@customtypes/general';
import { FRONTEND_BASE_URL } from '@src/config-global';
import { paths } from '@src/routes/paths';

import CardSkeleton from './CardSkeleton';
import PlanCard from './PlanCard';
import SwitchPlan from './SwitchPlan';
import { PackagePrices, PlanType, ServicePackage, SubscriptionType } from '../types';
import { servicesBasic, servicesStandard, servicesPremium } from '../utils';

type Props = {
    currentPackageId?: number;
    isLoading: boolean;
    data: ServicePackage[];
    discount: PackagePrices;
};

const ListCards = ({ data, currentPackageId, isLoading, discount }: Props) => {
    const [selectedType, setSelectedType] = useState<PlanType>(PlanType.Monthly);

    useEffect(() => {
        const storedUrl = sessionStorage.getItem('PurchaseUrl');
        if (storedUrl) {
            const { planType } = JSON.parse(storedUrl);
            if (planType) setSelectedType(planType);
        }
        return () => {
            if (
                window.location.href !==
                `${FRONTEND_BASE_URL}/${paths.plans.index}/${paths.plans.reviewOrder}`
            ) {
                sessionStorage.removeItem('PurchaseUrl');
            }
        };
    }, []);

    const handleChange = (tab: PlanType) => {
        setSelectedType(tab);
    };
    const isDataValid = Array.isArray(data) && data.length > 0;
    if (!isDataValid && !isLoading) {
        return (
            <Col span={24} className="flex justify-center">
                <Typography.Text className="py-3 text-lg font-medium">
                    No Subscription Plans Available
                </Typography.Text>
            </Col>
        );
    }
    return (
        <>
            <Col span={24} className="flex justify-center w-full">
                <SwitchPlan
                    selectedType={selectedType}
                    handleChange={handleChange}
                    discount={discount}
                />
            </Col>
            <Col span={24}>
                <Row justify="center" gutter={[20, 20]}>
                    {isLoading ? (
                        <CardSkeleton loading={isLoading} itemCount={3} />
                    ) : data && data.length > 0 && !isLoading ? (
                        data.map((plan: ServicePackage, index: number) => {
                            let services;
                            let benefits;
                            let type;
                            if (currentPackageId === plan.id) {
                                type = SubscriptionType.Current;
                            } else if (plan.id < currentPackageId!) {
                                type = SubscriptionType.Downgrade;
                            } else {
                                type = SubscriptionType.Upgrade;
                            }
                            if (index === 0) {
                                services = servicesBasic;
                                benefits = undefined;
                            } else if (index === 1) {
                                services = servicesStandard;
                                benefits = plan.description.split('\n');
                            } else if (index === 2) {
                                services = servicesPremium;
                                benefits = plan.description.split('\n');
                            }
                            return (
                                <PlanCard
                                    key={plan.id}
                                    planId={plan.id}
                                    planName={plan.packageName}
                                    price={
                                        selectedType === PlanType.Monthly
                                            ? plan?.packagePrices?.monthly
                                            : plan?.packagePrices?.annually
                                    }
                                    discount={
                                        selectedType === PlanType.Monthly
                                            ? plan?.discount?.monthly
                                            : plan?.discount?.annually
                                    }
                                    selectedType={selectedType}
                                    feature={services!}
                                    benefits={benefits}
                                    type={type as SubscriptionType}
                                    isPopular={plan.packageName === PekoPackages.Standard}
                                />
                            );
                        })
                    ) : (
                        ''
                    )}
                </Row>
            </Col>
        </>
    );
};

export default ListCards;
