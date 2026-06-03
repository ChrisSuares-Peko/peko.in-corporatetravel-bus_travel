import React from 'react';

import { Button, Col, Flex, Row, Typography } from 'antd';

import LandingPageImg from '@src/assets/images/LandingPageImg.png';
import useServiceAccess from '@src/hooks/useSubscriptionCheck';
import { accessKeys } from '@utils/accessKeys';
import { packageAccessKeys } from '@utils/packageAccessKeys';

import { corporateTravelFeatures } from '../../CorporateTravel/utils/features';
import CommonIndividualLandingPage from '../../IndividualPlan/pages/CommonIndividualLandingPage';
import CardHeader from '../components/CardHeader';
import CardList from '../components/CardList';
import { cardItems } from '../utils/data';

const CorporateCard = () => {
    const { corporateCard } = accessKeys;
    const isPurchased = useServiceAccess(corporateCard);
    return !isPurchased ? (
        <CommonIndividualLandingPage
            features={corporateTravelFeatures}
            serviceKey={packageAccessKeys['Corporate Cards']}
            title="Corporate cards"
            serviceName="Cards"
            svgIcon={LandingPageImg}
            description="Corporate Cards streamline business accounting, save time, and ensure smooth payment arrangements with real-time tracking and automated reconciliation. Simplify your payments effortlessly and enjoy exclusive rewards and enhanced security features."
        />
    ) : (
        <Flex vertical>
            <Typography.Text className="text-lg font-medium sm:text-xl">
                Corporate Card
            </Typography.Text>
            <CardHeader />

            <Row gutter={[35, 35]} className="mt-9 xxl:mt-12 " style={{ marginRight: '-32px' }}>
                {cardItems.map((item, index) => (
                    <Col key={index} xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                        <CardList icon={item.image} title={item.title} desc={item.description} />
                    </Col>
                ))}
            </Row>
            <Flex vertical justify="center" align="center" className="mt-12">
                <Typography.Text className="text-lg font-medium text-center">
                    Pay Smarter, Manage Easier!
                </Typography.Text>
                <Button danger type="primary" className="justify-center w-48 mt-5 font-medium">
                    Register for early access
                </Button>
            </Flex>
        </Flex>
    );
};

export default CorporateCard;
