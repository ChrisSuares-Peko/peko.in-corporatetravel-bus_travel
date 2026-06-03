import React from 'react';

import { Row, Col, Typography, List } from 'antd';

const { Title, Text } = Typography;

interface AssessmentStepProps {
    title: string;
    content: string[];
}

const AssessmentStep: React.FC<AssessmentStepProps> = ({ title, content }) => (
    <Row className="mb-4 space-y-2">
        <Col span={24} className="space-y-2">
            <Title level={5} style={{ color: '#7B7B7B' }}>
                {title}
            </Title>
            <List
                dataSource={content}
                renderItem={(item: string) => (
                    <div className="flex items-start">
                        {' '}
                        {/* Changed Flex to div for proper rendering */}
                        <Text className="mr-2 mt-1 text-stageGrey text-[12px] md:text-[15px] md:ml-2 ml-2">
                            &#8226;
                        </Text>
                        <Text className="text-stageGrey text-[12px] md:text-[15px]">{item}</Text>
                    </div>
                )}
            />
        </Col>
    </Row>
);

export default AssessmentStep;
