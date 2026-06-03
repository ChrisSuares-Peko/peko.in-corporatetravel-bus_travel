import React, { useEffect } from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import Dashboard from './Dash';
import WelcomePage from '../components/Dashboard/WelcomePage';
import { useProgressApi } from '../hooks/dashboardHooks/useProgressApi';
import { setPayrollProgress } from '../slices/payrollAuth';

const LandingPage = () => {
    const { isLoading } = useProgressApi();
    const { showDashboard, progress } = useAppSelector(state => state.reducer.payrollAuth);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(
            setPayrollProgress({
                showDashboard: false,
            })
        );
    }, [dispatch]);

    return (
        <>
            {
                // eslint-disable-next-line no-nested-ternary
                isLoading ? (
                    <Flex className="items-center justify-center" style={{ height: '70vh' }}>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    </Flex>
                ) : showDashboard || progress === '100%' ? (
                    <Dashboard />
                ) : (
                    <WelcomePage />
                )
            }
        </>
    );
};

export default LandingPage;
