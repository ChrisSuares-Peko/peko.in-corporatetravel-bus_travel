import { Col, Flex, Row, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import { useAppSelector } from '@src/hooks/store';

import { Avatar } from '../../assets/icons/order-status';
import PlanSummaryCard from '../PlanSummaryCard';

function TopSection() {
    const orderDetails = useAppSelector(state => state.reducer.works);

    const { name, description, billingCycle, price, features } = orderDetails?.planDetails || {};
    const { email, mobile, name: personName } = orderDetails || '';
    return (
        <Row gutter={[20, 20]} className="border-b pb-5">
            <PlanSummaryCard
                name={name ?? name}
                description={description ?? description}
                billingCycle={`/${billingCycle ?? billingCycle}`}
                price={`AED ${Number(price ?? price).toFixed(1)}`}
                features={features ?? features}
            />

            <Col xs={24} md={14} lg={12}>
                <Typography.Title level={5}>Your CRM Contact</Typography.Title>

                <Flex align="start" gap={10} className="mt-5">
                    <Flex>
                        <ReactSVG src={Avatar} />
                    </Flex>
                    <Flex vertical justify="space-between" gap={10} className="md:mt-7">
                        <Flex>
                            <Typography.Text className="text-lg font-normal">
                                {personName}
                            </Typography.Text>
                        </Flex>
                        <Flex gap={15} className="md:flex-row flex-col">
                            <Typography.Text className="text-lg font-normal text-neutral-400 ">
                                {email}
                            </Typography.Text>
                            <Typography.Text className="text-lg font-normal text-neutral-400">
                                {mobile}
                            </Typography.Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Col>
        </Row>
    );
}

export default TopSection;
