import React from 'react';

import { Flex, Typography, Col, theme, Divider, Grid } from 'antd';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import SettingsIcon from '@domains/dashboard/Payroll/assets/icons/settings.svg';
import { paths } from '@src/routes/paths';

import PayrollStepper from './PayrollStepper';
import WelcomePageFooter from './WelcomePageFooter';

const WelcomePage = () => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const screens = Grid.useBreakpoint();

    return (
        //  const { user } = useAppSelector(state => state.reducer.user);
        <>
            <Col>
                <Flex align="center" justify="space-between">
                    <Typography.Text className="text-xl font-semibold ms-3">
                        HR Dashboard
                    </Typography.Text>
                    <Link
                        className="mx-2 md:mx-0"
                        to={`/${paths.payroll.index}/${paths.payroll.hrSettings}?activeTab=1`}
                    >
                        <Flex justify="end" align="center">
                            <ReactSVG src={SettingsIcon} />
                            <Typography.Text
                                className="text=[0.6rem] md:text-[1rem] cursor-pointer"
                                style={{ color: colorPrimary }}
                            >
                                Settings
                            </Typography.Text>
                        </Flex>
                    </Link>
                </Flex>
            </Col>
            <Divider
                className="py-0 mt-8 -ml-10 "
                style={{ width: screens.xxl ? '105.8%' : '106.6%' }}
            />
            <Flex vertical className="w-full" gap={20}>
                <PayrollStepper />
                <WelcomePageFooter />
            </Flex>
        </>
    );
};
export default WelcomePage;
