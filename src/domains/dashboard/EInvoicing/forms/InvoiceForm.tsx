import { useEffect, useMemo, useState } from 'react';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Alert,
    Button,
    Card,
    Col,
    DatePicker,
    Flex,
    Form,
    Input,
    InputNumber,
    Radio,
    Row,
    Select,
    Space,
    Typography,
} from 'antd';
import dayjs from 'dayjs';

import { eInvoicingApi } from '../api';
import TrnInput from '../components/TrnInput';
import { Customer, EInvoiceDocument, LineItem } from '../types';
import { formatAed } from '../utils/statusMap';

export type InvoiceFormMode =
    | 'sales-invoice'
    | 'sales-credit-note'
    | 'purchase-invoice'
    | 'purchase-credit-note';

interface InvoiceFormProps {
    mode: InvoiceFormMode;
    initial?: Partial<EInvoiceDocument>;
    onSaveDraft: (payload: ComposedInvoice) => void;
    onIssue: (payload: ComposedInvoice & { forceStatus?: 'PASS' | 'WARNING' | 'ERROR' | 'PENDING' }) => void;
}

export interface ComposedInvoice {
    documentNumber: string;
    documentTypeCode: '380' | '381' | '389' | '261';
    issuedDate: string;
    supplyDate?: string;
    dueDate?: string;
    customer: Customer;
    lineItems: LineItem[];
    totals: { subtotal: number; tax: number; grandTotal: number; currency: string };
    branchId?: string;
    notes?: string;
    paymentTerms?: string;
    buyerReference?: string;
    creditNoteReason?: string;
    creditNoteReasonText?: string;
    selfBillAcknowledged?: boolean;
}

const UNIT_OPTIONS = [
    { value: 'PCE', label: 'Piece' },
    { value: 'KGM', label: 'Kilogram' },
    { value: 'LTR', label: 'Litre' },
    { value: 'HUR', label: 'Hour' },
    { value: 'DAY', label: 'Day' },
];
const TAX_OPTIONS = [
    { value: 5, label: '5% (standard)' },
    { value: 0, label: '0% (zero-rated)' },
    { value: -1, label: 'Exempt' },
    { value: -2, label: 'Out of scope' },
];

const TYPE_CODE: Record<InvoiceFormMode, '380' | '381' | '389' | '261'> = {
    'sales-invoice': '380',
    'sales-credit-note': '381',
    'purchase-invoice': '389',
    'purchase-credit-note': '261',
};

const isPurchase = (m: InvoiceFormMode) =>
    m === 'purchase-invoice' || m === 'purchase-credit-note';
const isCredit = (m: InvoiceFormMode) =>
    m === 'sales-credit-note' || m === 'purchase-credit-note';

const blankLine = (): LineItem => ({
    description: '',
    quantity: 1,
    unit: 'PCE',
    unitPrice: 0,
    taxRate: 5,
});

const InvoiceForm = ({ mode, initial, onSaveDraft, onIssue }: InvoiceFormProps) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [partyMode, setPartyMode] = useState<'b2b' | 'b2c'>('b2b');
    const [lines, setLines] = useState<LineItem[]>(initial?.lineItems ?? [blankLine()]);
    const [forceStatus, setForceStatus] = useState<
        'PASS' | 'WARNING' | 'ERROR' | 'PENDING' | undefined
    >();
    const [selfBillAck, setSelfBillAck] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        eInvoicingApi.getCustomers().then(setCustomers);
    }, []);

    const subtotal = lines.reduce((acc, l) => acc + l.quantity * l.unitPrice, 0);
    const tax = lines.reduce(
        (acc, l) => acc + l.quantity * l.unitPrice * (Math.max(l.taxRate, 0) / 100),
        0
    );
    const grandTotal = subtotal + tax;

    const partyLabel = isPurchase(mode) ? 'Supplier' : 'Customer';
    const partyHint = isPurchase(mode)
        ? 'You are issuing this on behalf of your supplier.'
        : undefined;

    const initialPartyValues = useMemo(() => ({
        country: 'AE',
    }), []);

    const buildPayload = (): ComposedInvoice => {
        const v = form.getFieldsValue();
        const customer: Customer = {
            id: v.customerId ?? `inline_${Date.now()}`,
            type: partyMode === 'b2c' ? 'individual' : 'business',
            name: v.customerName,
            trn: partyMode === 'b2b' ? v.customerTrn : undefined,
            email: v.customerEmail,
            address: {
                buildingNumber: v.buildingNumber ?? '',
                street: v.street ?? '',
                district: v.district ?? '',
                city: v.city ?? '',
                emirate: v.emirate ?? '',
                country: v.country ?? 'AE',
            },
        };

        return {
            documentNumber:
                v.documentNumber || `INV-${dayjs().format('YYYY')}-${Math.floor(Math.random() * 9000 + 1000)}`,
            documentTypeCode: TYPE_CODE[mode],
            issuedDate: (v.issueDate ?? dayjs()).format('YYYY-MM-DD'),
            supplyDate: (v.supplyDate ?? dayjs()).format('YYYY-MM-DD'),
            dueDate: (v.dueDate ?? dayjs().add(30, 'day')).format('YYYY-MM-DD'),
            customer,
            lineItems: lines,
            totals: { subtotal, tax, grandTotal, currency: v.currency ?? 'AED' },
            branchId: v.branchId,
            notes: v.notes,
            paymentTerms: v.paymentTerms,
            buyerReference: v.buyerReference,
            creditNoteReason: v.creditNoteReason,
            creditNoteReasonText: v.creditNoteReasonText,
            selfBillAcknowledged: selfBillAck,
        };
    };

    const handleIssue = async () => {
        try {
            await form.validateFields();
            if (isPurchase(mode) && !selfBillAck) {
                form.setFields([
                    {
                        name: 'selfBillAck',
                        errors: ['Confirm your self-billing agreement to continue'],
                    },
                ]);
                return;
            }
            onIssue({ ...buildPayload(), forceStatus });
        } catch {
            // antd surfaces field errors
        }
    };

    const handleDraft = async () => {
        try {
            await form.validateFields([
                'documentNumber',
                'customerName',
            ]);
            onSaveDraft(buildPayload());
        } catch {
            // antd surfaces field errors
        }
    };

    const updateLine = (i: number, patch: Partial<LineItem>) => {
        setLines(curr => curr.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
    };

    return (
        <Form form={form} layout="vertical" initialValues={initialPartyValues}>
            <Card title={`A. ${partyLabel}`}>
                {isPurchase(mode) ? (
                    <Alert
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                        message="This is a self-billed invoice — you're issuing it on behalf of your supplier."
                        description="They must have agreed to this in writing."
                    />
                ) : null}

                <Radio.Group
                    value={partyMode}
                    onChange={e => setPartyMode(e.target.value)}
                    style={{ marginBottom: 16 }}
                >
                    <Radio.Button value="b2b">B2B (registered)</Radio.Button>
                    <Radio.Button value="b2c">B2C / Unregistered</Radio.Button>
                </Radio.Group>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item label={`Search ${partyLabel.toLowerCase()}`}>
                            <Select
                                allowClear
                                showSearch
                                placeholder={`Type to search past ${partyLabel.toLowerCase()}s`}
                                options={customers.map(c => ({ value: c.id, label: c.name }))}
                                onChange={id => {
                                    const c = customers.find(x => x.id === id);
                                    if (!c) return;
                                    form.setFieldsValue({
                                        customerId: c.id,
                                        customerName: c.name,
                                        customerTrn: c.trn,
                                        customerEmail: c.email,
                                        buildingNumber: c.address.buildingNumber,
                                        street: c.address.street,
                                        district: c.address.district,
                                        city: c.address.city,
                                        emirate: c.address.emirate,
                                        country: c.address.country,
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="customerName"
                            label={`${partyLabel} name`}
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    {partyMode === 'b2b' ? (
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="customerTrn"
                                label="TRN"
                                rules={[
                                    { pattern: /^\d{15}$/, message: 'TRN must be 15 digits' },
                                ]}
                            >
                                <TrnInput />
                            </Form.Item>
                        </Col>
                    ) : null}
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="customerEmail"
                            label="Email"
                            rules={[{ type: 'email', message: 'Enter a valid email' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                        <Form.Item name="buildingNumber" label="Building #">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={10}>
                        <Form.Item name="street" label="Street">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={10}>
                        <Form.Item name="district" label="District">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="city" label="City">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="emirate" label="Emirate">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="country" label="Country">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item shouldUpdate noStyle>
                    {() => {
                        const country = form.getFieldValue('country');
                        if (country && country !== 'AE') {
                            return (
                                <Alert
                                    type="warning"
                                    showIcon
                                    message="Cross-border invoice — different VAT rules apply."
                                    description="We'll mark it zero-rated unless you change the line items."
                                />
                            );
                        }
                        return null;
                    }}
                </Form.Item>

                {partyHint ? (
                    <Form.Item
                        validateStatus={selfBillAck ? 'success' : ''}
                        style={{ marginTop: 12 }}
                    >
                        <label>
                            <input
                                type="checkbox"
                                checked={selfBillAck}
                                onChange={e => setSelfBillAck(e.target.checked)}
                                style={{ marginRight: 8 }}
                            />
                            I confirm I have a self-billing agreement with this supplier.
                        </label>
                    </Form.Item>
                ) : null}
            </Card>

            {isCredit(mode) ? (
                <Card title="Credit reason" style={{ marginTop: 16 }}>
                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="creditNoteReason"
                                label="Reason code"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    options={[
                                        { value: 'RET-01', label: 'Return of goods' },
                                        { value: 'PRC-02', label: 'Pricing correction' },
                                        { value: 'CAN-03', label: 'Cancellation' },
                                        { value: 'OTH-99', label: 'Other (specify)' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={16}>
                            <Form.Item
                                name="creditNoteReasonText"
                                label="Reason details"
                                rules={[{ required: true, max: 500 }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            ) : null}

            <Card title="B. Line items" style={{ marginTop: 16 }}>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    {lines.map((line, i) => (
                        <Row key={i} gutter={8} align="middle">
                            <Col xs={24} md={6}>
                                <Input
                                    placeholder="Description"
                                    value={line.description}
                                    maxLength={500}
                                    onChange={e => updateLine(i, { description: e.target.value })}
                                />
                            </Col>
                            <Col xs={6} md={3}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Qty"
                                    value={line.quantity}
                                    min={0}
                                    step={0.001}
                                    onChange={v => updateLine(i, { quantity: Number(v) || 0 })}
                                />
                            </Col>
                            <Col xs={6} md={3}>
                                <Select
                                    style={{ width: '100%' }}
                                    options={UNIT_OPTIONS}
                                    value={line.unit}
                                    onChange={v => updateLine(i, { unit: v })}
                                />
                            </Col>
                            <Col xs={6} md={4}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Unit price"
                                    value={line.unitPrice}
                                    min={0}
                                    step={0.01}
                                    onChange={v => updateLine(i, { unitPrice: Number(v) || 0 })}
                                />
                            </Col>
                            <Col xs={6} md={4}>
                                <Select
                                    style={{ width: '100%' }}
                                    options={TAX_OPTIONS}
                                    value={line.taxRate}
                                    onChange={v => updateLine(i, { taxRate: v })}
                                />
                            </Col>
                            <Col xs={20} md={3}>
                                <Typography.Text strong>
                                    {formatAed(
                                        line.quantity *
                                            line.unitPrice *
                                            (1 + Math.max(line.taxRate, 0) / 100)
                                    )}
                                </Typography.Text>
                            </Col>
                            <Col xs={4} md={1}>
                                <Button
                                    icon={<DeleteOutlined />}
                                    type="text"
                                    onClick={() =>
                                        setLines(curr => curr.filter((_, idx) => idx !== i))
                                    }
                                />
                            </Col>
                        </Row>
                    ))}
                </Space>
                <Button
                    icon={<PlusOutlined />}
                    type="dashed"
                    style={{ marginTop: 12 }}
                    onClick={() => setLines(curr => [...curr, blankLine()])}
                >
                    Add line
                </Button>
            </Card>

            <Card title="C. Totals & metadata" style={{ marginTop: 16 }}>
                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item name="documentNumber" label="Invoice number">
                            <Input placeholder="Auto from sequence" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="issueDate" label="Issue date" initialValue={dayjs()}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="supplyDate" label="Supply date" initialValue={dayjs()}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            name="dueDate"
                            label="Due date"
                            initialValue={dayjs().add(30, 'day')}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="paymentTerms" label="Payment terms" initialValue="Net 30">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="currency" label="Currency" initialValue="AED">
                            <Select
                                options={[
                                    { value: 'AED', label: 'AED' },
                                    { value: 'USD', label: 'USD' },
                                    { value: 'EUR', label: 'EUR' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="branchId" label="Branch">
                            <Select
                                placeholder="Default branch"
                                options={[
                                    { value: 'br_dxb_01', label: 'Dubai HQ' },
                                    { value: 'br_auh_01', label: 'Abu Dhabi Office' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="buyerReference" label="PO reference">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item name="notes" label="Notes">
                            <Input.TextArea rows={2} maxLength={1000} />
                        </Form.Item>
                    </Col>
                </Row>

                <Card type="inner" style={{ background: '#F8FAFC' }}>
                    <Flex justify="space-between">
                        <Typography.Text>Subtotal</Typography.Text>
                        <Typography.Text>{formatAed(subtotal)}</Typography.Text>
                    </Flex>
                    <Flex justify="space-between" style={{ marginTop: 4 }}>
                        <Typography.Text>Total tax</Typography.Text>
                        <Typography.Text>{formatAed(tax)}</Typography.Text>
                    </Flex>
                    <Flex justify="space-between" style={{ marginTop: 4 }}>
                        <Typography.Text strong>Grand total</Typography.Text>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            {formatAed(grandTotal)}
                        </Typography.Title>
                    </Flex>
                </Card>

                <Card type="inner" title="Demo: simulate clearance result" style={{ marginTop: 16 }}>
                    <Radio.Group
                        value={forceStatus ?? 'PASS'}
                        onChange={e => setForceStatus(e.target.value)}
                    >
                        <Radio value="PASS">Cleared</Radio>
                        <Radio value="WARNING">Cleared with warnings</Radio>
                        <Radio value="ERROR">Rejected</Radio>
                        <Radio value="PENDING">Pending (async)</Radio>
                    </Radio.Group>
                </Card>
            </Card>

            <Flex
                justify="flex-end"
                gap={12}
                style={{
                    position: 'sticky',
                    bottom: 0,
                    background: 'white',
                    padding: '16px 0',
                    marginTop: 16,
                    borderTop: '1px solid #E5E7EB',
                }}
            >
                <Button onClick={handleDraft}>Save as Draft</Button>
                <Button type="primary" onClick={handleIssue}>
                    {mode === 'sales-invoice'
                        ? 'Issue Invoice'
                        : mode === 'sales-credit-note'
                          ? 'Issue Credit Note'
                          : mode === 'purchase-invoice'
                            ? 'Issue Self-Billed Invoice'
                            : 'Issue Purchase Credit Note'}
                </Button>
            </Flex>
        </Form>
    );
};

export default InvoiceForm;
