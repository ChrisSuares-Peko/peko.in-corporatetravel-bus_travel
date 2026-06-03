import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Card, Col, Flex, Row, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

const steps = [
    {
        title: '1. Tell us about your business',
        body: 'TRN, trade license, address, branches and invoice defaults.',
    },
    {
        title: '2. We provision with the FTA',
        body: 'Account, secure credentials, business profile and webhook updates — all wired in seconds.',
    },
    {
        title: '3. Issue invoices the same way you do today',
        body: 'Peko signs, submits and archives every invoice. You see real-time clearance results.',
    },
];

const peko = [
    'Digital signing with FTA-approved credentials',
    'Submission to FTA in real time',
    'Long-term archive (5+ years)',
    'Live status tracking, warnings and retries',
];

const need = [
    'Your TRN (15 digits)',
    'Trade license & business activity code',
    'Address per branch',
    "Customer TRNs for B2B invoices",
];

const ActivationWall = () => {
    const navigate = useNavigate();
    const base = paths.dashboard.einvoicing;

    return (
        <div style={{ padding: '24px 0' }}>
            <Typography.Title level={2}>UAE E-Invoicing, the easy way</Typography.Title>
            <Typography.Paragraph style={{ maxWidth: 720, color: '#525252' }}>
                The UAE FTA mandates e-invoicing from 2027. Peko handles the heavy lifting —
                clearance, signing, archive — so you keep invoicing exactly how you do today.
            </Typography.Paragraph>

            <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
                {steps.map(s => (
                    <Col xs={24} md={8} key={s.title}>
                        <Card>
                            <Typography.Text strong>{s.title}</Typography.Text>
                            <Typography.Paragraph style={{ marginTop: 8, color: '#525252' }}>
                                {s.body}
                            </Typography.Paragraph>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
                <Col xs={24} md={12}>
                    <Card title="What Peko handles">
                        <Space direction="vertical" size={8}>
                            {peko.map(item => (
                                <Flex gap={8} align="start" key={item}>
                                    <CheckCircleFilled style={{ color: '#16A34A', marginTop: 4 }} />
                                    <Typography.Text>{item}</Typography.Text>
                                </Flex>
                            ))}
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="What you'll need">
                        <Space direction="vertical" size={8}>
                            {need.map(item => (
                                <Flex gap={8} align="start" key={item}>
                                    <CheckCircleFilled style={{ color: '#2563EB', marginTop: 4 }} />
                                    <Typography.Text>{item}</Typography.Text>
                                </Flex>
                            ))}
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Flex gap={12} style={{ marginTop: 32 }}>
                <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate(`${base}/${paths.einvoicing.onboarding}`)}
                >
                    Activate E-Invoicing
                </Button>
            </Flex>
        </div>
    );
};

export default ActivationWall;
