import { useEffect, useState } from 'react';

import {
    ArrowRightOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloudUploadOutlined,
    ExclamationCircleOutlined,
    FileSyncOutlined,
    FileTextOutlined,
    InboxOutlined,
    MinusCircleOutlined,
    PlusOutlined,
    ShoppingCartOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Flex, Row, Skeleton, Space, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { eInvoicingApi } from '../api';
import StatusPill from '../components/StatusPill';
import { useEInvoicingStatus } from '../hooks/useEInvoicingStatus';
import { BusinessProfile, EInvoiceDocument } from '../types';
import { formatAed } from '../utils/statusMap';

const { Text, Title } = Typography;

const Overview = () => {
    const navigate = useNavigate();
    const { metrics } = useEInvoicingStatus();
    const [recent, setRecent] = useState<EInvoiceDocument[]>([]);
    const [profile, setProfile] = useState<BusinessProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const base = paths.dashboard.einvoicing;

    useEffect(() => {
        Promise.all([
            eInvoicingApi.listDocuments('sales-invoice'),
            eInvoicingApi.getProfile(),
        ]).then(([docs, prof]) => {
            setRecent(
                [...docs].sort((a, b) => (a.issuedDate < b.issuedDate ? 1 : -1)).slice(0, 8)
            );
            setProfile(prof);
            setLoading(false);
        });
    }, []);

    const stats = [
        {
            label: 'Cleared this month',
            value: metrics.cleared,
            sub: formatAed(metrics.clearedAmount),
            color: '#15803D',
            bg: '#F0FDF4',
            border: '#BBF7D0',
            icon: <CheckCircleOutlined />,
            onClick: undefined as (() => void) | undefined,
        },
        {
            label: 'Pending clearance',
            value: metrics.pending,
            sub: 'Awaiting FTA response',
            color: '#1D4ED8',
            bg: '#EFF6FF',
            border: '#BFDBFE',
            icon: <ClockCircleOutlined />,
            onClick: () =>
                navigate(`${base}/${paths.einvoicing.salesInvoices}?status=PENDING`),
        },
        {
            label: 'With warnings',
            value: metrics.warnings,
            sub: 'Cleared with notes',
            color: '#A16207',
            bg: '#FFFBEB',
            border: '#FDE68A',
            icon: <WarningOutlined />,
            onClick: undefined as (() => void) | undefined,
        },
        {
            label: 'Rejected',
            value: metrics.rejected,
            sub: metrics.rejected > 0 ? 'Action required' : 'All clear',
            color: metrics.rejected > 0 ? '#B91C1C' : '#15803D',
            bg: metrics.rejected > 0 ? '#FEF2F2' : '#F0FDF4',
            border: metrics.rejected > 0 ? '#FECACA' : '#BBF7D0',
            icon: metrics.rejected > 0 ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />,
            onClick: metrics.rejected > 0
                ? () => navigate(`${base}/${paths.einvoicing.salesInvoices}?status=REJECTED`)
                : undefined,
        },
    ];

    const sections = [
        {
            key: paths.einvoicing.salesInvoices,
            label: 'Sales Invoices',
            description: 'Issue and track outbound invoices',
            icon: <FileTextOutlined style={{ fontSize: 20, color: '#FF3A3A' }} />,
            iconBg: '#FFF0F0',
            action: undefined
        },
        {
            key: paths.einvoicing.creditNotes,
            label: 'Credit Notes',
            description: 'Issue credit or debit adjustments',
            icon: <FileSyncOutlined style={{ fontSize: 20, color: '#7C3AED' }} />,
            iconBg: '#F5F3FF',
            action: undefined
        },
        {
            key: paths.einvoicing.purchaseInvoices,
            label: 'Purchase Invoices',
            description: 'Manage inbound supplier invoices',
            icon: <ShoppingCartOutlined style={{ fontSize: 20, color: '#0369A1' }} />,
            iconBg: '#F0F9FF',
            action: undefined,
        },
        {
            key: paths.einvoicing.purchaseCreditNotes,
            label: 'Purchase Credit Notes',
            description: 'Purchase-side credit adjustments',
            icon: <MinusCircleOutlined style={{ fontSize: 20, color: '#0891B2' }} />,
            iconBg: '#ECFEFF',
            action: undefined,
        },
        {
            key: paths.einvoicing.bulkUpload,
            label: 'Bulk Upload',
            description: 'Upload many invoices via CSV template',
            icon: <CloudUploadOutlined style={{ fontSize: 20, color: '#059669' }} />,
            iconBg: '#F0FDF4',
            action: undefined,
        },
        {
            key: paths.einvoicing.archive,
            label: 'Archive & Export',
            description: 'Download documents for compliance',
            icon: <InboxOutlined style={{ fontSize: 20, color: '#D97706' }} />,
            iconBg: '#FFFBEB',
            action: undefined,
        },
    ];

    return (
        <div style={{ padding: '10px 0' }}>
            {/* ── Header ────────────────────────────────────── */}
            <Flex justify="space-between" align="flex-start" wrap="wrap" gap={16} style={{ marginBottom: 10 }}>
                <div>
                    {loading ? (
                        <Skeleton.Input active style={{ width: 220, height: 32, marginBottom: 8 }} />
                    ) : (
                        <>
                            <Title level={3} style={{ margin: 0, marginBottom: 0 }}>
                                {profile?.legalName ?? 'E-Invoicing'}
                            </Title>
                            <Flex gap={10} style={{ marginTop: 4 }} align="center" wrap="wrap">
                                {profile && (
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        TRN {profile.trn}
                                    </Text>
                                )}
                                <Tag
                                    color="green"
                                    style={{ borderRadius: 999, margin: 0, fontSize: 12, lineHeight: '20px' }}
                                >
                                    ● Active
                                </Tag>
                                {profile && (
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        {profile.branches.length} branch{profile.branches.length !== 1 ? 'es' : ''}
                                    </Text>
                                )}
                            </Flex>
                        </>
                    )}
                </div>
                <Space wrap>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() =>
                            navigate(
                                `${base}/${paths.einvoicing.salesInvoices}/${paths.einvoicing.new}`
                            )
                        }
                    >
                        New Invoice
                    </Button>
                    <Button
                        icon={<PlusOutlined />}
                        onClick={() =>
                            navigate(
                                `${base}/${paths.einvoicing.creditNotes}/${paths.einvoicing.new}`
                            )
                        }
                    >
                        Credit Note
                    </Button>
                    <Button
                        icon={<CloudUploadOutlined />}
                        onClick={() => navigate(`${base}/${paths.einvoicing.bulkUpload}`)}
                    >
                        Bulk Upload
                    </Button>
                </Space>
            </Flex>

            {/* ── KPI strip ─────────────────────────────────── */}
            <Row gutter={[16, 16]} style={{ marginBottom: 32, marginTop: 32}}>
                {stats.map(s => (
                    <Col xs={24} sm={12} lg={6} key={s.label}>
                        <Card
                            hoverable={!!s.onClick}
                            onClick={s.onClick}
                            style={{
                                borderColor: s.border,
                                background: s.bg,
                                cursor: s.onClick ? 'pointer' : 'default',
                                transition: 'box-shadow 0.15s',
                            }}
                            styles={{ body: { padding: 20 } }}
                        >
                            <div>
                                <Flex justify="space-between" align="flex-start">
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: '#6B7280',
                                            letterSpacing: 0.8,
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {s.label}
                                    </Text>
                                    <div
                                        style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: 8,
                                            background: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 18,
                                            color: s.color,
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {s.icon}
                                    </div>
                                </Flex>
                                <div
                                    style={{
                                        fontSize: 36,
                                        fontWeight: 700,
                                        lineHeight: 1.1,
                                        color: s.color,
                                        margin: '8px 0 4px',
                                    }}
                                >
                                    {s.value}
                                </div>
                                <Flex align="center" justify="space-between" style={{ marginTop: 2 }}>
                                    <Text style={{ fontSize: 13, color: s.color, fontWeight: 500 }}>
                                        {s.sub}
                                    </Text>
                                    {s.onClick && (
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: s.color,
                                                fontWeight: 500,
                                            }}
                                        >
                                            View details <ArrowRightOutlined />
                                        </Text>
                                    )}
                                </Flex>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* ── Quick access ──────────────────────────────── */}
            <div style={{ marginBottom: 12 }}>
                <Title level={5} style={{ color: '#374151', margin: 0 }}>
                    Quick access
                </Title>
            </div>
            <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                {sections.map(s => (
                    <Col xs={24} sm={12} lg={8} key={s.key}>
                        <Card
                            hoverable
                            onClick={() => navigate(`${base}/${s.key}`)}
                            style={{
                                cursor: 'pointer',
                                border: '1px solid #F1F5F9',
                                transition: 'box-shadow 0.15s, border-color 0.15s',
                            }}
                            styles={{ body: { padding: '18px 20px' } }}
                        >
                            <Flex justify="space-between" align="center">
                                <Flex gap={14} align="center" style={{ minWidth: 0 }}>
                                    <div
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 10,
                                            background: s.iconBg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {s.icon}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <Text
                                            strong
                                            style={{
                                                display: 'block',
                                                fontSize: 14,
                                                marginBottom: 2,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {s.label}
                                        </Text>
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 12,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {s.description}
                                        </Text>
                                    </div>
                                </Flex>
                                <Flex gap={8} align="center" style={{ flexShrink: 0, marginLeft: 8 }}>
                                    {s.action && (
                                        <Button
                                            size="small"
                                            type="primary"
                                            onClick={e => {
                                                e.stopPropagation();
                                                navigate(s.action!.path);
                                            }}
                                            style={{ fontSize: 12, height: 26 }}
                                        >
                                            {s.action.label}
                                        </Button>
                                    )}
                                    <ArrowRightOutlined style={{ color: '#D1D5DB', fontSize: 13 }} />
                                </Flex>
                            </Flex>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* ── Recent activity ───────────────────────────── */}
            <Card
                title={
                    <Flex justify="space-between" align="center">
                        <Text strong style={{ fontSize: 14 }}>
                            Recent activity
                        </Text>
                        <Button
                            type="link"
                            style={{ padding: 0, height: 'auto', fontSize: 13 }}
                            onClick={() => navigate(`${base}/${paths.einvoicing.salesInvoices}`)}
                        >
                            View all invoices <ArrowRightOutlined />
                        </Button>
                    </Flex>
                }
                styles={{ body: { padding: 0 }, header: { borderBottom: '1px solid #F1F5F9' } }}
            >
                {loading ? (
                    <div style={{ padding: '20px 24px' }}>
                        <Skeleton active paragraph={{ rows: 5 }} />
                    </div>
                ) : recent.length === 0 ? (
                    <div
                        style={{
                            padding: '48px 24px',
                            textAlign: 'center',
                            color: '#9CA3AF',
                        }}
                    >
                        <FileTextOutlined style={{ fontSize: 32, marginBottom: 12 }} />
                        <div>No invoices yet. Create your first invoice above.</div>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F1F5F9' }}>
                                    {['Invoice #', 'Customer', 'Amount', 'Issued', 'Status', ''].map(
                                        h => (
                                            <th
                                                key={h}
                                                style={{
                                                    padding: '10px 20px',
                                                    textAlign: 'left',
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    color: '#6B7280',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 0.6,
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {h}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {recent.map((doc, i) => (
                                    <tr
                                        key={doc.documentId}
                                        style={{
                                            borderBottom:
                                                i < recent.length - 1
                                                    ? '1px solid #F9FAFB'
                                                    : 'none',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() =>
                                            navigate(
                                                `${base}/${paths.einvoicing.salesInvoices}/${doc.documentId}`
                                            )
                                        }
                                        onMouseEnter={e =>
                                            ((e.currentTarget as HTMLTableRowElement).style.background =
                                                '#FAFAFA')
                                        }
                                        onMouseLeave={e =>
                                            ((e.currentTarget as HTMLTableRowElement).style.background =
                                                'transparent')
                                        }
                                    >
                                        <td
                                            style={{
                                                padding: '13px 20px',
                                                fontSize: 13,
                                                fontWeight: 500,
                                                color: '#111827',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {doc.documentNumber}
                                        </td>
                                        <td
                                            style={{
                                                padding: '13px 20px',
                                                fontSize: 13,
                                                color: '#374151',
                                                maxWidth: 180,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {doc.customer.name}
                                        </td>
                                        <td
                                            style={{
                                                padding: '13px 20px',
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: '#111827',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {formatAed(doc.totals.grandTotal, doc.currency)}
                                        </td>
                                        <td
                                            style={{
                                                padding: '13px 20px',
                                                fontSize: 12,
                                                color: '#6B7280',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {doc.issuedDate}
                                        </td>
                                        <td style={{ padding: '13px 20px' }}>
                                            <StatusPill status={doc.status} size="sm" />
                                        </td>
                                        <td
                                            style={{
                                                padding: '13px 20px',
                                                textAlign: 'right',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            <Button
                                                type="link"
                                                size="small"
                                                style={{
                                                    padding: 0,
                                                    color: '#FF3A3A',
                                                    fontWeight: 500,
                                                    height: 'auto',
                                                    fontSize: 13,
                                                }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    navigate(
                                                        `${base}/${paths.einvoicing.salesInvoices}/${doc.documentId}`
                                                    );
                                                }}
                                            >
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Overview;
