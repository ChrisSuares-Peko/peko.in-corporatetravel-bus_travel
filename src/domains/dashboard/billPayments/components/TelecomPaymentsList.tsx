import { Col, Flex, Grid, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import IconCard from '@components/molecular/cards/IconCard';
import { useAppDispatch } from '@src/hooks/store';
import { checkSubServiceAccessCorporate } from '@utils/checkAccess';

import IconCardMobile from './IconCardMobile';
import { setVendor } from '../slices/billPayment';
import { telecomPayments } from '../utils/data';

const TelecomPaymentsList = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleClick = (item: any) => () => {
        dispatch(setVendor(item));
        navigate(item.url);
    };

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const filteredItems = telecomPayments.filter(item => {
        const serviceName = item.title;
        return checkSubServiceAccessCorporate('Bill Payments', serviceName as string);
    });

    return (
        <Flex vertical gap={28}>
            <Typography.Text className="font-medium text-lg sm:text-xl">
                Telecom Payments
            </Typography.Text>
            <Row gutter={{ xs: 10, sm: 0 }}>
                {filteredItems.map(item =>
                    screens.xs ? (
                        <IconCardMobile
                            icon={item.icon}
                            title={item.title}
                            onClick={handleClick(item)}
                            key={item.path}
                        />
                    ) : (
                        <Col sm={6} md={5} xl={4} className="lg:mx-2" key={item.path}>
                            <IconCard
                                icon={item.icon}
                                title={item.title}
                                onClick={handleClick(item)}
                            />
                        </Col>
                    )
                )}
            </Row>
        </Flex>
    );
};

export default TelecomPaymentsList;
