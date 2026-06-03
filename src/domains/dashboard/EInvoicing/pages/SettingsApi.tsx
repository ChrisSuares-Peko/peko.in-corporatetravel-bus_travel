import { useState } from 'react';

import { CopyOutlined, KeyOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Flex, Input, Space, Table, Tag, Typography, message } from 'antd';

import { eInvoicingApi } from '../api';

const SAMPLE_LOG = [
    { id: 1, at: '2026-04-29 10:23', method: 'POST', endpoint: '/sales-invoices', status: 200 },
    { id: 2, at: '2026-04-29 09:45', method: 'POST', endpoint: '/sales-invoices', status: 422 },
    { id: 3, at: '2026-04-28 17:11', method: 'GET', endpoint: '/documents/abc', status: 200 },
    { id: 4, at: '2026-04-28 16:09', method: 'POST', endpoint: '/credit-notes', status: 200 },
    { id: 5, at: '2026-04-28 14:52', method: 'POST', endpoint: '/sales-invoices', status: 500 },
];

const SettingsApi = () => {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [webhookUrl, setWebhookUrl] = useState('https://api.example.com/webhooks/peko');

    const generate = async () => {
        const { apiKey: key } = await eInvoicingApi.generateApiKey();
        setApiKey(key);
    };

    return (
        <div style={{ padding: '24px 0' }}>
            <Typography.Title level={3}>API & webhooks</Typography.Title>
            <Typography.Paragraph type="secondary">
                Push invoices via Peko's REST API. Available on Growth and Enterprise plans.
            </Typography.Paragraph>

            <Card title="API key" style={{ marginTop: 16 }}>
                {!apiKey ? (
                    <Button type="primary" icon={<KeyOutlined />} onClick={generate}>
                        Generate API key
                    </Button>
                ) : (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Alert
                            type="warning"
                            showIcon
                            message="Save this key — you won't see it again."
                        />
                        <Input
                            value={apiKey}
                            readOnly
                            addonAfter={
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => {
                                        navigator.clipboard.writeText(apiKey);
                                        message.success('Copied');
                                    }}
                                />
                            }
                        />
                    </Space>
                )}
            </Card>

            <Card title="Webhook URL" style={{ marginTop: 16 }}>
                <Flex gap={8}>
                    <Input
                        value={webhookUrl}
                        onChange={e => setWebhookUrl(e.target.value)}
                        placeholder="https://your-domain/webhooks/peko"
                    />
                    <Button type="primary" onClick={() => message.success('Webhook saved')}>
                        Save
                    </Button>
                </Flex>
            </Card>

            <Card
                title="Recent API calls"
                style={{ marginTop: 16 }}
                extra={
                    <Button type="link" href="https://docs.ae.marmin.ai/docs/2026-01-01" target="_blank">
                        Documentation →
                    </Button>
                }
            >
                <Table
                    rowKey="id"
                    pagination={false}
                    dataSource={SAMPLE_LOG}
                    columns={[
                        { title: 'When', dataIndex: 'at' },
                        { title: 'Method', dataIndex: 'method' },
                        { title: 'Endpoint', dataIndex: 'endpoint' },
                        {
                            title: 'Status',
                            dataIndex: 'status',
                            render: status => (
                                <Tag color={status < 300 ? 'green' : status < 500 ? 'orange' : 'red'}>
                                    {status}
                                </Tag>
                            ),
                        },
                    ]}
                />
            </Card>
        </div>
    );
};

export default SettingsApi;
