/* eslint-disable no-nested-ternary */

import { Col, Divider, Grid, Row } from 'antd';

import useHideWidgetOnDrawer from '@components/molecular/freshChat/hooks/useHideWidgetOnDrawer';
import CommonIndividualLandingPage from '@domains/dashboard/IndividualPlan/pages/CommonIndividualLandingPage';
import ServiceNotPurchasedPage from '@domains/dashboard/IndividualPlan/pages/ServiceNotPurchased';
import assetsLock from '@domains/dashboard/PekoCloud/assets/icons/assetsLock.svg';
import documents from '@domains/dashboard/PekoCloud/assets/icons/documents.svg';
import subscriptions from '@domains/dashboard/PekoCloud/assets/icons/subscriptions.svg';
import wallet from '@domains/dashboard/PekoCloud/assets/icons/wallet.svg';
import { useAppSelector } from '@src/hooks/store';
import { useScrollToTop } from '@src/hooks/useScrollToTop';
import useServiceAccess from '@src/hooks/useSubscriptionCheck';
import { accessKeys } from '@utils/accessKeys';
import { packageAccessKeys } from '@utils/packageAccessKeys';

import LandingPageIcon from '../assets/images/LandingPageIcon.png';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import InfoCard from '../components/Dashboard/InfoCard';
import NavigationCards from '../components/Dashboard/NavigationCards';
import Reminder from '../components/Dashboard/Reminder';
import StorageProgress from '../components/Dashboard/StorageProgress';
import TaskToDo from '../components/Dashboard/TaskToDo';
import TaskToDoMobile from '../components/Dashboard/TaskToDoMobile';
import { useGetDashDataApi } from '../hooks/dashboardHooks/useGetDashDataApi';
import { useGetDashToDoApi } from '../hooks/dashboardHooks/useGetDashTaskDataApi';
import { navMenuDetails } from '../utils/dashDetails';
import { featuresPekoCloud } from '../utils/featuresPekoCloud';

const HomePage = () => {
    const screens = Grid.useBreakpoint();
    useHideWidgetOnDrawer(true);
    const { pekoCloud } = accessKeys;
    useScrollToTop();
    const { tableDatas, totalAssetsAndFleets, totalDoc, totalSubSpent, totalSubs } =
        useGetDashDataApi();
    const { toDoData, isLoading } = useGetDashToDoApi();
    const slicedToDoData = toDoData.slice(0, 6);
    const isPurchased = useServiceAccess(pekoCloud);

    const dashboardData = [
        {
            title: 'Total Documents',
            value: totalDoc,
            isCurrency: false,
            icon: documents,
            bgColor: 'bg-[#F9F4FF]',
        },
        {
            title: 'Total Subscriptions',
            value: totalSubs,
            isCurrency: false,
            icon: subscriptions,
            bgColor: 'bg-[#FFF6F2]',
        },
        {
            title: 'Total Subscription Spent',
            value: totalSubSpent,
            isCurrency: true,
            icon: wallet,
            bgColor: 'bg-[#FFFBE4]',
        },
        {
            title: 'Total Assets & Fleets',
            value: totalAssetsAndFleets,
            isCurrency: false,
            icon: assetsLock,
            bgColor: 'bg-[#F6FCEB]',
        },
    ];
    const { user } = useAppSelector(state => state.reducer.user);
    if (!isPurchased && user?.roleName === 'corporate sub user') {
        return <ServiceNotPurchasedPage />;
    }
    return !isPurchased ? (
        <CommonIndividualLandingPage
            features={featuresPekoCloud}
            serviceKey={packageAccessKeys['Peko Cloud']}
            svgIcon={LandingPageIcon}
            title="Peko Cloud"
            serviceName="Cloud"
            description="Take advantage of our cutting-edge cloud solutions to streamline operations and enhance efficiency. Enable centralized data management, collaborate in real time, and increase productivity. Scale your capabilities effortlessly and drive growth with Peko Cloud. "
        />
    ) : (
        <>
            <DashboardHeader />
            <Divider
                className="p-0 m-0 -ml-10 "
                style={{ width: screens.xxl ? '105.8%' : '106.6%' }}
            />
            <Row className="px-[-0.5rem] mx-[-0.5rem]">
                <Col xl={18} className="py-8">
                    <Row gutter={[15, 30]} className="md:pr-8">
                        <Row className="w-full md:justify-between">
                            {dashboardData.map((item, i) => (
                                <Col
                                    key={i}
                                    className="flex justify-center p-1 min-h-14 xs:w-1/2 sm:w-1/2 lg:w-1/2 xl:w-1/2 xxl:w-1/4 lg:p-3"
                                >
                                    <InfoCard
                                        title={item.title}
                                        value={item.value}
                                        icon={item.icon}
                                        isCurrency={item.isCurrency}
                                        bgColor={item.bgColor}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <Row className="w-full md:justify-between" justify="center">
                            {navMenuDetails.map((item, i) => (
                                <Col key={i} className="flex justify-center p-1 lg:p-3">
                                    <NavigationCards
                                        icon={item.icon}
                                        title={item.title}
                                        isActive={item.isActive}
                                        link={item.link}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <StorageProgress />
                        <Reminder tableDatas={tableDatas} />
                    </Row>
                </Col>

                <Col className="border-1 min-h-40" xl={6} xs={0}>
                    <TaskToDo
                        isLoading={isLoading}
                        slicedToDoData={slicedToDoData}
                        toDoData={toDoData}
                    />
                </Col>
                <Col className="xs:block xl:hidden  w-full">
                    <TaskToDoMobile slicedToDoData={slicedToDoData} />
                </Col>
            </Row>
        </>
    );
};

export default HomePage;
