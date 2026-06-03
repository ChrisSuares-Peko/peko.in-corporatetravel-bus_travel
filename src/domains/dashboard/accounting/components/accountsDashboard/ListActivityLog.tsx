import React from 'react';

import { Flex, List, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import FailedIcon from '@domains/dashboard/accounting/assets/icons/failed.svg';
import SuccessIcon from '@domains/dashboard/accounting/assets/icons/success.svg';
import { UpcomingActivityData } from '@domains/dashboard/accounting/utils/AccountDash';

interface ListItem {
    success: boolean;
    description: string;
}

type Props = {};

const ListActivityLog = (props: Props) => (
    <List
        bordered={false}
        dataSource={UpcomingActivityData}
        header={
            <Flex className="pl-6 py-2" justify="space-between" align="center">
                <Typography.Text className="text-lg font-medium">Activity Log</Typography.Text>
                <Typography.Text className="text-md text-iconRed">View all</Typography.Text>
            </Flex>
        }
        locale={{
            emptyText: (
                <Flex vertical justify="center" align="center">
                    Make your first activity
                </Flex>
            ),
        }}
        renderItem={(item: ListItem, i) => (
            <List.Item key={i}>
                <Flex className="pl-6 my-2" vertical gap="small">
                    <Flex gap="middle" align="center">
                        <Flex
                            className="w-20 h-14 xs:bg-red-50 md:bg-white rounded-full border"
                            align="center"
                            justify="center"
                        >
                            <ReactSVG
                                className="fill-white"
                                src={item.success ? SuccessIcon : FailedIcon}
                            />
                        </Flex>
                        <Typography.Paragraph className="pr-3">
                            {item.description}
                        </Typography.Paragraph>
                    </Flex>
                </Flex>
            </List.Item>
        )}
    />
);

export default ListActivityLog;
