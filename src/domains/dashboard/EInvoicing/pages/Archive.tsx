import { useEffect, useState } from 'react';

import { Button, Card, Checkbox, DatePicker, Flex, Modal, Radio, Space, Typography } from 'antd';

import GenericTable from '@components/atomic/GenericTable';

import { eInvoicingApi } from '../api';
import StatusPill from '../components/StatusPill';
import { DocumentType, EInvoiceDocument } from '../types';
import { formatAed } from '../utils/statusMap';

const { RangePicker } = DatePicker;

const Archive = () => {
    const [docs, setDocs] = useState<EInvoiceDocument[]>([]);
    const [exporting, setExporting] = useState(false);
    const [exportTypes, setExportTypes] = useState<DocumentType[]>([
        'sales-invoice',
        'sales-credit-note',
    ]);
    const [delivery, setDelivery] = useState<'download' | 'email'>('download');

    useEffect(() => {
        Promise.all([
            eInvoicingApi.listDocuments('sales-invoice'),
            eInvoicingApi.listDocuments('sales-credit-note'),
            eInvoicingApi.listDocuments('purchase-invoice'),
        ]).then(([s, c, p]) => setDocs([...s, ...c, ...p]));
    }, []);

    const columns = [
        { title: '#', dataIndex: 'documentNumber', key: 'documentNumber' },
        {
            title: 'Customer',
            key: 'customer',
            render: (_: unknown, doc: EInvoiceDocument) => doc.customer.name,
        },
        { title: 'Issue date', dataIndex: 'issuedDate', key: 'issuedDate' },
        {
            title: 'Amount',
            key: 'amount',
            render: (_: unknown, doc: EInvoiceDocument) =>
                formatAed(doc.totals.grandTotal, doc.currency),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: unknown, doc: EInvoiceDocument) => <StatusPill status={doc.status} size="sm" />,
        },
        {
            title: 'Compliance pack',
            key: 'pack',
            render: () => <Button type="link">Download</Button>,
        },
    ];

    const submitExport = async () => {
        await eInvoicingApi.exportArchive({ from: '', to: '', types: exportTypes });
        Modal.success({ title: 'Audit pack ready', content: 'Your ZIP is ready to download.' });
        setExporting(false);
    };

    return (
        <div style={{ padding: '24px 0' }}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Archive
                </Typography.Title>
                <Button type="primary" onClick={() => setExporting(true)}>
                    Export audit pack
                </Button>
            </Flex>

            <Card style={{ marginTop: 16 }}>
                <GenericTable
                    columns={columns}
                    dataSource={docs.map(d => ({ ...d, key: d.documentId }))}
                />
            </Card>

            <Modal
                open={exporting}
                title="Export audit pack"
                okText="Generate"
                onOk={submitExport}
                onCancel={() => setExporting(false)}
            >
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <div>
                        <Typography.Text strong>Date range</Typography.Text>
                        <div style={{ marginTop: 4 }}>
                            <RangePicker style={{ width: '100%' }} />
                        </div>
                    </div>
                    <div>
                        <Typography.Text strong>Document types</Typography.Text>
                        <div style={{ marginTop: 8 }}>
                            <Checkbox.Group
                                value={exportTypes}
                                onChange={vals => setExportTypes(vals as DocumentType[])}
                                options={[
                                    { value: 'sales-invoice', label: 'Sales invoices' },
                                    { value: 'sales-credit-note', label: 'Sales credit notes' },
                                    { value: 'purchase-invoice', label: 'Purchase invoices' },
                                    { value: 'purchase-credit-note', label: 'Purchase credit notes' },
                                ]}
                            />
                        </div>
                    </div>
                    <div>
                        <Typography.Text strong>Delivery</Typography.Text>
                        <div style={{ marginTop: 8 }}>
                            <Radio.Group
                                value={delivery}
                                onChange={e => setDelivery(e.target.value)}
                            >
                                <Radio value="download">Download directly</Radio>
                                <Radio value="email">Email when ready</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                </Space>
            </Modal>
        </div>
    );
};

export default Archive;
