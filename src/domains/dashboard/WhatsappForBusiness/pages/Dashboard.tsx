import { useEffect, useState } from 'react';

import { Row, Col, Skeleton, Flex } from 'antd';

import ActionButtons from '../components/ActionButtons';
import Features from '../components/Features';
import Information from '../components/Information';
import { useCreateBusinessProfileApi } from '../hooks/useCreateBusinessProfile';

const Dashboard = () => {
    const { BusinessProfile } = useCreateBusinessProfileApi();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        BusinessProfile();
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // eslint-disable-next-line

    return (
        <Flex>
            {isLoading ? (
                <Skeleton active />
            ) : (
                <Row className="px-0">
                    <Col span={24}>
                        <Information />
                        <Features />
                        <ActionButtons />
                    </Col>
                </Row>
            )}
        </Flex>
    );
};

export default Dashboard;
