import React from 'react';

import { Col, Flex, Row, Typography, theme } from 'antd';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import SettingsIcon from '@domains/dashboard/Payroll/assets/icons/settings.svg';

const DashboardHeader = () => {
    const {
        token: { colorPrimary },
    } = theme.useToken();

    return (
        <Col span={24}>
            <Row
                className="md:border-b pb-8"
                align="middle"
                justify="space-between"
                gutter={[20, 20]}
            >
                <Flex gap="middle" vertical>
                    <Typography.Text className="text-2xl ms-3">Accounting</Typography.Text>
                    <Typography.Text className="text-lg ms-3">
                        Let us help each other to build profitable business ventures
                    </Typography.Text>
                </Flex>
                <Flex justify="end" align="center" gap={20} className="xs:w-full md:w-auto">
                    <Link className="mx-2 md:mx-0" to="#">
                        <Flex align="center" gap={5}>
                            <ReactSVG src={SettingsIcon} />
                            <Typography.Text
                                className="text=[0.6rem] md:text-[1rem] "
                                style={{ color: colorPrimary }}
                            >
                                Settings
                            </Typography.Text>
                        </Flex>
                    </Link>
                </Flex>
            </Row>
        </Col>
    );
};
export default DashboardHeader;
