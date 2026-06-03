import { useEffect, useMemo, useState } from 'react';

import { Button, Card, DatePicker, Flex, Input, Select, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import GenericTable from '@components/atomic/GenericTable';
import { paths } from '@src/routes/paths';

import { eInvoicingApi } from '../api';
import StatusPill from '../components/StatusPill';
import { DocumentStatus, DocumentType, EInvoiceDocument } from '../types';
import { formatAed } from '../utils/statusMap';

const { RangePicker } = DatePicker;

interface DocumentListProps {
    type: DocumentType;
    title: string;
    createPath?: string;
}

const STATUSES: DocumentStatus[] = [
    'DRAFT',
    'PENDING',
    'CLEARED',
    'WARNING',
    'REJECTED',
    'CANCELLED',
];

const DocumentList = ({ type, title, createPath }: DocumentListProps) => {
    const navigate = useNavigate();
    const [docs, setDocs] = useState<EInvoiceDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<DocumentStatus[]>([]);
    const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

    useEffect(() => {
        setLoading(true);
        eInvoicingApi.listDocuments(type).then(d => {
            setDocs(d);
            setLoading(false);
        });
    }, [type]);

    const filtered = useMemo(() => {
        return docs.filter(d => {
            if (search && !`${d.documentNumber} ${d.customer.name}`
                .toLowerCase()
                .includes(search.toLowerCase()))
                return false;
            if (statusFilter.length && !statusFilter.includes(d.status)) return false;
            if (range) {
                const issued = dayjs(d.issuedDate);
                if (issued.isBefore(range[0], 'day') || issued.isAfter(range[1], 'day')) return false;
            }
            return true;
        });
    }, [docs, search, statusFilter, range]);

    const isPurchase = type === 'purchase-invoice' || type === 'purchase-credit-note';
    const partyLabel = isPurchase ? 'Supplier' : 'Customer';

    const columns = [
        {
            title: '#',
            dataIndex: 'documentNumber',
            key: 'documentNumber',
            render: (_: unknown, doc: EInvoiceDocument) => (
                <Button
                    type="link"
                    onClick={() =>
                        navigate(`${paths.dashboard.einvoicing}/${createPath}/${doc.documentId}`)
                    }
                    style={{ padding: 0 }}
                >
                    {doc.documentNumber}
                </Button>
            ),
        },
        {
            title: partyLabel,
            dataIndex: ['customer', 'name'],
            key: 'customer',
            render: (_: unknown, doc: EInvoiceDocument) => doc.customer.name,
        },
        {
            title: 'Issue date',
            dataIndex: 'issuedDate',
            key: 'issuedDate',
        },
        {
            title: 'Amount',
            dataIndex: ['totals', 'grandTotal'],
            key: 'amount',
            render: (_: unknown, doc: EInvoiceDocument) =>
                formatAed(doc.totals.grandTotal, doc.currency),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (s: DocumentStatus) => <StatusPill status={s} size="sm" />,
        },
        {
            title: 'FTA Ref',
            dataIndex: 'ftaUuid',
            key: 'ftaUuid',
            render: (v: string | undefined) => v ?? '—',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, doc: EInvoiceDocument) => (
                <Space size={4}>
                    <Button
                        type="link"
                        size="small"
                        onClick={() =>
                            navigate(`${paths.dashboard.einvoicing}/${createPath}/${doc.documentId}`)
                        }
                    >
                        View
                    </Button>
                    <Button type="link" size="small">
                        PDF
                    </Button>
                    <Button type="link" size="small">
                        XML
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    {title}
                </Typography.Title>
                {createPath && (
                    <Button
                        type="primary"
                        onClick={() =>
                            navigate(`${paths.dashboard.einvoicing}/${createPath}/${paths.einvoicing.new}`)
                        }
                    >
                        + New {title}
                    </Button>
                )}
            </Flex>

            <Card style={{ marginTop: 12 }}>
                <Flex gap={12} wrap="wrap">
                    <Input.Search
                        placeholder="Search by # or customer"
                        style={{ width: 280 }}
                        onSearch={setSearch}
                        allowClear
                    />
                    <Select
                        mode="multiple"
                        placeholder="Status"
                        style={{ minWidth: 220 }}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={STATUSES.map(s => ({ value: s, label: s }))}
                    />
                    <RangePicker
                        onChange={vals =>
                            setRange(vals && vals[0] && vals[1] ? [vals[0], vals[1]] : null)
                        }
                    />
                </Flex>
            </Card>

            <Card style={{ marginTop: 12 }}>
                <GenericTable
                    columns={columns}
                    dataSource={filtered.map(d => ({ ...d, key: d.documentId }))}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default DocumentList;
