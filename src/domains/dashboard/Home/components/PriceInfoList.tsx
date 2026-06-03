import { Flex, Grid, Skeleton } from 'antd';

import EarningsIcon from '@assets/icons/Earnings.svg';
import MoneyBackIcon from '@assets/icons/MoneyBack.svg';
import SpentIcon from '@assets/icons/Spent.svg';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import PriceInfoCard from './PriceInfoCard';
import useCountApi from '../hooks/useCountApi';

type PriceInfoListProps = {
    monthlySpends: React.MutableRefObject<null>;
    totalCashback: React.MutableRefObject<null>;
    totalSpends: React.MutableRefObject<null>;
};
const PriceInfoList = ({ monthlySpends, totalCashback, totalSpends }: PriceInfoListProps) => {
    const { data, isLoading } = useCountApi();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    return (
        <Flex className="flex flex-wrap gap-4">
            {isLoading ? (
                <Skeleton active avatar />
            ) : (
                <>
                    <PriceInfoCard
                        title="Current Month Spend"
                        value={`${formatNumberWithLocalString(data?.totalSpendCurrentMonth || 0) ?? '0'}`}
                        currency="AED"
                        bgColor="yellow-bg"
                        icon={EarningsIcon}
                        reference={monthlySpends}
                    />
                    <PriceInfoCard
                        title="Total Cashback"
                        value={`${formatNumberWithLocalString(data?.totalCashback || 0) ?? '0'}`}
                        icon={MoneyBackIcon}
                        bgColor="violet-bg"
                        currency="AED"
                        reference={totalCashback}
                    />
                    {/* {screens.xl && ( */}
                    <PriceInfoCard
                        title="Total Spend"
                        value={`${formatNumberWithLocalString(data?.totalSpend || 0) ?? '0'}`}
                        bgColor="green-bg"
                        icon={SpentIcon}
                        currency="AED"
                        reference={totalSpends}
                    />
                    {/* )} */}
                </>
            )}
        </Flex>
    );
};
export default PriceInfoList;
