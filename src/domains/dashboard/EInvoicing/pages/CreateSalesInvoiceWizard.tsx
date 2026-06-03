import { useEffect, useMemo, useState } from 'react';

import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CloseOutlined,
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    ExperimentOutlined,
    MailOutlined,
    PlusOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    Alert,
    Avatar,
    Button,
    Card,
    Col,
    Collapse,
    DatePicker,
    Divider,
    Flex,
    Form,
    Input,
    InputNumber,
    Radio,
    Row,
    Segmented,
    Select,
    Space,
    Steps,
    Tag,
    Typography,
    message,
} from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { eInvoicingApi } from '../api';
import ClearanceModal from '../components/ClearanceModal';
import SendInvoiceModal from '../components/SendInvoiceModal';
import TrnInput from '../components/TrnInput';
import { Customer, EInvoiceDocument, LineItem } from '../types';
import { formatAed } from '../utils/statusMap';

const { Text, Title } = Typography;

/* ─── Form value types ───────────────────────────────────────────────────────── */

interface CustomerFormValues {
    customerId?: string;
    customerName?: string;
    customerTrn?: string;
    customerEmail?: string;
    buildingNumber?: string;
    street?: string;
    district?: string;
    city?: string;
    emirate?: string;
    country?: string;
}

interface DetailsFormValues {
    documentNumber?: string;
    issuedDate?: dayjs.Dayjs;
    supplyDate?: dayjs.Dayjs;
    dueDate?: dayjs.Dayjs;
    currency?: string;
    branchId?: string;
    paymentTerms?: string;
    buyerReference?: string;
    notes?: string;
}

/* ─── Constants ─────────────────────────────────────────────────────────────── */

const UNIT_OPTIONS = [
    { value: 'PCE', label: 'Piece' },
    { value: 'KGM', label: 'Kilogram' },
    { value: 'LTR', label: 'Litre' },
    { value: 'HUR', label: 'Hour' },
    { value: 'DAY', label: 'Day' },
];

const TAX_OPTIONS = [
    { value: 5, label: '5% VAT' },
    { value: 0, label: '0% Zero-rated' },
    { value: -1, label: 'Exempt' },
    { value: -2, label: 'Out of scope' },
];

const TAX_LABEL: Record<string, string> = {
    '5': '5% VAT',
    '0': '0% Zero',
    '-1': 'Exempt',
    '-2': 'Out of scope',
};

const BRANCH_OPTIONS = [
    { value: 'br_dxb_01', label: 'Dubai HQ' },
    { value: 'br_auh_01', label: 'Abu Dhabi Office' },
];

const WIZARD_STEPS = [
    { title: 'Customer' },
    { title: 'Items'},
    { title: 'Details'},
    { title: 'Review'},
];

const STEP_SUBTITLES: Record<number, string> = {
    0: "Add the person or business you're invoicing. Required for FTA clearance.",
    1: "Add the products or services you're charging for. Each line needs a description and tax rate.",
    2: 'Set the invoice number, dates, and any other optional details.',
    3: 'Review everything before issuing. Once cleared by the FTA, this cannot be edited.',
};

const blankLine = (): LineItem => ({
    description: '',
    quantity: 1,
    unit: 'PCE',
    unitPrice: 0,
    taxRate: 5,
});

/* ─── Live Totals Panel ──────────────────────────────────────────────────────── */

interface TotalsPanelProps {
    lines: LineItem[];
    currency?: string;
    muted?: boolean;
}

const TotalsPanel = ({ lines, currency = 'AED', muted }: TotalsPanelProps) => {
    const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
    const tax = lines.reduce(
        (s, l) => s + l.quantity * l.unitPrice * (Math.max(l.taxRate, 0) / 100),
        0,
    );
    const grandTotal = subtotal + tax;

    return (
        <Card
            style={{
                border: '1px solid #EBEBEB',
                background: '#FAFAFA',
                opacity: muted ? 0.45 : 1,
                transition: 'opacity 0.25s',
            }}
        >
            <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                <Text
                    type="secondary"
                    style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase' }}
                >
                    Invoice Summary
                </Text>
                <Tag style={{ borderRadius: 20, fontWeight: 600, fontSize: 11 }}>
                    {lines.length} {lines.length === 1 ? 'item' : 'items'}
                </Tag>
            </Flex>

            <Space direction="vertical" style={{ width: '100%' }} size={10}>
                <Flex justify="space-between">
                    <Text type="secondary" style={{ fontSize: 13 }}>Subtotal</Text>
                    <Text style={{ fontFamily: 'monospace', fontSize: 13 }}>{formatAed(subtotal, currency)}</Text>
                </Flex>
                <Flex justify="space-between">
                    <Text type="secondary" style={{ fontSize: 13 }}>VAT</Text>
                    <Text style={{ fontFamily: 'monospace', fontSize: 13 }}>{formatAed(tax, currency)}</Text>
                </Flex>
                <Divider style={{ margin: '6px 0' }} />
                <Flex justify="space-between" align="center">
                    <Text strong>Total</Text>
                    <Text strong style={{ fontFamily: 'monospace', fontSize: 18, color: '#121212' }}>
                        {formatAed(grandTotal, currency)}
                    </Text>
                </Flex>
            </Space>
        </Card>
    );
};

/* ─── Step 1: Customer ───────────────────────────────────────────────────────── */

interface StepCustomerProps {
    form: ReturnType<typeof Form.useForm>[0];
    partyMode: 'b2b' | 'b2c';
    onPartyModeChange: (mode: 'b2b' | 'b2c') => void;
    customers: Customer[];
    selectedCustomer: Customer | null;
    onSelectCustomer: (customer: Customer | null) => void;
}

const StepCustomer = ({
    form,
    partyMode,
    onPartyModeChange,
    customers,
    selectedCustomer,
    onSelectCustomer,
}: StepCustomerProps) => {
    const clearSelected = () => {
        onSelectCustomer(null);
        form.resetFields([
            'customerId',
            'customerName',
            'customerTrn',
            'customerEmail',
            'buildingNumber',
            'street',
            'district',
            'city',
            'emirate',
        ]);
        form.setFieldValue('country', 'AE');
    };

    const handleSelect = (id: string) => {
        const c = customers.find(x => x.id === id);
        if (!c) return;
        onSelectCustomer(c);
        onPartyModeChange(c.type === 'individual' ? 'b2c' : 'b2b');
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
    };

    return (
        <Form form={form} layout="vertical" initialValues={{ country: 'AE' }}>
            <Form.Item name="customerId" hidden>
                <Input />
            </Form.Item>

            {/* B2B / B2C toggle */}
            <div style={{ marginBottom: 20 }}>
                <Text
                    type="secondary"
                    style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}
                >
                    Customer type
                </Text>
                <Segmented
                    value={partyMode}
                    onChange={v => onPartyModeChange(v as 'b2b' | 'b2c')}
                    options={[
                        { value: 'b2b', label: 'Business (B2B)' },
                        { value: 'b2c', label: 'Individual (B2C)' },
                    ]}
                    size="large"
                    style={{ width: '100%', maxWidth: 380 }}
                />
            </div>

            {/* Selected customer card */}
            {selectedCustomer ? (
                <div
                    style={{
                        marginBottom: 20,
                        padding: '14px 18px',
                        background: '#FFF8F8',
                        border: '1.5px solid #FFD6D6',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                    }}
                >
                    <Flex align="center" gap={14}>
                        <Avatar
                            size={44}
                            style={{ background: '#FF3A3A', fontWeight: 700, fontSize: 18, flexShrink: 0 }}
                            icon={!selectedCustomer.name ? <UserOutlined /> : undefined}
                        >
                            {selectedCustomer.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                            <Text strong style={{ display: 'block', fontSize: 15 }}>
                                {selectedCustomer.name}
                            </Text>
                            {selectedCustomer.trn && (
                                <Text
                                    type="secondary"
                                    style={{ fontFamily: 'monospace', fontSize: 12, display: 'block' }}
                                >
                                    TRN: {selectedCustomer.trn}
                                </Text>
                            )}
                            {selectedCustomer.email && (
                                <Text style={{ fontSize: 13, color: '#FF3A3A', display: 'block' }}>
                                    {selectedCustomer.email}
                                </Text>
                            )}
                        </div>
                    </Flex>
                    <Button
                        size="small"
                        icon={<CloseOutlined />}
                        type="text"
                        onClick={clearSelected}
                    >
                        Change
                    </Button>
                </div>
            ) : (
                <Form.Item label="Search past customers" style={{ marginBottom: 20 }}>
                    <Select
                        showSearch
                        allowClear
                        size="large"
                        placeholder="Type to search by name..."
                        options={customers.map(c => ({ value: c.id, label: c.name }))}
                        filterOption={(input, opt) =>
                            (opt?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={id => id && handleSelect(id)}
                    />
                </Form.Item>
            )}

            {/* Detail fields */}
            <Row gutter={16}>
                <Col xs={24} md={partyMode === 'b2b' ? 12 : 24}>
                    <Form.Item
                        name="customerName"
                        label="Customer name"
                        rules={[{ required: true, message: 'Customer name is required' }]}
                    >
                        <Input
                            size="large"
                            placeholder="e.g. Al Naseem Logistics LLC"
                            prefix={<UserOutlined style={{ color: '#C0C0C0' }} />}
                        />
                    </Form.Item>
                </Col>

                {partyMode === 'b2b' && (
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="customerTrn"
                            label="Tax Registration Number (TRN)"
                            rules={[
                                { pattern: /^\d{15}$/, message: 'TRN must be exactly 15 digits' },
                            ]}
                        >
                            <TrnInput />
                        </Form.Item>
                    </Col>
                )}

                <Col xs={24} md={12}>
                    <Form.Item
                        name="customerEmail"
                        label="Email address"
                        rules={[{ type: 'email', message: 'Enter a valid email address' }]}
                    >
                        <Input
                            size="large"
                            placeholder="billing@company.ae"
                            prefix={<MailOutlined style={{ color: '#C0C0C0' }} />}
                        />
                    </Form.Item>
                </Col>
            </Row>

            {/* Collapsible address */}
            <Collapse
                ghost
                items={[
                    {
                        key: 'addr',
                        label: (
                            <Text style={{ fontSize: 13, color: '#888' }}>
                                Address (optional — required for some B2B transactions)
                            </Text>
                        ),
                        children: (
                            <Row gutter={16}>
                                <Col xs={24} md={6}>
                                    <Form.Item name="buildingNumber" label="Building #">
                                        <Input placeholder="101" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={18}>
                                    <Form.Item name="street" label="Street">
                                        <Input placeholder="Sheikh Zayed Road" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item name="district" label="District">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item name="city" label="City">
                                        <Input placeholder="Dubai" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item name="emirate" label="Emirate">
                                        <Input placeholder="Dubai" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item name="country" label="Country">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ),
                    },
                ]}
            />

            <Form.Item shouldUpdate noStyle>
                {() =>
                    form.getFieldValue('country') &&
                    form.getFieldValue('country') !== 'AE' ? (
                        <Alert
                            type="warning"
                            showIcon
                            message="Cross-border invoice — zero-rate rules apply."
                            description="Line items will default to 0% VAT for this customer."
                            style={{ marginTop: 8 }}
                        />
                    ) : null
                }
            </Form.Item>
        </Form>
    );
};

/* ─── Step 2: Line Items ─────────────────────────────────────────────────────── */

interface StepLineItemsProps {
    lines: LineItem[];
    errors: boolean[];
    onChange: (lines: LineItem[]) => void;
    onErrorsChange: (errors: boolean[]) => void;
}

const StepLineItems = ({ lines, errors, onChange, onErrorsChange }: StepLineItemsProps) => {
    const update = (i: number, patch: Partial<LineItem>) => {
        onChange(lines.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
        if (patch.description !== undefined && patch.description.trim()) {
            const next = [...errors];
            next[i] = false;
            onErrorsChange(next);
        }
    };

    const remove = (i: number) => {
        onChange(lines.filter((_, idx) => idx !== i));
        onErrorsChange(errors.filter((_, idx) => idx !== i));
    };

    const duplicate = (i: number) => {
        const next = [...lines];
        next.splice(i + 1, 0, { ...lines[i] });
        onChange(next);
        const nextErr = [...errors];
        nextErr.splice(i + 1, 0, false);
        onErrorsChange(nextErr);
    };

    return (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {lines.map((line, i) => {
                const lineTotal =
                    line.quantity * line.unitPrice * (1 + Math.max(line.taxRate, 0) / 100);

                return (
                    <Card
                        key={i}
                        style={{
                            border: errors[i] ? '1.5px solid #FF4D4F' : '1px solid #E8E8E8',
                            background: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                        }}
                    >
                        {/* Card header: number badge + actions */}
                        <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
                            <Flex align="center" gap={8}>
                                <div
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: 4,
                                        background: '#F0F0F0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: '#666',
                                    }}
                                >
                                    {i + 1}
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Line item
                                </Text>
                            </Flex>
                            <Flex gap={2}>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => duplicate(i)}
                                    title="Duplicate"
                                />
                                <Button
                                    type="text"
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => remove(i)}
                                    disabled={lines.length === 1}
                                    title="Remove"
                                />
                            </Flex>
                        </Flex>

                        {/* Description */}
                        <Input
                            size="large"
                            placeholder="Description — e.g. Consulting services, Q1 2026"
                            value={line.description}
                            maxLength={500}
                            status={errors[i] ? 'error' : ''}
                            style={{ marginBottom: errors[i] ? 4 : 14 }}
                            onChange={e => update(i, { description: e.target.value })}
                        />
                        {errors[i] && (
                            <Text type="danger" style={{ fontSize: 12, display: 'block', marginBottom: 10 }}>
                                Description is required
                            </Text>
                        )}

                        {/* Qty / Unit / Price / Tax / Total */}
                        <Row gutter={12} align="bottom">
                            <Col xs={12} sm={5}>
                                <div>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
                                    >
                                        Quantity
                                    </Text>
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        value={line.quantity}
                                        min={0}
                                        step={0.001}
                                        onChange={v => update(i, { quantity: Number(v) || 0 })}
                                    />
                                </div>
                            </Col>
                            <Col xs={12} sm={5}>
                                <div>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
                                    >
                                        Unit
                                    </Text>
                                    <Select
                                        style={{ width: '100%' }}
                                        options={UNIT_OPTIONS}
                                        value={line.unit}
                                        onChange={v => update(i, { unit: v })}
                                    />
                                </div>
                            </Col>
                            <Col xs={12} sm={6}>
                                <div>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
                                    >
                                        Unit price
                                    </Text>
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        value={line.unitPrice}
                                        min={0}
                                        step={0.01}
                                        prefix="AED"
                                        onChange={v => update(i, { unitPrice: Number(v) || 0 })}
                                    />
                                </div>
                            </Col>
                            <Col xs={12} sm={5}>
                                <div>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
                                    >
                                        Tax rate
                                    </Text>
                                    <Select
                                        style={{ width: '100%' }}
                                        options={TAX_OPTIONS}
                                        value={line.taxRate}
                                        onChange={v => update(i, { taxRate: v })}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} sm={3}>
                                <div style={{ textAlign: 'right', paddingBottom: 2 }}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 11, display: 'block', marginBottom: 4 }}
                                    >
                                        Total
                                    </Text>
                                    <Text
                                        strong
                                        style={{ fontFamily: 'monospace', fontSize: 14, whiteSpace: 'nowrap' }}
                                    >
                                        {formatAed(lineTotal)}
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                );
            })}

            <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => {
                    onChange([...lines, blankLine()]);
                    onErrorsChange([...errors, false]);
                }}
                style={{ width: '100%', height: 46 }}
            >
                Add another item
            </Button>
        </Space>
    );
};

/* ─── Step 3: Invoice Details ────────────────────────────────────────────────── */

interface StepDetailsProps {
    form: ReturnType<typeof Form.useForm>[0];
}

const StepDetails = ({ form }: StepDetailsProps) => (
    <Form
        form={form}
        layout="vertical"
        initialValues={{
            issuedDate: dayjs(),
            supplyDate: dayjs(),
            dueDate: dayjs().add(30, 'day'),
            paymentTerms: 'Net 30',
            currency: 'AED',
        }}
    >
        <Row gutter={16}>
            <Col xs={24} md={12}>
                <Form.Item name="documentNumber" label="Invoice number">
                    <Input size="large" placeholder="Auto-generated from sequence" />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item name="issuedDate" label="Issue date">
                    <DatePicker style={{ width: '100%' }} size="large" />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item name="supplyDate" label="Supply date">
                    <DatePicker style={{ width: '100%' }} size="large" />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item name="dueDate" label="Due date">
                    <DatePicker style={{ width: '100%' }} size="large" />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item name="currency" label="Currency">
                    <Select
                        size="large"
                        options={[
                            { value: 'AED', label: 'AED — UAE Dirham' },
                            { value: 'USD', label: 'USD — US Dollar' },
                            { value: 'EUR', label: 'EUR — Euro' },
                        ]}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item name="branchId" label="Branch (optional)">
                    <Select
                        size="large"
                        allowClear
                        placeholder="Default branch"
                        options={BRANCH_OPTIONS}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item name="paymentTerms" label="Payment terms">
                    <Input size="large" />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item name="buyerReference" label="PO / buyer reference (optional)">
                    <Input size="large" placeholder="e.g. PO-2026-0042" />
                </Form.Item>
            </Col>
            <Col xs={24}>
                <Form.Item name="notes" label="Notes (optional)">
                    <Input.TextArea
                        rows={3}
                        maxLength={1000}
                        showCount
                        placeholder="Any notes or instructions for the customer..."
                    />
                </Form.Item>
            </Col>
        </Row>
    </Form>
);

/* ─── Step 4: Review ─────────────────────────────────────────────────────────── */

interface StepReviewProps {
    customerForm: ReturnType<typeof Form.useForm>[0];
    detailsForm: ReturnType<typeof Form.useForm>[0];
    partyMode: 'b2b' | 'b2c';
    lines: LineItem[];
    forceStatus: 'PASS' | 'WARNING' | 'ERROR' | 'PENDING';
    onForceStatusChange: (s: 'PASS' | 'WARNING' | 'ERROR' | 'PENDING') => void;
    onEditStep: (step: number) => void;
}

const StepReview = ({
    customerForm,
    detailsForm,
    partyMode,
    lines,
    forceStatus,
    onForceStatusChange,
    onEditStep,
}: StepReviewProps) => {
    const cv = customerForm.getFieldsValue() as CustomerFormValues;
    const dv = detailsForm.getFieldsValue() as DetailsFormValues;
    const currency = dv.currency ?? 'AED';

    const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
    const tax = lines.reduce(
        (s, l) => s + l.quantity * l.unitPrice * (Math.max(l.taxRate, 0) / 100),
        0,
    );
    const grandTotal = subtotal + tax;

    const SectionEdit = ({ step }: { step: number }) => (
        <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEditStep(step)}
            style={{ color: '#888', fontSize: 12 }}
        >
            Edit
        </Button>
    );

    const addressParts = [cv.city, cv.emirate, cv.country].filter(Boolean);

    return (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {/* Customer */}
            <Card
                title={
                    <Flex justify="space-between" align="center">
                        <Text strong style={{ fontSize: 13 }}>Customer</Text>
                        <SectionEdit step={0} />
                    </Flex>
                }
                style={{ border: '1px solid #E8E8E8' }}
            >
                <Flex align="center" gap={14}>
                    <Avatar
                        size={42}
                        style={{ background: '#FF3A3A', fontWeight: 700, fontSize: 17, flexShrink: 0 }}
                    >
                        {(cv.customerName || 'C').charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                        <Text strong style={{ display: 'block', fontSize: 15 }}>
                            {cv.customerName || '—'}
                        </Text>
                        {partyMode === 'b2b' && cv.customerTrn && (
                            <Text
                                type="secondary"
                                style={{ fontFamily: 'monospace', fontSize: 12, display: 'block' }}
                            >
                                TRN: {cv.customerTrn}
                            </Text>
                        )}
                        {cv.customerEmail && (
                            <Text style={{ fontSize: 13, color: '#FF3A3A', display: 'block' }}>
                                {cv.customerEmail}
                            </Text>
                        )}
                        {addressParts.length > 0 && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {addressParts.join(', ')}
                            </Text>
                        )}
                    </div>
                </Flex>
            </Card>

            {/* Line items */}
            <Card
                title={
                    <Flex justify="space-between" align="center">
                        <Text strong style={{ fontSize: 13 }}>
                            Line items ({lines.length})
                        </Text>
                        <SectionEdit step={1} />
                    </Flex>
                }
                style={{ border: '1px solid #E8E8E8' }}
                styles={{ body: { padding: 0 } }}
            >
                {lines.map((line, i) => {
                    const total =
                        line.quantity * line.unitPrice * (1 + Math.max(line.taxRate, 0) / 100);
                    return (
                        <div
                            key={i}
                            style={{
                                padding: '11px 20px',
                                borderBottom: i < lines.length - 1 ? '1px solid #F3F3F3' : 'none',
                            }}
                        >
                            <Flex justify="space-between" align="center" gap={12}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <Text
                                        strong
                                        style={{
                                            display: 'block',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {line.description || '(no description)'}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {line.quantity} × {formatAed(line.unitPrice, currency)} ·{' '}
                                        {TAX_LABEL[String(line.taxRate)] ?? `${line.taxRate}%`}
                                    </Text>
                                </div>
                                <Text
                                    strong
                                    style={{ fontFamily: 'monospace', fontSize: 14, flexShrink: 0 }}
                                >
                                    {formatAed(total, currency)}
                                </Text>
                            </Flex>
                        </div>
                    );
                })}
            </Card>

            {/* Invoice details */}
            <Card
                title={
                    <Flex justify="space-between" align="center">
                        <Text strong style={{ fontSize: 13 }}>Invoice details</Text>
                        <SectionEdit step={2} />
                    </Flex>
                }
                style={{ border: '1px solid #E8E8E8' }}
            >
                <Row gutter={[16, 10]}>
                    <Col xs={12}>
                        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>
                            Invoice number
                        </Text>
                        <Text>{dv.documentNumber || 'Auto-generated'}</Text>
                    </Col>
                    <Col xs={12}>
                        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>
                            Currency
                        </Text>
                        <Text>{currency}</Text>
                    </Col>
                    <Col xs={12}>
                        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>
                            Issue date
                        </Text>
                        <Text>{dv.issuedDate?.format?.('D MMM YYYY') ?? '—'}</Text>
                    </Col>
                    <Col xs={12}>
                        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>
                            Due date
                        </Text>
                        <Text>{dv.dueDate?.format?.('D MMM YYYY') ?? '—'}</Text>
                    </Col>
                    {dv.paymentTerms && (
                        <Col xs={12}>
                            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>
                                Payment terms
                            </Text>
                            <Text>{dv.paymentTerms}</Text>
                        </Col>
                    )}
                    {dv.buyerReference && (
                        <Col xs={12}>
                            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>
                                PO reference
                            </Text>
                            <Text>{dv.buyerReference}</Text>
                        </Col>
                    )}
                    {dv.branchId && (
                        <Col xs={12}>
                            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>
                                Branch
                            </Text>
                            <Text>
                                {BRANCH_OPTIONS.find(b => b.value === dv.branchId)?.label ?? dv.branchId}
                            </Text>
                        </Col>
                    )}
                </Row>
            </Card>

            {/* Totals breakdown */}
            <Card
                style={{ border: '1px solid #E8E8E8', background: '#FAFAFA' }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size={10}>
                    <Flex justify="space-between">
                        <Text type="secondary">Subtotal</Text>
                        <Text style={{ fontFamily: 'monospace' }}>{formatAed(subtotal, currency)}</Text>
                    </Flex>
                    <Flex justify="space-between">
                        <Text type="secondary">Total VAT</Text>
                        <Text style={{ fontFamily: 'monospace' }}>{formatAed(tax, currency)}</Text>
                    </Flex>
                    <Divider style={{ margin: '6px 0' }} />
                    <Flex justify="space-between" align="center">
                        <Text strong style={{ fontSize: 16 }}>Grand Total</Text>
                        <Text strong style={{ fontFamily: 'monospace', fontSize: 22 }}>
                            {formatAed(grandTotal, currency)}
                        </Text>
                    </Flex>
                </Space>
            </Card>

            {/* Demo clearance simulator */}
            <Card
                style={{
                    border: '1px dashed #D0D0D0',
                    background: '#F9F9F9',
                }}
                styles={{ body: { padding: '12px 16px' } }}
            >
                <Flex align="center" gap={12} wrap="wrap">
                    <Flex align="center" gap={6}>
                        <ExperimentOutlined style={{ color: '#AAAAAA', fontSize: 14 }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Demo: simulate clearance result
                        </Text>
                    </Flex>
                    <Radio.Group
                        value={forceStatus}
                        onChange={e => onForceStatusChange(e.target.value)}
                        size="small"
                    >
                        <Radio.Button value="PASS">Cleared</Radio.Button>
                        <Radio.Button value="WARNING">Warning</Radio.Button>
                        <Radio.Button value="ERROR">Rejected</Radio.Button>
                        <Radio.Button value="PENDING">Pending</Radio.Button>
                    </Radio.Group>
                </Flex>
            </Card>
        </Space>
    );
};

/* ─── Main Wizard ────────────────────────────────────────────────────────────── */

const CreateSalesInvoiceWizard = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [customerForm] = Form.useForm();
    const [detailsForm] = Form.useForm();

    const [partyMode, setPartyMode] = useState<'b2b' | 'b2c'>('b2b');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const [lines, setLines] = useState<LineItem[]>([blankLine()]);
    const [lineErrors, setLineErrors] = useState<boolean[]>([false]);

    const [submitting, setSubmitting] = useState(false);
    const [clearanceOpen, setClearanceOpen] = useState(false);
    const [sendOpen, setSendOpen] = useState(false);
    const [resultDoc, setResultDoc] = useState<EInvoiceDocument | undefined>();
    const [forceStatus, setForceStatus] = useState<'PASS' | 'WARNING' | 'ERROR' | 'PENDING'>('PASS');

    const currency = Form.useWatch('currency', detailsForm) ?? 'AED';

    const subtotal = useMemo(
        () => lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0),
        [lines],
    );
    const tax = useMemo(
        () =>
            lines.reduce(
                (s, l) => s + l.quantity * l.unitPrice * (Math.max(l.taxRate, 0) / 100),
                0,
            ),
        [lines],
    );
    const grandTotal = subtotal + tax;

    useEffect(() => {
        eInvoicingApi.getCustomers().then(setCustomers);
    }, []);

    const handleNext = async () => {
        if (current === 0) {
            try {
                await customerForm.validateFields();
                setCurrent(1);
            } catch {
                // antd surfaces field errors inline
            }
        } else if (current === 1) {
            const errs = lines.map(l => !l.description.trim());
            setLineErrors(errs);
            if (!errs.some(Boolean)) setCurrent(2);
        } else if (current === 2) {
            setCurrent(3);
        }
    };

    const handleBack = () => {
        if (current > 0) setCurrent(current - 1);
    };

    const buildPayload = () => {
        const cv = customerForm.getFieldsValue() as CustomerFormValues;
        const dv = detailsForm.getFieldsValue() as DetailsFormValues;

        const customer: Customer = {
            id: cv.customerId ?? `inline_${Date.now()}`,
            type: partyMode === 'b2c' ? 'individual' : 'business',
            name: cv.customerName ?? '',
            trn: partyMode === 'b2b' ? cv.customerTrn : undefined,
            email: cv.customerEmail,
            address: {
                buildingNumber: cv.buildingNumber ?? '',
                street: cv.street ?? '',
                district: cv.district ?? '',
                city: cv.city ?? '',
                emirate: cv.emirate ?? '',
                country: cv.country ?? 'AE',
            },
        };

        const sub = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
        const vat = lines.reduce(
            (s, l) => s + l.quantity * l.unitPrice * (Math.max(l.taxRate, 0) / 100),
            0,
        );

        return {
            documentNumber:
                dv.documentNumber ||
                `INV-${dayjs().format('YYYY')}-${Math.floor(Math.random() * 9000 + 1000)}`,
            documentTypeCode: '380' as const,
            issuedDate: (dv.issuedDate ?? dayjs()).format('YYYY-MM-DD'),
            supplyDate: (dv.supplyDate ?? dayjs()).format('YYYY-MM-DD'),
            dueDate: (dv.dueDate ?? dayjs().add(30, 'day')).format('YYYY-MM-DD'),
            customer,
            lineItems: lines,
            totals: { subtotal: sub, tax: vat, grandTotal: sub + vat, currency: dv.currency ?? 'AED' },
            branchId: dv.branchId,
            notes: dv.notes,
            paymentTerms: dv.paymentTerms,
            buyerReference: dv.buyerReference,
        };
    };

    const handleIssue = async () => {
        setClearanceOpen(true);
        setSubmitting(true);
        setResultDoc(undefined);
        try {
            const payload = buildPayload();
            const doc = await eInvoicingApi.submitInvoice({
                forceStatus,
                documentTypeCode: payload.documentTypeCode,
                documentNumber: payload.documentNumber,
                customer: payload.customer,
                lineItems: payload.lineItems,
                totals: payload.totals,
            });
            setResultDoc(doc);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDraft = async () => {
        const payload = buildPayload();
        try {
            const doc = await eInvoicingApi.saveDraft({
                documentTypeCode: payload.documentTypeCode,
                documentNumber: payload.documentNumber,
                customer: payload.customer,
                lineItems: payload.lineItems,
                totals: payload.totals,
            });
            message.success('Draft saved');
            navigate(
                `${paths.dashboard.einvoicing}/${paths.einvoicing.salesInvoices}/${doc.documentId}`,
            );
        } catch {
            message.error('Failed to save draft');
        }
    };

    return (
        <div style={{ paddingBottom: 88 }}>
            {/* Page header */}
            <div style={{ marginBottom: 28 }}>
                <Title level={3} style={{ margin: 0 }}>
                    Create sales invoice
                </Title>
                <Text type="secondary">
                    Issue a ZATCA-compliant tax invoice for FTA clearance
                </Text>
            </div>

            {/* Steps progress */}
            <Card style={{ marginBottom: 28, border: '1px solid #EBEBEB' }}>
                <Steps
                    current={current}
                    responsive={false}
                    items={WIZARD_STEPS.map((s, i) => ({
                        title: s.title,
                        status:
                            i < current ? 'finish' : i === current ? 'process' : 'wait',
                    }))}
                />
            </Card>

            {/* Step context hint */}
            <div
                style={{
                    marginBottom: 24,
                    padding: '10px 16px',
                    background: '#FFFBF0',
                    border: '1px solid #FFE58F',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                }}
            >
                <Text style={{ fontSize: 12, color: '#7D5A00' }}>
                    <strong>Step {current + 1} of 4 — {WIZARD_STEPS[current].title}:</strong>{' '}
                    {STEP_SUBTITLES[current]}
                </Text>
            </div>

            {/* Two-column layout: content + totals sidebar */}
            <Row gutter={24} align="top">
                <Col xs={24} lg={16}>
                    {current === 0 && (
                        <StepCustomer
                            form={customerForm}
                            partyMode={partyMode}
                            onPartyModeChange={setPartyMode}
                            customers={customers}
                            selectedCustomer={selectedCustomer}
                            onSelectCustomer={setSelectedCustomer}
                        />
                    )}
                    {current === 1 && (
                        <StepLineItems
                            lines={lines}
                            errors={lineErrors}
                            onChange={setLines}
                            onErrorsChange={setLineErrors}
                        />
                    )}
                    {current === 2 && <StepDetails form={detailsForm} />}
                    {current === 3 && (
                        <StepReview
                            customerForm={customerForm}
                            detailsForm={detailsForm}
                            partyMode={partyMode}
                            lines={lines}
                            forceStatus={forceStatus}
                            onForceStatusChange={setForceStatus}
                            onEditStep={setCurrent}
                        />
                    )}
                </Col>

                {/* Desktop sidebar */}
                <Col xs={0} lg={8}>
                    <div style={{ position: 'sticky', top: 24 }}>
                        <TotalsPanel lines={lines} currency={currency} muted={current === 0} />
                    </div>
                </Col>
            </Row>

            {/* Mobile totals strip (hidden on lg+) */}
            <div
                className="lg:hidden"
                style={{
                    marginTop: 20,
                    padding: '12px 16px',
                    background: '#FAFAFA',
                    border: '1px solid #EBEBEB',
                    borderRadius: 4,
                    opacity: current === 0 ? 0.45 : 1,
                    transition: 'opacity 0.25s',
                }}
            >
                <Flex justify="space-between" align="center">
                    <Flex gap={20}>
                        <div>
                            <Text type="secondary" style={{ fontSize: 11 }}>Subtotal</Text>
                            <Text style={{ display: 'block', fontFamily: 'monospace', fontSize: 13 }}>
                                {formatAed(subtotal, currency)}
                            </Text>
                        </div>
                        <div>
                            <Text type="secondary" style={{ fontSize: 11 }}>VAT</Text>
                            <Text style={{ display: 'block', fontFamily: 'monospace', fontSize: 13 }}>
                                {formatAed(tax, currency)}
                            </Text>
                        </div>
                    </Flex>
                    <div style={{ textAlign: 'right' }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>Grand Total</Text>
                        <Text
                            strong
                            style={{ display: 'block', fontFamily: 'monospace', fontSize: 16 }}
                        >
                            {formatAed(grandTotal, currency)}
                        </Text>
                    </div>
                </Flex>
            </div>

            {/* Sticky bottom navigation */}
            <div
                style={{
                    position: 'sticky',
                    bottom: 0,
                    background: '#FFFFFF',
                    borderTop: '1px solid #E8E8E8',
                    padding: '14px 0',
                    marginTop: 24,
                    zIndex: 10,
                }}
            >
                <Flex justify="space-between" align="center">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        disabled={current === 0}
                        onClick={handleBack}
                        size="large"
                    >
                        Back
                    </Button>

                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Step {current + 1} of 4
                    </Text>

                    {current < 3 ? (
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleNext}
                        >
                            Next <ArrowRightOutlined />
                        </Button>
                    ) : (
                        <Space>
                            <Button size="large" onClick={handleDraft}>
                                Save as Draft
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleIssue}
                            >
                                Issue Invoice <ArrowRightOutlined />
                            </Button>
                        </Space>
                    )}
                </Flex>
            </div>

            {/* Clearance + send modals */}
            <ClearanceModal
                open={clearanceOpen}
                document={resultDoc}
                submitting={submitting}
                onClose={() => {
                    setClearanceOpen(false);
                    if (resultDoc) {
                        navigate(
                            `${paths.dashboard.einvoicing}/${paths.einvoicing.salesInvoices}/${resultDoc.documentId}`,
                        );
                    }
                }}
                onSend={() => {
                    setClearanceOpen(false);
                    setSendOpen(true);
                }}
                onEdit={() => setClearanceOpen(false)}
            />

            <SendInvoiceModal
                open={sendOpen}
                document={resultDoc}
                onClose={() => setSendOpen(false)}
                onSent={() => {
                    message.success('Invoice sent to customer');
                    if (resultDoc) {
                        navigate(
                            `${paths.dashboard.einvoicing}/${paths.einvoicing.salesInvoices}/${resultDoc.documentId}`,
                        );
                    }
                }}
            />
        </div>
    );
};

export default CreateSalesInvoiceWizard;
