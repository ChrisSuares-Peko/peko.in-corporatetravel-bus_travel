import { useEffect, useState } from 'react';

import {
    DownloadOutlined,
    MailOutlined,
    PrinterOutlined,
    UndoOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Col, Descriptions, Divider, Flex, Row, Space, Timeline, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { eInvoicingApi } from '../api';
import SendInvoiceModal from '../components/SendInvoiceModal';
import StatusPill from '../components/StatusPill';
import { EInvoiceDocument } from '../types';
import { resolveMarminError } from '../utils/marminErrorMap';
import { formatAed } from '../utils/statusMap';

const DocumentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doc, setDoc] = useState<EInvoiceDocument | undefined>();
    const [sendOpen, setSendOpen] = useState(false);

    useEffect(() => {
        if (!id) return;
        eInvoicingApi.getDocument(id).then(setDoc);
    }, [id]);

    if (!doc) {
        return <div style={{ padding: '24px 0' }}>Loading…</div>;
    }

    const messages = doc.metaInfo?.zatcaResponse?.messages ?? [];

    return (
        <div style={{ padding: '24px 0' }}>
            <Flex justify="space-between" wrap="wrap" gap={12}>
                <Space direction="vertical" size={4}>
                    <Typography.Text type="secondary">Invoice</Typography.Text>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        {doc.documentNumber}
                    </Typography.Title>
                    <Space>
                        <StatusPill status={doc.status} />
                        <Typography.Text type="secondary">{doc.customer.name}</Typography.Text>
                        <Typography.Text strong>
                            {formatAed(doc.totals.grandTotal, doc.currency)}
                        </Typography.Text>
                    </Space>
                </Space>
                <Space wrap>
                    <Button icon={<DownloadOutlined />}>PDF</Button>
                    <Button icon={<DownloadOutlined />}>XML</Button>
                    <Button icon={<MailOutlined />} onClick={() => setSendOpen(true)}>
                        Send
                    </Button>
                    <Button
                        icon={<UndoOutlined />}
                        onClick={() =>
                            navigate(
                                `${paths.dashboard.einvoicing}/${paths.einvoicing.creditNotes}/${paths.einvoicing.new}`
                            )
                        }
                    >
                        Issue credit note
                    </Button>
                    <Button icon={<PrinterOutlined />}>Print</Button>
                </Space>
            </Flex>

            <Row gutter={24} style={{ marginTop: 16 }}>
                <Col xs={24} lg={14}>
                    <Card>
                        <div
                            style={{
                                aspectRatio: '8.5/11',
                                background: '#F8FAFC',
                                border: '1px dashed #CBD5E1',
                                borderRadius: 8,
                                padding: 24,
                                color: '#475569',
                            }}
                        >
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                {doc.documentNumber}
                            </Typography.Title>
                            <Typography.Text type="secondary">
                                Issued {doc.issuedDate} · Due {doc.dueDate}
                            </Typography.Text>
                            <Divider />
                            <Typography.Text strong>Bill to</Typography.Text>
                            <Typography.Paragraph style={{ marginBottom: 8 }}>
                                {doc.customer.name}
                                <br />
                                {doc.customer.address.street}, {doc.customer.address.city}
                            </Typography.Paragraph>
                            <Divider />
                            {doc.lineItems.map((line, i) => (
                                <Flex key={i} justify="space-between">
                                    <Typography.Text>
                                        {line.description} × {line.quantity}
                                    </Typography.Text>
                                    <Typography.Text>
                                        {formatAed(line.quantity * line.unitPrice)}
                                    </Typography.Text>
                                </Flex>
                            ))}
                            <Divider />
                            <Flex justify="space-between">
                                <Typography.Text>Subtotal</Typography.Text>
                                <Typography.Text>{formatAed(doc.totals.subtotal)}</Typography.Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Typography.Text>Tax</Typography.Text>
                                <Typography.Text>{formatAed(doc.totals.tax)}</Typography.Text>
                            </Flex>
                            <Flex justify="space-between" style={{ marginTop: 8 }}>
                                <Typography.Text strong>Total</Typography.Text>
                                <Typography.Text strong>
                                    {formatAed(doc.totals.grandTotal, doc.currency)}
                                </Typography.Text>
                            </Flex>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={10}>
                    <Card title="Timeline">
                        <Timeline
                            items={[
                                { color: 'gray', children: `Created — ${doc.issuedDate}` },
                                {
                                    color: 'blue',
                                    children: `Submitted to FTA — ${doc.issuedDate}`,
                                },
                                ...(doc.status === 'CLEARED' || doc.status === 'WARNING'
                                    ? [
                                          {
                                              color:
                                                  doc.status === 'CLEARED' ? 'green' : 'orange',
                                              children: `Cleared by FTA — ref ${doc.ftaUuid ?? '—'}`,
                                          },
                                      ]
                                    : []),
                            ]}
                        />
                    </Card>

                    <Card title="Compliance details" style={{ marginTop: 16 }}>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="FTA UUID">
                                {doc.ftaUuid ?? '—'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Document hash">
                                {doc.metaInfo?.documentHash ?? '—'}
                            </Descriptions.Item>
                            <Descriptions.Item label="ICV">{doc.metaInfo?.icv ?? '—'}</Descriptions.Item>
                            <Descriptions.Item label="PIH">{doc.metaInfo?.pih ?? '—'}</Descriptions.Item>
                            <Descriptions.Item label="UBL version">
                                {doc.metaInfo?.ublVersion ?? '—'}
                            </Descriptions.Item>
                            <Descriptions.Item label="QR code">
                                {doc.qrCode ? '[QR rendered]' : '—'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {messages.length ? (
                        <Card title="Notes from FTA" style={{ marginTop: 16 }}>
                            {messages.map(m => {
                                const r = resolveMarminError(m.code);
                                return (
                                    <Alert
                                        key={m.code}
                                        type={m.severity === 'error' ? 'error' : 'warning'}
                                        showIcon
                                        message={r.en}
                                        description={r.field ? `Field: ${r.field}` : undefined}
                                        style={{ marginBottom: 8 }}
                                    />
                                );
                            })}
                        </Card>
                    ) : null}

                    <Card title="Audit log" style={{ marginTop: 16 }}>
                        <Timeline
                            items={[
                                { children: `Created by Sahara Trading user — ${doc.issuedDate}` },
                                { children: `Issued — ${doc.issuedDate}` },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>

            <SendInvoiceModal
                open={sendOpen}
                document={doc}
                onClose={() => setSendOpen(false)}
            />
        </div>
    );
};

export default DocumentDetail;
