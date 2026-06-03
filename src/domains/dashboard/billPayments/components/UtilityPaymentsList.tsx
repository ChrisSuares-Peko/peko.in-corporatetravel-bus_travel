import React from 'react';

import { Col, Flex, Grid, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import IconCard from '@components/molecular/cards/IconCard';
import { useAppDispatch } from '@src/hooks/store';
import { checkSubServiceAccessCorporate } from '@utils/checkAccess';

import IconCardMobile from './IconCardMobile';
import { setVendor } from '../slices/billPayment';
import { utilityPayments } from '../utils/data';

const UtilityPaymentsList = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const handleClick = (item: any) => () => {
        dispatch(setVendor(item));
        navigate(item.url);
    };
    const filteredItems = utilityPayments.filter(item => {
        const serviceName = item.title;
        return checkSubServiceAccessCorporate('Bill Payments', serviceName as string);
    });

    return (
        <Flex vertical gap={28} className="mt-7 sm:mt-14">
            <Typography.Text className="font-medium text-lg sm:text-xl">
                Utility Payments
            </Typography.Text>
            <Row gutter={[10, 30]}>
                {filteredItems.map((item, index) =>
                    screens.xs ? (
                        <IconCardMobile
                            icon={item.icon}
                            title={item.title}
                            onClick={handleClick(item)}
                            key={item.path}
                        />
                    ) : (
                        <React.Fragment key={index}>
                            {index === 4 && screens.xl && <Col key="empty" span={4} />}
                            {index === 8 && screens.xl && <Col key="empty" span={4} />}
                            <Col sm={6} md={5} xl={4} className="lg:mx-2" key={item.path}>
                                <IconCard
                                    icon={item.icon}
                                    title={item.title}
                                    onClick={handleClick(item)}
                                />
                            </Col>
                        </React.Fragment>
                    )
                )}
            </Row>
        </Flex>
    );
};
export default UtilityPaymentsList;
