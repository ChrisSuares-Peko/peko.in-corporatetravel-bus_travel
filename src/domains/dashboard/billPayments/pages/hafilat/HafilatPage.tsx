import React from 'react';

import { Col, Flex, Grid, Row, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import BeneficiariesList from '../../components/beneficiary/BeneficiariesList';
import TaflatDetailForm from '../../components/forms/HafilatDetailForm';

const HafilatPage = () => {
    const { state } = useLocation();
    const item = state ? state.item : null;
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    return (
        <Row>
            <Col xl={15} className="w-full xl:sticky xl:top-0 h-fit">
                <Flex align="center" gap={15} className="mb-10">
                    {item && <ReactSVG src={item.icon} />}
                    <Typography.Text className="text-lg font-medium">
                        {item ? item.title : ''}
                    </Typography.Text>
                </Flex>
                <TaflatDetailForm />
            </Col>
            <Col xl={9} className="w-full sm:bg-gray-50 rounded-3xl sm:p-6 mt-10 sm:mt-5 xl:mt-0">
                <BeneficiariesList />
            </Col>
        </Row>
    );
};

export default HafilatPage;
