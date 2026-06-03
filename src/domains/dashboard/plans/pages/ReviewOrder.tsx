import React, { useEffect } from 'react';

import { Flex, Layout, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useLocation, useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import AddonDetailCard from '../components/AddonDetailCard';
import GoBackIcon from '../components/GoBackIcon';
import PlanDetailsCard from '../components/PlanDetailsCard';
import { SelectedType } from '../types';

interface State {
    planId: number;
    feature: string[];
    benefits: string[];
    selectedType: SelectedType;
    isAddOns: boolean;
    addOnpaymentPayload: {
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
}

const ReviewOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as State;
    useEffect(() => {
        if (!state) {
            navigate(`/${paths.plans.index}`);
        }
    }, [state, navigate]);

    const { planId, feature, selectedType, isAddOns, addOnpaymentPayload } = state || null;
    const storedUrl = sessionStorage.getItem('PurchaseUrl');

    const { url } = JSON.parse(storedUrl as string);
    return (
        <Layout className="overflow-hidden bg-white min-h-svh">
            <Content className="px-4 py-10 sm:p-10 lg:py-20 lg:px-10 xl:px-36 xxl:px-64">
                <GoBackIcon url={url} className="pb-6" />
                <Flex className="pb-5">
                    <Typography.Text className="text-lg font-medium">
                        Review your plan purchase
                    </Typography.Text>
                </Flex>

                {isAddOns ? (
                    <AddonDetailCard paymentPayload={addOnpaymentPayload} />
                ) : (
                    <PlanDetailsCard
                        planId={planId}
                        selectedType={selectedType}
                        services={feature}
                    />
                )}
            </Content>
        </Layout>
    );
};

export default ReviewOrder;
