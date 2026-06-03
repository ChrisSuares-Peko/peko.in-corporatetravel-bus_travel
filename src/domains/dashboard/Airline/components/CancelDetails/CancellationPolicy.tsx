import React from 'react';

import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Card, Typography, Row, Col, Collapse, Alert } from 'antd';

const { Panel } = Collapse;

const CancellationAndRefundPolicy: React.FC<{ cancellationCharges: any }> = ({
    cancellationCharges,
}) => {
    const customExpandIcon = (panelProps: { isActive?: boolean }) =>
        panelProps.isActive ? <DownOutlined /> : <RightOutlined />;

    return (
        <Collapse
            defaultActiveKey={['1']}
            expandIcon={customExpandIcon}
            expandIconPosition="end"
            style={{ backgroundColor: 'transparent', border: 'none' }}
        >
            <Panel
                header={
                    <Typography.Title level={5} style={{ margin: 0 }}>
                        Cancellation And Refund Policy
                    </Typography.Title>
                }
                key="1"
                style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: '8px',
                    border: 'none',
                }}
            >
                <Card style={{ borderRadius: '8px', backgroundColor: '#FAFAFA' }} bordered={false}>
                    <Card
                        style={{
                            backgroundColor: '#F5F5F5',
                            borderRadius: '8px',
                            padding: '20px',
                        }}
                        bordered={false}
                        // title={
                        //   <Typography.Title level={5}>
                        //     Cancellation Fee Per Person
                        //   </Typography.Title>
                        // }
                    >
                        <Row gutter={[16, 16]}>
                            {/* <Col span={12}>
                  <Typography.Text >Airline fee</Typography.Text>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Typography.Text>AED 1,850</Typography.Text>
                </Col>

                <Col span={12}>
                  <Typography.Text >Taxes and fee</Typography.Text>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Typography.Text>AED 70</Typography.Text>
                </Col>

                <Col span={12}>
                  <Typography.Text >Cancellation fee</Typography.Text>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Typography.Text>AED 100</Typography.Text>
                </Col> */}

                            {/* <Col span={12}>
                  <Typography.Text >Refund Amount</Typography.Text>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Typography.Text>AED 100</Typography.Text>
                </Col> */}

                            <Col span={12}>
                                <Typography.Text>Refund Method</Typography.Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Typography.Text>To Original Payment Method</Typography.Text>
                            </Col>

                            <Col span={12}>
                                <Typography.Text>Refund Processing Time</Typography.Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Typography.Text>7-10 Business Days</Typography.Text>
                            </Col>
                        </Row>
                    </Card>
                    <Alert
                        message="Cancellation/Flight change charges are indicative. Airline policy applicable during cancellation/flight change will be final. We won't be able to accept cancellation/change requests 3 hours before flight departure."
                        type="warning"
                        showIcon
                        style={{ marginTop: '20px' }}
                    />
                </Card>
            </Panel>
        </Collapse>
    );
};

export default CancellationAndRefundPolicy;
