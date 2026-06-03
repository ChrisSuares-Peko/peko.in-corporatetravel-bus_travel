import React from 'react';

import { Col, Row, Skeleton } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useParams } from 'react-router-dom';

import ContactInformationOnReview from '../components/ContactInformationOnReview';
import PlanSummaryCard from '../components/PlanSummaryCard';
import { usePlanDetailsApi } from '../hooks/usePlanDetailsApi';

function ReviewPage() {
    const { id, planId } = useParams();
    const { data, isLoading } = usePlanDetailsApi(planId);
    const price = data?.price;
    const workId = data?.workId;
    const planName = data?.name;
    return (
        <Content className="mb-20 mt-14">
            <Row gutter={[40, 20]}>
                {isLoading ? (
                    <Col span={24}>
                        <Skeleton active avatar />
                    </Col>
                ) : (
                    <>
                        <PlanSummaryCard
                            id={data?.id}
                            name={data?.name}
                            description={data?.description}
                            billingCycle={`/${data?.billingCycle}`}
                            price={`AED ${Number(data?.price).toFixed(1)}`}
                            features={data?.features}
                        />
                        <ContactInformationOnReview
                            planId={planId}
                            workId={workId}
                            price={price}
                            planName={planName}
                        />
                    </>
                )}
            </Row>
        </Content>
    );
}

export default ReviewPage;
