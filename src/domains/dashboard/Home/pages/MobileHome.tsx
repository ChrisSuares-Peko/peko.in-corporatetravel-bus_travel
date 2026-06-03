import { Flex } from 'antd';

import CashbackEverywhere from '@assets/icons/CashbackEverywhere.svg';
import EarningsIcon from '@assets/icons/Earnings.svg';
import MoneyBackIcon from '@assets/icons/MoneyBack.svg';
import SpentIcon from '@assets/icons/Spent.svg';
import MobileNav from '@components/molecular/nav-section/mobile-nav/MobileNav';
// import { PekoPackages } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import AlertsList from '../components/AlertsList';
import DashboardBussinessCardList from '../components/DashboardBussinessCardLIst';
import Headers from '../components/Headers';
// import PekoOneMobile from '../components/PekoOneMobile';
import PriceInfoCard from '../components/PriceInfoCard';
import RecentTransactionsList from '../components/RecentTransactionsList';
import TotalSpentMobile from '../components/TotalSpentMobile';
import useChartApi from '../hooks/useChartApi';
import useCountApi from '../hooks/useCountApi';

const MobileHome = () => {
    const { data, isLoading } = useCountApi();
    const { data: chartData, filters, isLoading: chartLoading } = useChartApi();
    const { user, notifications } = useAppSelector(state => state.reducer.user);
    const { packageName } = useAppSelector(state => state.reducer.auth);
    return (
        <>
            <Flex justify="space-between" className="w-full mb-4" gap={10}>
                <PriceInfoCard
                    title="Cashback Wallet"
                    value={formatNumberWithLocalString(user?.balance! ?? 0)}
                    bgColor="yellow-bg"
                    icon={CashbackEverywhere}
                    currency="AED"
                    isMobile
                />
                <PriceInfoCard
                    title="Total Cashback"
                    value={formatNumberWithLocalString(data?.totalCashback! || 0)}
                    bgColor="violet-bg"
                    icon={MoneyBackIcon}
                    currency="AED"
                    isMobile
                />
            </Flex>
            <Flex justify="space-between" className="w-full mb-4" gap={10}>
                <PriceInfoCard
                    title="Current Month Spend"
                    value={formatNumberWithLocalString(data?.totalSpendCurrentMonth! || 0)}
                    bgColor="yellow-bg"
                    icon={EarningsIcon}
                    currency="AED"
                    isMobile
                />
                <PriceInfoCard
                    title="Total Spend"
                    value={formatNumberWithLocalString(data?.totalSpend || 0) ?? '0'}
                    bgColor="violet-bg"
                    icon={SpentIcon}
                    currency="AED"
                    isMobile
                />
            </Flex>
            <MobileNav />
            <Headers />
            <Flex vertical className="w-full mt-6">
                <TotalSpentMobile filters={filters} chartData={chartData?.filteredResult} />
                <AlertsList />
                <RecentTransactionsList
                    recentData={chartData?.recentTransaction}
                    isLoading={chartLoading}
                />
                <DashboardBussinessCardList />
            </Flex>
        </>
    );
};

export default MobileHome;
