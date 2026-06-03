import type { FC } from 'react';

import { Col, Row } from 'antd';

import AdaptiveActivityLog from '@domains/dashboard/accounting/components/accountsDashboard/AdaptiveActivityLog';
import DashboardHeader from '@domains/dashboard/accounting/components/accountsDashboard/DashboardHeader';
import DashData from '@domains/dashboard/accounting/components/accountsDashboard/DashData';
import DashFooter from '@domains/dashboard/accounting/components/accountsDashboard/DashFooter';
import ListActivityLog from '@domains/dashboard/accounting/components/accountsDashboard/ListActivityLog';

interface AccountsDashboardProps {}

const AccountsDashboard: FC<AccountsDashboardProps> = () => (
    <>
        <DashboardHeader />
        <Row>
            <Col md={16} className="py-10">
                <DashData />
            </Col>
            <Col className="border-l" md={8} xs={0}>
                <ListActivityLog />
            </Col>
            <AdaptiveActivityLog />
        </Row>
        <DashFooter />
    </>
);

export default AccountsDashboard;
