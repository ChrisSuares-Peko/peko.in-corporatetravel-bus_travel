/* eslint-disable no-nested-ternary */
import React from 'react';

import { Flex, Image, Skeleton, Typography, theme } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import MoreTransactions from '@assets/svg/moretransactions.svg';
import useScreenSize from '@src/hooks/useScreenSize';
import { paths } from '@src/routes/paths';

import RecentTransactionCard from './RecentTransactionCard';
import { RecentOrdersData } from '../types';

interface PropsType {
    recentData?: RecentOrdersData[];
    isLoading?: boolean;
    recentTransactions?: React.MutableRefObject<null>;
}

const RecentTransactionsList: React.FC<PropsType> = ({
    recentData,
    isLoading,
    recentTransactions,
}) => {
    const { xs } = useScreenSize();
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const formatTime = (dateTimeString: string) => {
        const date = moment(dateTimeString);
        const formattedTime = date.format('hh:mm A');
        return formattedTime;
    };
    const navigate = useNavigate();
    const formatDate = (dateTimeString: string) => {
        const date = moment(dateTimeString);
        const formattedDate = date.format('DD MMMM YYYY');
        return formattedDate;
    };
    const handleClick = () => {
        // clevertap.event.push('ViewAllRecentTransactions', {
        //     Page: 'Recent Transactions',
        //     Action: 'View All Clicked',
        // });
        navigate(paths.dashboard.reports);
    };
    return (
        <Flex vertical className="mt-4 lg:flex-1" justify="center" ref={recentTransactions}>
            <Flex className="w-full pt-5 xl:pt-5 sm:pt-8" align="center" justify="space-between">
                <Typography.Text className="py-2 text-xs font-medium sm:py-0 md:text-lg">
                    {' '}
                    Recent Transactions
                </Typography.Text>

                <Typography.Link
                    style={{ color: colorPrimary }}
                    onClick={handleClick}
                    className="text-xs md:text-base"
                >
                    View all
                </Typography.Link>
            </Flex>
            <Flex
                vertical
                align="center"
                justify="initial"
                className="flex-1 w-full gap-4 mt-4 md:mt-8 md:gap-10 h-fit"
            >
                {isLoading ? (
                    <Skeleton paragraph={{ rows: 5 }} />
                ) : recentData && recentData?.length > 0 ? (
                    <>
                        {recentData.slice(0, 4).map((item, index) => (
                            <RecentTransactionCard
                                key={index}
                                title={item.serviceCategory}
                                value={item.amountInAed}
                                time={formatTime(item.transactionDate)}
                                date={formatDate(item.transactionDate)}
                            />
                        ))}
                    </>
                ) : (
                    <Flex vertical align="center" className="my-10">
                        <Image src={MoreTransactions} preview={false} width="30%" />
                        <Typography.Text className="pt-4 text-base font-normal text-gray-400">
                            No recent transactions
                        </Typography.Text>
                    </Flex>
                )}
            </Flex>
            {/* {xs && (
                <Flex className="justify-end w-full mt-4 ">
                    <Typography.Link
                        style={{ color: 'black' }}
                        href={paths.dashboard.reports}
                        className="text-xs "
                    >
                        View all
                    </Typography.Link>
                </Flex>
            )} */}
        </Flex>
    );
};

export default RecentTransactionsList;
