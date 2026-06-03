import React from 'react';

import { Row, Typography, Flex, Skeleton, Button, Grid } from 'antd';
import { Content } from 'antd/es/layout/layout';

import {
    // NafaImg,
    TaxRegistration,
    VatFilling,
    VatRegistration,
    AMLAudit,
    EsrRegistration,
} from '@domains/dashboard/accounting/assets/images';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import Cards from './dashboard/Cards';
// import PlanCard from './dashboard/PlanCard';
import useCorporateTaxData from '../hooks/useCorporateTaxData';
// import { FirstPlanFeatures, SecondPlanFeatures, ThirdPlanFeatures } from '../utils/data';

type Props = {};
const { useBreakpoint } = Grid;

const LandingPage = (props: Props) => {
    const { amount, isLoading } = useCorporateTaxData();
    const dispatch = useAppDispatch();
    const screens = useBreakpoint();
    const { taxData } = useAppSelector(state => state.reducer.accounting);
    const displayComingSoonToast = () => {
        dispatch(showToast({ variant: 'info', description: 'Coming soon' }));
    };

    return (
        <>
            {isLoading ? (
                <Skeleton />
            ) : (
                <Content>
                    <Flex vertical gap={8}>
                        <Flex justify="space-between" className="mb-7 " align="center">
                            <Flex vertical gap={5} className="w-full">
                                <Typography.Text className="text-lg font-medium sm:text-xl">
                                    Tax & More
                                </Typography.Text>
                            </Flex>
                            <Flex align="center">
                                <Button
                                    type="default"
                                    danger
                                    className="lg:mr-4"
                                    size={screens.sm ? 'middle' : 'small'}
                                    onClick={displayComingSoonToast}
                                >
                                    Compliance Check History
                                </Button>
                            </Flex>
                        </Flex>
                        {/* <Flex className="xs:hidden lg:block ">
                                <Flex vertical align="center" justify="center" gap={10}>
                                    <Flex className="w-full" justify="center">
                                        <Link
                                            to=""
                                            // target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Image preview={false} width={100} src={Timber} />
                                        </Link>
                                    </Flex>
                                </Flex>
                            </Flex> */}
                    </Flex>
                    <Flex justify="center" align="center" className="w-full mt-3 mb-12">
                        <Typography.Paragraph className="text-xl font-normal text-black">
                            Let’s quickly check your compliance requirements
                        </Typography.Paragraph>

                        <Button
                            type="primary"
                            onClick={displayComingSoonToast}
                            danger
                            className="ml-3"
                        >
                            Get Started
                        </Button>
                    </Flex>
                    <Content className="xl:px-[8%] ">
                        <Row justify="center" gutter={[40, 40]} className="mt-3 xxl:px-32 ">
                            <Cards
                                imageLink={VatRegistration}
                                path="vat-registration"
                                text="Register for AED 750.00"
                                heading="VAT Registration"
                            />
                            <Cards
                                imageLink={TaxRegistration}
                                path="corporate-tax-registration"
                                text={`Register for AED ${formatNumberWithLocalString(amount)}`}
                                heading="Corporate TAX Registration"
                                isLoading={isLoading}
                            />
                            <Cards
                                imageLink={VatFilling}
                                path=""
                                text="Start VAT Filling"
                                heading="VAT Filling"
                            />
                            <Cards
                                imageLink={EsrRegistration}
                                path="ESR"
                                text="Register for AED 750.00"
                                heading="ESR Registration"
                            />
                            <Cards
                                imageLink={AMLAudit}
                                path=""
                                text="Coming Soon"
                                heading="AML Audit"
                            />
                        </Row>

                        {/* <Flex align="center" className="py-10" gap={10} vertical>
                            <Typography.Text className="text-lg font-normal text-center ">
                                No need to hire a full-time accountant, our dedicated accounting
                                team will take care of all your bookkeeping needs
                            </Typography.Text>
                            {/* <Typography.Text className="text-base font-normal text-center text-accountingDashboardText">
                                Select a plan that aligns with your business needs.
                            </Typography.Text> 
                        </Flex> */}
                        {/* <Row justify="center" gutter={[20, 20]}>
                            <PlanCard
                                planName="Standard Plan"
                                price="399"
                                feature={FirstPlanFeatures}
                            />
                            <PlanCard
                                planName="Standard Plan"
                                price="799"
                                feature={SecondPlanFeatures}
                                isPopular
                            />
                            <PlanCard
                                planName="Premium Plan"
                                price="1499"
                                feature={ThirdPlanFeatures}
                            />
                        </Row> */}
                    </Content>
                </Content>
            )}
        </>
    );
};

export default LandingPage;
