import React, { useState } from 'react';

import { Button, Calendar, Flex, Typography, theme } from 'antd';
import type { CalendarProps } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Dayjs } from 'dayjs';
import { ReactSVG } from 'react-svg';

import dateIcon from '@domains/dashboard/Hotels/Assets/icons/Calendar.svg';
import GuestCount from '@domains/dashboard/Hotels/Components/AdaptiveComponents/GuestCount';

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {};
const DatePagesm = () => {
    const { token } = theme.useToken();
    const wrapperStyle: React.CSSProperties = {
        width: 300,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };
    const {
        token: { colorPrimary },
    } = theme.useToken();

    const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);

    const handleCalendarChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
        setCheckInDate(value);
    };
    return (
        <Content>
            <Typography.Text className="font-bold ">Select Date</Typography.Text>
            <Calendar fullscreen={false} onPanelChange={onPanelChange} style={wrapperStyle} />
            <Content className="w-full py-4  bg-bgLightGray border border-solid border-gray-200">
                <Flex className="px-5" justify="space-around">
                    <Flex vertical>
                        <Typography.Text className="font-bold">Check in</Typography.Text>
                        <Content className="w-32 p-2  bg-white border border-solid border-gray-200">
                            <Flex className="px-2" justify="space-between">
                                <ReactSVG src={dateIcon} />
                                <Typography.Text>
                                    {checkInDate ? checkInDate.format('DD-MM-YYYY') : 'Select date'}
                                </Typography.Text>
                            </Flex>
                        </Content>
                    </Flex>
                    <Flex vertical>
                        <Typography.Text className="font-bold">Check Out</Typography.Text>
                        <Content className="w-32 p-2  bg-white border border-solid border-gray-200">
                            <Flex className="px-2" justify="space-between">
                                <ReactSVG src={dateIcon} />
                                <Typography.Text>select date</Typography.Text>
                            </Flex>
                        </Content>
                    </Flex>
                </Flex>
            </Content>
            <GuestCount />
            <Typography.Title level={5} className="text-xl text-center pt-4">
                Total:AED525
            </Typography.Title>
            <Button
                style={{
                    backgroundColor: colorPrimary,
                    color: 'white',
                }}
                size="middle"
                className="px-5 mt-5 w-full"
            >
                Select
            </Button>
        </Content>
    );
};

export default DatePagesm;
