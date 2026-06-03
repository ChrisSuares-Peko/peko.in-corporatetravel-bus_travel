import React from 'react';

import { Button, Col, Flex, Row, Skeleton, Typography } from 'antd';
import { capitalize } from 'lodash';
import { Link } from 'react-router-dom';

import { PekoPackages } from '@customtypes/general';
import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import CardDetails from './billing_saved_cards/CardDetails';
import OrdersTable from './billing_saved_cards/OrdersTable';
import TextCard from './billing_saved_cards/TextCard';
import useActiveSubscription from '../hooks/subscriptions/useActiveSubscription';

const BillingAndSavedCards = () => {
    const { isLoading, data } = useActiveSubscription();

    return (
        <Flex vertical className="gap-5 rounded-md sm:mt-4">
            <Row className="gap-5">
                {data && (
                    <Col
                        xs={24}
                        lg={14}
                        className="flex flex-col justify-between gap-4 py-5 border border-gray-200 border-solid px-7 rounded-2xl"
                    >
                        <Flex vertical>
                            <Flex justify="space-between">
                                <Typography.Text className="text-base font-medium">
                                    Current Plan Summary
                                </Typography.Text>
                                {data?.package.packageName !== PekoPackages.Premium ? (
                                    <Link to={`/${paths.plans.index}`}>
                                        <Button danger className="text-xs font-medium">
                                            Upgrade Plan
                                        </Button>
                                    </Link>
                                ) : (
                                    ''
                                )}
                            </Flex>
                            {isLoading ? (
                                <Skeleton />
                            ) : (
                                <Flex wrap="wrap" className="gap-10 mt-4" justify="space-between">
                                    <TextCard
                                        label="Plan Name"
                                        value={
                                            data?.package.packageName === 'Basic'
                                                ? data?.package.packageName
                                                : `${data?.package.packageName}`
                                        }
                                    />
                                    <TextCard
                                        label="Billing Cycle"
                                        value={
                                            data?.package.packageName !== 'Basic'
                                                ? capitalize(data?.billingType)
                                                : '-'
                                        }
                                    />
                                    <TextCard
                                        label="Status"
                                        value={
                                            data?.package.packageName !== 'Basic'
                                                ? capitalize(data?.status)
                                                : '-'
                                        }
                                    />
                                    <TextCard
                                        label="Amount"
                                        value={
                                            data?.package.packageName !== 'Basic'
                                                ? `AED ${formatNumberWithLocalString(data?.subscriptionAmountPaid)}`
                                                : '-'
                                        }
                                    />
                                </Flex>
                            )}
                        </Flex>
                    </Col>
                )}
                <CardDetails />
            </Row>
            <OrdersTable />
        </Flex>
    );
};

export default BillingAndSavedCards;
