import { useEffect, useState } from 'react';

import { Flex, Grid, Tabs, Typography } from 'antd';
import type { TabsProps } from 'antd';
import { useLocation } from 'react-router-dom';

import { ContactUs, Tickets, Chats } from '../components';
import { ticketListingTableData } from '../types/type';

const NeedHelp = () => {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const { state } = useLocation();
    const [disabledTab3, setDisabledTab3] = useState(true);
    const [activeTabKey, setActiveTabKey] = useState<string>('1');
    const [chatId, setChatId] = useState<number>(0);
    const [shouldRefreshTickets, setShouldRefreshTickets] = useState(false);
    const [mobileChat, setMobileChat] = useState(false);
    const isComingFromDashboard = state ? state.item : null;
    useEffect(() => {
        if (isComingFromDashboard) {
            setActiveTabKey('2');
        }
    }, [isComingFromDashboard]);

    const handleTabChange = (key: string) => {
        setActiveTabKey(key);
        if (key === '1' || key === '2') {
            setDisabledTab3(true);
        }
    };

    const handleButtonClick = (record: ticketListingTableData) => {
        setChatId(record.ticketId);
        if (!screens.xs) {
            setDisabledTab3(false);
            setActiveTabKey('3');
        } else {
            setMobileChat(true);
        }
    };
    const handleTabChangeAfterDelete = () => {
        handleTabChange('2');
        setShouldRefreshTickets(true);
        setMobileChat(false);
    };

    useEffect(() => {}, [activeTabKey]);

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Contact Us',
            children: <ContactUs />,
        },
        {
            key: '2',
            label: 'Tickets',
            children: (
                <Tickets
                    handleButtonClick={handleButtonClick}
                    shouldRefreshTickets={shouldRefreshTickets}
                    setShouldRefreshTickets={setShouldRefreshTickets}
                />
            ),
        },
        ...(!disabledTab3 && !screens.xs
            ? [
                  {
                      key: '3',
                      label: 'Ticket Details',
                      children: <Chats chatId={chatId} onTabChange={handleTabChangeAfterDelete} />,
                  },
              ]
            : []),
    ];

    return screens.xs && mobileChat ? (
        <Chats chatId={chatId} onTabChange={handleTabChangeAfterDelete} />
    ) : (
        <Flex vertical gap={20}>
            <Typography.Text className="text-lg font-medium sm:text-xl">Help</Typography.Text>
            <Tabs
                activeKey={activeTabKey}
                defaultActiveKey="1"
                items={items}
                onChange={handleTabChange}
            />
        </Flex>
    );
};

export default NeedHelp;
