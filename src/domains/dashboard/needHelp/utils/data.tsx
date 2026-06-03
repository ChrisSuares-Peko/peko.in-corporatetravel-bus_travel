/* eslint-disable consistent-return */
import { ReactNode } from 'react';

import { EyeOutlined } from '@ant-design/icons';
import { Flex, Space, Typography } from 'antd';

import { paths } from '@src/routes/paths';

interface DataSourceItem {
    key: string;
    date: string;
    issueDetails: string;
    id: string;
    module: string;
    updates: object;
    status: 'OPEN' | 'CLOSED' | 'PENDING' | 'REJECTED';
    view: ReactNode;
}

interface IMessageData {
    sendMessage: boolean;
    text: string;
    time: string;
    sender: string;
}

interface IContactUsData {
    text: string;
    link: string;
}

interface ColumnItem {
    title: string;
    dataIndex: string;
    key: string;
    render: any;
}
interface OptionItem {
    value: string;
    Label: string;
}

export const dataSource: DataSourceItem[] = [
    {
        key: '1',
        date: '2014-12-24 23:12:00',
        issueDetails: "I Can't Receive Mail",
        id: '1703673676590',
        module: 'Bill Payment',
        updates: {
            message: 'New Message',
            unSeenMessage: 1,
        },
        status: 'OPEN',
        view: <EyeOutlined />,
    },
    {
        key: '2',
        date: '2014-12-24 23:12:00',
        issueDetails: "I Can't Receive Mail",
        id: '1703673676590',
        module: 'Bill Payment',
        updates: {
            message: 'New Message',
            unSeenMessage: 1,
        },
        status: 'CLOSED',
        view: <EyeOutlined />,
    },
    {
        key: '3',
        date: '2014-12-24 23:12:00',
        issueDetails: "I Can't Receive Mail",
        id: '1703673676590',
        module: 'Bill Payment',
        updates: {
            message: 'New Message',
            unSeenMessage: 16,
        },
        status: 'PENDING',
        view: <EyeOutlined />,
    },
    {
        key: '4',
        date: '2014-12-24 23:12:00',
        issueDetails: "I Can't Receive Mail",
        id: '1703673676590',
        module: 'Bill Payment',
        updates: {
            message: 'New Message',
            unSeenMessage: 1,
        },
        status: 'REJECTED',
        view: <EyeOutlined />,
    },
];

export const columns: ColumnItem[] = [
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (text: string) => <Typography.Text>{text}</Typography.Text>,
    },
    {
        title: 'Issue details',
        dataIndex: 'issueDetails',
        key: 'issueDetails',
        render: (text: string) => <Typography.Text>{text}</Typography.Text>,
    },
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (text: string) => <Typography.Text>{text}</Typography.Text>,
    },
    {
        title: 'Module',
        dataIndex: 'module',
        key: 'module',
        render: (text: string) => <Typography.Text>{text}</Typography.Text>,
    },
    {
        title: 'Updates',
        dataIndex: 'updates',
        key: 'updates',
        render: (text: any) => {
            const { message, unSeenMessage } = text;
            return (
                <Space>
                    <Flex
                        className="w-5 h-5 bg-[#05BE63] rounded-full"
                        align="center"
                        justify="center"
                    >
                        <Typography.Text className="text-[#fff] mt-[2px]">
                            {unSeenMessage}
                        </Typography.Text>
                    </Flex>
                    <Typography.Text className="text-[#05BE63]">{message}</Typography.Text>
                </Space>
            );
        },
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
            if (status === 'OPEN')
                return (
                    <Space className="flex items-center justify-center px-2 py-1 m-1 font-medium text-green-700 bg-green-100 border border-green-300 rounded-full ">
                        <Space className="flex-initial max-w-full text-xs font-normal leading-none">
                            OPEN
                        </Space>
                    </Space>
                );
        },
    },
    {
        title: 'View',
        dataIndex: 'view',
        key: 'view',
        render: (text: string) => <Typography.Text>{text}</Typography.Text>,
    },
];

export const optionsData: OptionItem[] = [
    {
        value: 'Bill Payment',
        Label: 'Bill Payment',
    },
    {
        value: 'Top Up',
        Label: 'Top Up',
    },
    {
        value: 'Gift Card',
        Label: 'Gift Card',
    },
];

export const messageData: IMessageData[] = [
    {
        sendMessage: true,
        text: "I can't seem to log in. Every time I try to log in, I get an error message.",
        time: '6:10 PM',
        sender: 'Phantom',
    },
    {
        sendMessage: false,
        text: "Thanks for confirming your details. I can see that your account is currently locked. I'll need to reset your and send you a new one. Is that okay with you?",
        time: '6:10 PM',
        sender: 'Phantom',
    },
    {
        sendMessage: true,
        text: "Yes, that's fine. Thank you for helping me.",
        time: '6:10 PM',
        sender: 'Phantom',
    },
    {
        sendMessage: true,
        text: "I can't seem to log in. Every time I try to log in, I get an error message.",
        time: '6:10 PM',
        sender: 'Phantom',
    },
    {
        sendMessage: false,
        text: "Thanks for confirming your details. I can see that your account is currently locked. I'll need to reset your and send you a new one. Is that okay with you?",
        time: '6:10 PM',
        sender: 'Phantom',
    },
    {
        sendMessage: true,
        text: "Yes, that's fine. Thank you for helping me.",
        time: '6:10 PM',
        sender: 'Phantom',
    },
    {
        sendMessage: true,
        text: "I can't seem to log in. Every time I try to log in, I get an error message.",
        time: '6:10 PM',
        sender: 'Phantom',
    },
    {
        sendMessage: false,
        text: "Thanks for confirming your details. I can see that your account is currently locked. I'll need to reset your and send you a new one. Is that okay with you?",
        time: '6:10 PM',
        sender: 'Phantom',
    },
    {
        sendMessage: false,
        text: "Thanks for confirming your details. I can see that your account is currently locked. I'll need to reset your and send you a new one. Is that okay with you?",
        time: '6:10 PM',
        sender: 'Phantom',
    },
    {
        sendMessage: true,
        text: "Yes, that's fine. Thank you for helping me.",
        time: '6:10 PM',
        sender: 'Phantom',
    },
];

export const contactUsData: IContactUsData[] = [
    {
        text: 'Login',
        link: paths.needHelp.faq,
    },
    {
        text: 'Bill Payments',
        link: paths.needHelp.faq,
    },
    {
        text: 'Gift Cards',
        link: paths.needHelp.faq,
    },
    {
        text: 'Cashback',
        link: paths.needHelp.faq,
    },
    {
        text: 'Orders',
        link: paths.needHelp.faq,
    },
];

interface filterOption {
    value: string;
    label: string;
}

export const schedulerTitles = [
    'Daily Scheduler',
    'Weekly Scheduler',
    'Montly Scheduler',
    'Annual Scheduler',
];

export const filterOptions: filterOption[] = [
    {
        value: 'All',
        label: 'All',
    },
    {
        value: 'bills',
        label: 'Bill Payments',
    },
    {
        value: 'office',
        label: 'Office Supplies',
    },
];

export type tableType = {
    date: string;
    issueDetails: string;
    id: number;
    module: string;
    updates: string;
    status: string;
    view: string;
};

export const faqText: string = `
Betterment makes money in four simple ways:

Our flat management fee for investing and advice—$4 per month or 0.25% for most customers (depending on your balance and recurring deposit settings), 
0.40% for our Premium advice plan. Our over-the-phone advice packages, which cost between $299 and $399 per package.

Payments from Cash Reserve program banks, which Betterment expects will result in annualized revenue of more than 0% but less than 0.50% of the average, 
aggregate balance of the daily program deposits at program banks.

Finally, for Checking, Betterment Financial LLC receives a portion of interchange fees from merchants whenever you use your debit card (just like any bank or credit union), 
and a small portion of the net interest margin from deposits in your account.

We don't earn revenue from any funds we've selected for your portfolio. We also don't make money in our trading practices. 
That's all because we're built to align Betterment's interests with your own.
`;
export const faqTitle: string = `How does Betterment make money?`;
