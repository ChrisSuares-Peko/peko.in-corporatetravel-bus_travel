/* eslint-disable react/no-unescaped-entities */
import { useRef, useState } from 'react';

import { Col, Flex, Row, Tour, Typography } from 'antd';
import { TourProps } from 'antd/lib';
import { useNavigate } from 'react-router-dom';

import MobileNav from '@components/molecular/nav-section/mobile-nav/MobileNav';
// import { PekoPackages } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import useScreenSize from '@src/hooks/useScreenSize';
import { paths } from '@src/routes/paths';

import MobileHome from './MobileHome';
import AlertsList from '../components/AlertsList';
import DashboardBussinessCardList from '../components/DashboardBussinessCardLIst';
import Headers from '../components/Headers';
// import PekoOneHeader from '../components/PekoOneHeader';
import PriceInfoList from '../components/PriceInfoList';
import QuickActionsList from '../components/QuickActionsList';
import RecentTransactionsList from '../components/RecentTransactionsList';
import TotalSpent from '../components/TotalSpent';
import useChartApi from '../hooks/useChartApi';
import useEnableProductTour from '../hooks/useEnableProductTour';

const Home = () => {
    const { data, filters, isLoading } = useChartApi();
    const { xs, md, lg } = useScreenSize();
    const monthlySpends = useRef(null);
    const totalCashback = useRef(null);
    const totalSpends = useRef(null);
    const alerts = useRef(null);
    const recentTransactions = useRef(null);
    const quickActions = useRef(null);
    const chartRef = useRef(null);
    const { handleUpdateTour } = useEnableProductTour();
    const { user } = useAppSelector(state => state.reducer.user);
    const { roleName } = useAppSelector(state => state.reducer.auth);
    const [open, setOpen] = useState<boolean>(true);

    const { services } = useAppSelector(state => state.reducer.services);
    const navigate = useNavigate();
    if (roleName && roleName === 'corporate sub user') {
        const firstRoute = services?.data.find(obj => obj.hasAccess === true);
        if (firstRoute?.label === 'The Collector') {
            navigate(paths.dashboard.invoicing);
        } else if (firstRoute?.label === 'Tax & More') {
            navigate(paths.dashboard.accounting);
        } else {
            navigate(`/${firstRoute!.label.toLowerCase().replace(' ', '-')}`);
        }
        return null;
    }

    const steps: TourProps['steps'] = [
        {
            title: 'Welcome to Peko, Ready to take a spin?',
            placement: 'center',
            description: (
                <Typography.Text className="font-thin text-white">
                    Dive into Peko with this interactive demo showcasing the platform's key
                    features.You can either follow our guided tour or close the product tour by
                    clicking close button on the top right corner. Click next to continue.
                </Typography.Text>
            ),
        },
        {
            title: 'Current Month Spent',
            description: (
                <Typography.Text className="font-thin text-white">
                    Get a quick look at your current month spends.
                </Typography.Text>
            ),
            target: () => monthlySpends.current,
        },
        {
            title: 'Total Cashback',
            description: (
                <Typography.Text className="font-thin text-white">
                    Track your total cashback rewards over time.
                </Typography.Text>
            ),
            target: () => totalCashback.current,
        },
        {
            title: 'Total Spent',
            description: (
                <Typography.Text className="font-thin text-white">
                    Track your total expenditures over here.
                </Typography.Text>
            ),
            target: () => totalSpends.current,
        },
        {
            title: 'Important Alerts ',
            description: (
                <Typography.Text className="font-thin text-white">
                    Stay informed about important notifications.
                </Typography.Text>
            ),
            target: () => alerts.current,
        },
        {
            title: 'Recent transactions',
            description: (
                <Typography.Text className="font-thin text-white">
                    Take a quick look at your most recent transactions here.
                </Typography.Text>
            ),
            target: () => recentTransactions.current,
            placement: 'top',
        },
        {
            title: 'Quick Actions',
            description: (
                <Typography.Text className="font-thin text-white">
                    Access main services with one click.
                </Typography.Text>
            ),
            target: () => quickActions.current,
        },
        {
            title: 'Total Spends',
            description: (
                <Typography.Text className="font-thin text-white">
                    Get a graphical view of your total spends.
                </Typography.Text>
            ),
            target: () => chartRef.current,
            placement: 'top',
        },
    ];
    const items = lg ? steps : steps.filter(item => item.title !== 'Total Spent');
    return (
        <Row className={xs ? 'mt-2' : ''}>
            {xs ? (
                <MobileHome />
            ) : (
                <>
                    <Col
                        className="w-full md:pr-8 gutter-row"
                        xs={24}
                        md={24}
                        lg={24}
                        xl={17}
                        xxl={16}
                    >
                        <Headers />
                        <Flex vertical gap={25} className="w-full ">
                            <PriceInfoList
                                monthlySpends={monthlySpends}
                                totalCashback={totalCashback}
                                totalSpends={totalSpends}
                            />
                            <Flex
                                justify="center"
                                align="center"
                                className="w-full xs:flex lg:hidden"
                            >
                                <MobileNav />
                            </Flex>
                            {xs ? (
                                <Flex className="xs:hidden md:flex">
                                    <QuickActionsList />
                                </Flex>
                            ) : (
                                <QuickActionsList quickAction={quickActions} />
                            )}

                            <TotalSpent
                                chartRef={chartRef}
                                chartData={data?.filteredResult}
                                filters={filters}
                                isLoading={isLoading}
                            />
                        </Flex>
                    </Col>
                    <Col
                        xs={24}
                        md={24}
                        lg={24}
                        xl={7}
                        xxl={8}
                        className="w-full px-8 py-6 bg-gray-50 rounded-2xl xxl:px-12 gutter-row xs:mt-4 xl:mt-0 "
                    >
                        <Flex vertical gap={15} className="min-h-full">
                            <AlertsList alertsREF={alerts} />
                            <Flex vertical justify="space-between" className="flex-0 xxl:flex-1">
                                <RecentTransactionsList
                                    recentTransactions={recentTransactions}
                                    recentData={data?.recentTransaction}
                                    isLoading={isLoading}
                                />
                                <DashboardBussinessCardList />
                            </Flex>
                        </Flex>
                    </Col>
                </>
            )}
            {user && user?.productTour?.dashboard && md && (
                <Tour
                    className="border rounded-md border-highLightBlue"
                    open={user.productTour.dashboard && open}
                    disabledInteraction
                    onFinish={() => {
                        if (!open) {
                            setOpen(false);
                            handleUpdateTour('dashboard');
                        }
                    }}
                    onClose={() => {
                        setOpen(false);
                        handleUpdateTour('dashboard');
                    }}
                    steps={items}
                    arrow
                    animated
                    type="primary"
                    placement="bottom"
                    scrollIntoViewOptions
                    // indicatorsRender={(current, total) => <></>}
                />
            )}
        </Row>
    );
};

export default Home;
