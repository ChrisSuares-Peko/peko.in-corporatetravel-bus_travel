import React from 'react';

import { Col, Grid, Row, Tabs, TabsProps, Typography } from 'antd';

import InfoCard from '@domains/dashboard/accounting/components/accountsDashboard/InfoCard';
import NavigationCards from '@domains/dashboard/accounting/components/accountsDashboard/NavigationCards';
import UploadBankStatement from '@domains/dashboard/accounting/components/accountsDashboard/UploadBankStatement';
import UploadCreditCard from '@domains/dashboard/accounting/components/accountsDashboard/UploadCreditCard';
import UploadEntry from '@domains/dashboard/accounting/components/accountsDashboard/UploadEntry';
import { dashboardData, navMenuDetails } from '@domains/dashboard/accounting/utils/AccountDash';

type Props = {};
const { useBreakpoint } = Grid;
const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Upload Entry ',
        children: <UploadEntry />,
    },
    {
        key: '2',
        label: ' Upload Bank Statement ',
        children: <UploadBankStatement />,
    },
    {
        key: '3',
        label: 'Upload Credit Card Statement ',
        children: <UploadCreditCard />,
    },
];

const DashData = (props: Props) => {
    const screems = useBreakpoint();
    const justify = screems.xxl ? 'space-between' : 'start';
    const gutter = screems.xxl ? 0 : 20;
    return (
        <>
            <Row gutter={[20, 20]} className="pr-0 md:pr-4">
                {dashboardData.map((item, i) => (
                    <Col xs={24} sm={12} md={12} lg={12} xl={8} xxl={8} key={i}>
                        <InfoCard
                            bgColor={item.bgColor}
                            title={item.title}
                            value={item.value}
                            icon={item.icon}
                            key={i}
                        />
                    </Col>
                ))}

                <Col xs={24}>
                    <Tabs
                        className="mt-5 sm:mt-0 w-full"
                        animated={{ inkBar: true, tabPane: false }}
                        defaultActiveKey="1"
                        size="large"
                        items={items}
                    />
                </Col>
            </Row>
            <Row gutter={[gutter, 20]} className="pr-0 md:pr-4" justify={justify}>
                <Col span={24} className="mt-12">
                    <Typography.Text className="ml-3 text-xl ">Other Services</Typography.Text>
                </Col>

                {navMenuDetails.map((item, i) => (
                    <Col
                        className="flex justify-center md:block"
                        xs={8}
                        sm={8}
                        md={8}
                        lg={8}
                        xl={6}
                        xxl={4}
                    >
                        <NavigationCards
                            icon={item.icon}
                            title={item.title}
                            isActive={item.isActive}
                            link={item.link}
                        />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default DashData;
