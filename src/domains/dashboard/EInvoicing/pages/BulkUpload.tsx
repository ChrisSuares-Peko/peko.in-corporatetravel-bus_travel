import { useEffect, useRef, useState } from 'react';

import { CloudUploadOutlined, FileTextOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Flex,
    Progress,
    Row,
    Space,
    Steps,
    Typography,
    Upload,
    message,
} from 'antd';

import { eInvoicingApi } from '../api';
import { BulkBatch, BulkRow, DocumentType } from '../types';

const { Step } = Steps;
const { Dragger } = Upload;

const TEMPLATES: { type: DocumentType; title: string; description: string }[] = [
    {
        type: 'sales-invoice',
        title: 'Sales Invoices',
        description: '15 columns. One row per invoice; multiple line items per row are supported.',
    },
    {
        type: 'sales-credit-note',
        title: 'Sales Credit Notes',
        description: 'Reference an existing FTA-cleared invoice and the reverse amounts.',
    },
    {
        type: 'purchase-invoice',
        title: 'Self-billed Purchase Invoices',
        description: 'Requires written self-billing agreement per supplier.',
    },
];

const REQUIRED_COLUMNS = [
    'invoice_number',
    'customer_name_en',
    'customer_trn',
    'issue_date',
    'description',
    'quantity',
    'unit_price',
    'tax_rate',
];

const parseCsv = (text: string): { columns: string[]; rows: BulkRow[] } => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (!lines.length) return { columns: [], rows: [] };
    const columns = lines[0].split(',').map(c => c.trim());
    const rows: BulkRow[] = lines.slice(1).map((line, idx) => {
        const cells = line.split(',').map(c => c.trim());
        const raw = Object.fromEntries(columns.map((col, i) => [col, cells[i] ?? '']));
        const trn = raw.customer_trn ?? '';
        const valid = trn.length === 0 || /^\d{15}$/.test(trn);
        return {
            rowNumber: idx + 2,
            raw,
            valid,
            error: valid ? undefined : 'TRN must be 15 digits',
            status: 'queued',
        };
    });
    return { columns, rows };
};

const BulkUpload = () => {
    const [step, setStep] = useState(0);
    const [template, setTemplate] = useState<DocumentType>('sales-invoice');
    const [columns, setColumns] = useState<string[]>([]);
    const [rows, setRows] = useState<BulkRow[]>([]);
    const [batch, setBatch] = useState<BulkBatch | null>(null);
    const pollRef = useRef<number | null>(null);

    useEffect(
        () => () => {
            if (pollRef.current) window.clearInterval(pollRef.current);
        },
        []
    );

    const totalErrors = rows.filter(r => !r.valid).length;
    const totalWarnings = 0;
    const totalValid = rows.length - totalErrors;

    const beforeUpload = async (file: File) => {
        if (file.size > 10 * 1024 * 1024) {
            message.error('Max file size is 10MB');
            return Upload.LIST_IGNORE;
        }
        const text = await file.text();
        const parsed = parseCsv(text);
        if (parsed.rows.length > 5000) {
            message.error('Max 5000 rows per upload');
            return Upload.LIST_IGNORE;
        }
        const missingRequired = REQUIRED_COLUMNS.filter(c => !parsed.columns.includes(c));
        if (missingRequired.length) {
            message.warning(`Missing required columns: ${missingRequired.join(', ')}`);
        }
        setColumns(parsed.columns);
        setRows(parsed.rows);
        setStep(2);
        return Upload.LIST_IGNORE;
    };

    const startSubmit = async () => {
        const valid = rows.filter(r => r.valid);
        const initial = await eInvoicingApi.submitBulk(valid, template);
        setBatch(initial);
        setStep(4);
        const tick = async () => {
            setBatch(curr => {
                if (!curr) return curr;
                eInvoicingApi.pollBulk(curr).then(next => {
                    setBatch(next);
                    if (next.completed && pollRef.current) {
                        window.clearInterval(pollRef.current);
                        pollRef.current = null;
                    }
                });
                return curr;
            });
        };
        pollRef.current = window.setInterval(tick, 1500) as unknown as number;
    };

    return (
        <div style={{ padding: '24px 0' }}>
            <Typography.Title level={3}>Bulk upload</Typography.Title>
            <Steps current={step} size="small" style={{ marginBottom: 24, maxWidth: 800 }}>
                <Step title="Template" />
                <Step title="Upload" />
                <Step title="Map" />
                <Step title="Preview" />
                <Step title="Process" />
            </Steps>

            {step === 0 && (
                <>
                    <Row gutter={[16, 16]}>
                        {TEMPLATES.map(t => (
                            <Col xs={24} md={8} key={t.type}>
                                <Card
                                    hoverable
                                    onClick={() => {
                                        setTemplate(t.type);
                                        setStep(1);
                                    }}
                                    style={{
                                        borderColor: template === t.type ? '#2563EB' : undefined,
                                    }}
                                >
                                    <Space direction="vertical">
                                        <FileTextOutlined style={{ fontSize: 24, color: '#2563EB' }} />
                                        <Typography.Title level={5} style={{ margin: 0 }}>
                                            {t.title}
                                        </Typography.Title>
                                        <Typography.Text type="secondary">
                                            {t.description}
                                        </Typography.Text>
                                        <Button type="link" style={{ paddingLeft: 0 }}>
                                            Download CSV template
                                        </Button>
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}

            {step === 1 && (
                <Card>
                    <Dragger accept=".csv" beforeUpload={beforeUpload} maxCount={1} multiple={false}>
                        <p className="ant-upload-drag-icon">
                            <CloudUploadOutlined style={{ fontSize: 36 }} />
                        </p>
                        <p className="ant-upload-text">Drag a CSV here or click to browse</p>
                        <p className="ant-upload-hint">Max 10MB or 5,000 rows.</p>
                    </Dragger>
                    <Flex style={{ marginTop: 12 }}>
                        <Button onClick={() => setStep(0)}>Back</Button>
                    </Flex>
                </Card>
            )}

            {step === 2 && (
                <Card title="Map columns">
                    <Typography.Paragraph type="secondary">
                        We auto-detected your columns. Required columns are flagged in red if missing.
                    </Typography.Paragraph>
                    <Row gutter={[12, 12]}>
                        {REQUIRED_COLUMNS.map(req => {
                            const matched = columns.includes(req);
                            return (
                                <Col xs={24} md={12} key={req}>
                                    <Flex justify="space-between" align="center">
                                        <Typography.Text strong>{req}</Typography.Text>
                                        <Typography.Text
                                            style={{
                                                color: matched ? '#16A34A' : '#DC2626',
                                            }}
                                        >
                                            {matched ? `→ ${req}` : 'Missing'}
                                        </Typography.Text>
                                    </Flex>
                                </Col>
                            );
                        })}
                    </Row>
                    <Flex justify="flex-end" gap={8} style={{ marginTop: 16 }}>
                        <Button onClick={() => setStep(1)}>Back</Button>
                        <Button type="primary" onClick={() => setStep(3)}>
                            Continue
                        </Button>
                    </Flex>
                </Card>
            )}

            {step === 3 && (
                <Card title="Preview & validate">
                    <Flex gap={16} style={{ marginBottom: 12 }}>
                        <Typography.Text strong>{totalValid} valid</Typography.Text>
                        <Typography.Text type="danger">{totalErrors} errors</Typography.Text>
                        <Typography.Text style={{ color: '#A16207' }}>
                            {totalWarnings} warnings
                        </Typography.Text>
                    </Flex>
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'separate',
                            borderSpacing: 0,
                            fontSize: 13,
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={{ padding: 8, textAlign: 'left' }}>Row</th>
                                {columns.slice(0, 5).map(c => (
                                    <th key={c} style={{ padding: 8, textAlign: 'left' }}>
                                        {c}
                                    </th>
                                ))}
                                <th style={{ padding: 8 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.slice(0, 20).map(r => (
                                <tr key={r.rowNumber} style={{ borderTop: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: 8 }}>{r.rowNumber}</td>
                                    {columns.slice(0, 5).map(c => (
                                        <td key={c} style={{ padding: 8 }}>
                                            {r.raw[c]}
                                        </td>
                                    ))}
                                    <td
                                        style={{
                                            padding: 8,
                                            color: r.valid ? '#16A34A' : '#DC2626',
                                        }}
                                    >
                                        {r.valid ? 'Valid' : r.error}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Flex justify="space-between" gap={8} style={{ marginTop: 16 }}>
                        <Button>Fix errors first</Button>
                        <Button type="primary" onClick={startSubmit} disabled={!totalValid}>
                            Submit valid rows
                        </Button>
                    </Flex>
                </Card>
            )}

            {step === 4 && batch && (
                <Card title="Processing">
                    <Progress
                        percent={Math.round(
                            ((batch.counters.cleared +
                                batch.counters.warning +
                                batch.counters.failed) /
                                (batch.rows.length || 1)) *
                                100
                        )}
                    />
                    <Row gutter={16} style={{ marginTop: 12 }}>
                        <Col span={6}>
                            <Card size="small">
                                <Typography.Text type="secondary">Submitted</Typography.Text>
                                <Typography.Title level={4} style={{ margin: 0 }}>
                                    {batch.counters.submitted} / {batch.rows.length}
                                </Typography.Title>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card size="small">
                                <Typography.Text type="secondary">Cleared</Typography.Text>
                                <Typography.Title level={4} style={{ margin: 0, color: '#16A34A' }}>
                                    {batch.counters.cleared}
                                </Typography.Title>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card size="small">
                                <Typography.Text type="secondary">Warnings</Typography.Text>
                                <Typography.Title level={4} style={{ margin: 0, color: '#A16207' }}>
                                    {batch.counters.warning}
                                </Typography.Title>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card size="small">
                                <Typography.Text type="secondary">Failed</Typography.Text>
                                <Typography.Title level={4} style={{ margin: 0, color: '#DC2626' }}>
                                    {batch.counters.failed}
                                </Typography.Title>
                            </Card>
                        </Col>
                    </Row>
                    {batch.completed && (
                        <Flex gap={12} style={{ marginTop: 16 }}>
                            <Button type="primary">Download successful invoices (ZIP)</Button>
                            <Button>Download error report (CSV)</Button>
                            <Button>Retry failed</Button>
                        </Flex>
                    )}
                </Card>
            )}
        </div>
    );
};

export default BulkUpload;
