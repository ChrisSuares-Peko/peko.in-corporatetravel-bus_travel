import React from 'react';

import { Button, Col, Divider, Flex, Grid, Image, Row, Skeleton, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';

import CommonIndividualLandingPage from '@domains/dashboard/IndividualPlan/pages/CommonIndividualLandingPage';
import ServiceNotPurchasedPage from '@domains/dashboard/IndividualPlan/pages/ServiceNotPurchased';
import amount from '@domains/dashboard/Invoice/assets/amountIcon.svg';
import dashboard from '@domains/dashboard/Invoice/assets/dashboard.svg';
// import paid from '@domains/dashboard/Invoice/assets/paidIcon.svg';
import pending from '@domains/dashboard/Invoice/assets/pendinIcon.svg';
import total from '@domains/dashboard/Invoice/assets/total.svg';
import { useAppSelector } from '@src/hooks/store';
import useServiceAccess from '@src/hooks/useSubscriptionCheck';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';
import { packageAccessKeys } from '@utils/packageAccessKeys';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import LandingPageIcon from '../assets/images/LandingPageIcon.png';
import DashboardCard from '../components/DashboardCard';
import FeaturesCard from '../components/FeaturesCard';
import KybButton from '../components/kyb/KybButton';
import useDashboard from '../hooks/UseDashboard';
import { featureRow } from '../utils/data';
import { featuresTheCollector } from '../utils/features';

const { useBreakpoint } = Grid;

const Dashboard = () => {
    const { paymentLinks } = accessKeys;
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isPurchased = useServiceAccess(paymentLinks);
    const { data, isLoading } = useDashboard();

    const { user } = useAppSelector(state => state.reducer.user);
    if (!isPurchased && user?.roleName === 'corporate sub user') {
        return <ServiceNotPurchasedPage />;
    }
    return !isPurchased ? (
        <CommonIndividualLandingPage
            features={featuresTheCollector}
            serviceKey={packageAccessKeys['The Collector']}
            svgIcon={LandingPageIcon}
            title="The Collector"
            serviceName="Collector"
            description="Effortlessly manage your invoicing needs with precision and ease. Simplify financial tasks for enhanced efficiency in one convenient platform."
        />
    ) : (
        <Content>
            {isLoading ? (
                <Skeleton />
            ) : (
                <>
                    <Row
                        justify="space-between"
                        align="middle"
                        className="pb-6 bg-white border-gray-200"
                    >
                        <Typography.Text className="text-xl font-medium">
                            The Collector
                        </Typography.Text>
                        {/* <Button
                            type="primary"
                            className="bg-white  px-4 border border-red-600 text-red-600 transition hover:bg-red-600 hover:text-white"
                        >
                            <Link to={`${paths.invoice.customers}`}>Customers</Link>
                        </Button> */}
                        <Button
                            type="default"
                            danger
                            className="lg:mr-4"
                            size={screens.sm ? 'middle' : 'small'}
                            onClick={() => {
                                navigate(paths.invoice.customers);
                            }}
                        >
                            Customers
                        </Button>
                    </Row>

                    <Row className="flex flex-col md:flex-row ">
                        <Col xl={11} sm={24}>
                            <Flex
                                justify="center"
                                vertical
                                className="flex xl:h-full md:h-auto flex-col py-6 xl:py-0 mb-4 md:mb-0 items-center rounded-xl  bg-stone-50 text-center md:mr-2"
                            >
                                <Image src={dashboard} preview={false} alt="Collector Dashboard" />
                                <Typography.Text
                                    style={{ lineHeight: screens.xxl ? '3.8rem' : '2.8rem' }}
                                    className="md:text-xl xl:text-2xl xxl:text-3xl text-2xl font-medium text-gray-700 md:px-40 lg:px-28 xl:px-32 xxl:px-44  sm:px-0 leading-relaxed "
                                >
                                    Now you can collect all your payments with The Collector
                                </Typography.Text>
                                {data && <KybButton data={data} />}
                            </Flex>
                        </Col>
                        <Col xl={13} sm={24}>
                            <Row className="flex-1 flex flex-col justify-center items-center px-4 space-y-4 xl:mt-0 sm:mt-6">
                                <Col className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3 gap-4 w-full">
                                    <DashboardCard
                                        title="Total Invoices"
                                        value={data?.totalInvoiceCount || 0}
                                        currency=""
                                        bgColor="bg-magnolia"
                                        icon={total}
                                    />
                                    <DashboardCard
                                        title="Total Paid"
                                        value={data?.paidInvoiceCount || 0}
                                        currency=""
                                        bgColor="bg-seashell"
                                        icon={pending}
                                    />
                                    <DashboardCard
                                        title="Total Invoice Amount"
                                        value={formatNumberWithLocalString(
                                            data?.paidInvoiceAmount || 0
                                        )}
                                        currency="AED"
                                        bgColor="#EBF8FC"
                                        icon={amount}
                                    />
                                </Col>
                            </Row>
                            <Flex className="px-4 mt-1">
                                <Divider className="border-gray-200 my-4 " />
                            </Flex>
                            <Row gutter={[24, 20]} className="px-4 mb-16 md:mb-0">
                                {featureRow.map((item, i) => (
                                    <Col key={i} xs={12} lg={12} xl={12}>
                                        <FeaturesCard
                                            icon={item.image}
                                            title={item.title}
                                            path={item.link}
                                            kybStatus={data?.paymentLinkKYB.kybStatus}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </>
            )}
        </Content>
    );
};

export default Dashboard;
