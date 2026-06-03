import React from 'react';

import { Col, Flex, Row, Typography } from 'antd';

import ActivityLog from '@domains/dashboard/accounting/components/accountsDashboard/ActivityLog';
import { UpcomingActivityData } from '@domains/dashboard/accounting/utils/AccountDash';

type Props = {};
interface ListItem {
    success: boolean;
    description: string;
}
const AdaptiveActivityLog = (props: Props) => (
    <Flex className="xs:block md:hidden" vertical>
        <Flex className="pl-6" justify="space-between" align="center">
            <Typography.Text className="text-lg font-medium">Activity Log</Typography.Text>
            <Typography.Text className="text-md text-iconRed">View all</Typography.Text>
        </Flex>
        <Row gutter={[40, 40]} className="mt-5">
            {UpcomingActivityData.map((item: ListItem, i) => (
                <Col xs={24} sm={12} md={8} lg={8} xl={8} key={i}>
                    <ActivityLog success={item.success} description={item.description} />
                </Col>
            ))}
        </Row>
    </Flex>
);

export default AdaptiveActivityLog;
