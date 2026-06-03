import React from 'react';

import { Flex, Typography, Switch, Select, Image } from 'antd';

import ChartEmpty from '@assets/svg/chartEmpty.svg';

import Chart from './Chart';
import useSelectApi from '../hooks/useSelectApi';
import { CharDataType, Filters } from '../types';

interface TotalSpentMobileProps {
    chartData?: CharDataType[];
    filters: Filters;
}

const TotalSpentMobile: React.FC<TotalSpentMobileProps> = ({ chartData, filters }) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = currentDate.getMonth() + 1;

    const { isLoading, paymentModeData, monthsData, yearsData } = useSelectApi();
    const { handleMonthChange, handlePaymentModeFilter, handleYearChange, handleMonthlyView } =
        filters;
    return (
        <Flex vertical className="mb-4 sm:mb-8">
            <Typography.Text className="pb-3 text-xs font-bold md:font-semibold md:text-lg">
                Total Spends
            </Typography.Text>
            <Flex
                align="center"
                justify="space-between"
                className="px-4 py-2 my-4 border border-solid rounded-md "
            >
                <Typography.Text>Monthly</Typography.Text>
                <Switch onChange={handleMonthlyView} size="small" />
                <Select
                    size="small"
                    defaultValue="all"
                    options={paymentModeData}
                    loading={isLoading}
                    onSelect={handlePaymentModeFilter}
                    variant="borderless"
                    dropdownStyle={{ width: 100 }}
                />
                <Select
                    size="small"
                    defaultValue={currentYear}
                    onSelect={handleYearChange}
                    options={yearsData}
                    loading={isLoading}
                    variant="borderless"
                    dropdownStyle={{ width: 100 }}
                />
                <Select
                    size="small"
                    defaultValue={currentMonth.toString()}
                    onSelect={handleMonthChange}
                    options={monthsData}
                    loading={isLoading}
                    variant="borderless"
                    dropdownStyle={{ width: 100 }}
                />
            </Flex>
            {chartData && chartData?.length > 0 ? (
                <Chart chartData={chartData} />
            ) : (
                <Flex vertical align="center" className="pb-8">
                    <Image src={ChartEmpty} preview={false} width="25%" />
                    <Typography.Text className="text-base font-normal ">
                        No transaction to show the graph
                    </Typography.Text>
                </Flex>
            )}
        </Flex>
    );
};
export default TotalSpentMobile;
