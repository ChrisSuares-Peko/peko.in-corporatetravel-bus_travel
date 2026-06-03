import React from 'react';

import { Col, Flex, Row, Typography, Grid } from 'antd';
import { ReactSVG } from 'react-svg';

import { useAppSelector } from '@src/hooks/store';

import BeneficiariesList from '../../components/beneficiary/BeneficiariesList';
import SalikDetailForm from '../../components/forms/SalikDetailForm';
import { useFetchLimitApi } from '../../hooks/useFetchLimitApi';

const SalikDetails = () => {
    const item = useAppSelector(state => state.reducer.billPayment).vendor;
    const { limitData, isLoading } = useFetchLimitApi(item ? item?.path : '');
    console.log('limitData', limitData);
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    return (
        <Row>
            <Col xl={14} className="w-full xl:sticky xl:top-0 h-fit">
                <Flex align="center" gap={15} className="mb-10">
                    {item && <ReactSVG src={item.icon} height={screens.xs ? 40 : 60} />}
                    <Typography.Text className="text-lg font-medium">
                        {item ? item.title : ''}
                    </Typography.Text>
                </Flex>
                <SalikDetailForm limitData={limitData!} isLoading={isLoading} />
            </Col>
            <Col xl={10} className="w-full sm:bg-gray-50 rounded-3xl sm:p-6 mt-10 sm:mt-5 xl:mt-0">
                <BeneficiariesList />
            </Col>
        </Row>
    );
};

export default SalikDetails;
