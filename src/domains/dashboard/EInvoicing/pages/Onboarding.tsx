import { useState } from 'react';

import {
    AuditOutlined,
    BankOutlined,
    CheckCircleFilled,
    EnvironmentOutlined,
    ExportOutlined,
    LoadingOutlined,
    QuestionCircleOutlined,
    SettingOutlined,
    ShopOutlined,
} from '@ant-design/icons';
import {
    Button,
    Card,
    Checkbox,
    Col,
    Descriptions,
    Divider,
    Flex,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Space,
    Steps,
    Switch,
    Tooltip,
    Typography,
    Upload,
    message,
} from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { eInvoicingApi } from '../api';
import TrnInput from '../components/TrnInput';
import {
    patchOnboardingDraft,
    provisionSucceeded,
    setOnboardingStep,
} from '../slices/eInvoicingSlice';

const EMIRATES = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];
const ACTIVITY_CODES = [
    { value: '4690', label: '4690 — General trading' },
    { value: '6201', label: '6201 — Software / IT services' },
    { value: '4711', label: '4711 — Retail (food)' },
    { value: '5610', label: '5610 — Restaurants' },
    { value: '7020', label: '7020 — Management consulting' },
];

const provisionSteps = [
    'Creating your e-invoicing account',
    'Generating secure credentials',
    'Setting up business profile',
    'Configuring branches',
    'Connecting status updates',
];

const STEPS_META = [
    {
        title: 'Business',
        icon: <ShopOutlined />,
        heading: 'Business details',
        description: 'This information will appear on your invoices and is submitted to the FTA.',
    },
    {
        title: 'EmaraTax',
        icon: <AuditOutlined />,
        heading: 'EmaraTax portal setup',
        description: 'You must be registered on EmaraTax and have Marmin set as your ASP before activating.',
    },
    {
        title: 'Address',
        icon: <EnvironmentOutlined />,
        heading: 'Registered business address',
        description: 'Must match the address on your FTA registration for your TRN.',
    },
    {
        title: 'Branches',
        icon: <BankOutlined />,
        heading: 'Branch setup',
        description: 'Add branches that issue invoices independently. You can add more from settings later.',
    },
    {
        title: 'Defaults',
        icon: <SettingOutlined />,
        heading: 'Invoice defaults',
        description: 'Set preferred defaults for new invoices. All of these can be changed at any time.',
    },
    {
        title: 'Review',
        icon: <CheckCircleFilled />,
        heading: 'Review & confirm',
        description: 'Check these details carefully — they will be submitted to the FTA.',
    },
];

const SectionHeader = ({ step }: { step: number }) => {
    const meta = STEPS_META[step - 1];
    return (
        <div style={{ marginBottom: 20 }}>
            <Flex align="center" justify="space-between">
                <div>
                    <Typography.Title level={4} style={{ margin: 0, marginBottom: 2 }}>
                        {meta.heading}
                    </Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        {meta.description}
                    </Typography.Text>
                </div>
                <Typography.Text type="secondary" style={{ fontSize: 12, flexShrink: 0, marginLeft: 16 }}>
                    {step} / {STEPS_META.length}
                </Typography.Text>
            </Flex>
            <Divider style={{ margin: '14px 0 0' }} />
        </div>
    );
};

const Onboarding = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const draft = useAppSelector(s => s.reducer.eInvoicing.onboardingDraft) as Record<string, any>;
    const step = useAppSelector(s => s.reducer.eInvoicing.onboardingStep);

    const [form] = Form.useForm();
    const [provisioning, setProvisioning] = useState(false);
    const [provisionStep, setProvisionStep] = useState(0);
    const [confirmAccurate, setConfirmAccurate] = useState(false);
    const [confirmAuthorise, setConfirmAuthorise] = useState(false);
    const [hasBranches, setHasBranches] = useState(false);
    const [branches, setBranches] = useState<any[]>([]);
    const [emaraTaxStatus, setEmaraTaxStatus] = useState<'registered' | 'not_registered' | null>(null);
    const [confirmedAspChanged, setConfirmedAspChanged] = useState(false);

    const next = async () => {
        if (step === 2) {
            dispatch(setOnboardingStep(step + 1));
            return;
        }
        try {
            const values = await form.validateFields();
            dispatch(patchOnboardingDraft(values));
            dispatch(setOnboardingStep(step + 1));
            form.resetFields();
        } catch {
            // antd surfaces field errors automatically
        }
    };

    const back = () => dispatch(setOnboardingStep(Math.max(1, step - 1)));

    const submit = async () => {
        setProvisioning(true);
        let idx = 0;
        const interval = setInterval(() => {
            idx += 1;
            setProvisionStep(idx);
            if (idx >= provisionSteps.length) clearInterval(interval);
        }, 320);

        try {
            const result = await eInvoicingApi.provision({ ...draft, branches });
            dispatch(provisionSucceeded(result));
            setProvisionStep(provisionSteps.length);
            setTimeout(() => {
                setProvisioning(false);
                navigate(paths.dashboard.einvoicing);
            }, 600);
        } catch {
            clearInterval(interval);
            setProvisioning(false);
            message.error("We couldn't finalise setup. Please try again.");
        }
    };

    return (
        <div style={{ maxWidth: '100%' }}>
            <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
                Set up E-Invoicing
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 28 }}>
                Complete all steps to activate your FTA-compliant e-invoicing account.
            </Typography.Text>

            <Steps
                current={step - 1}
                size="small"
                style={{ marginBottom: 28, padding: '16px 20px', background: '#F9FAFB', borderRadius: 10, border: '1px solid #E5E7EB' }}
                items={STEPS_META.map(m => ({ title: m.title, icon: m.icon }))}
            />

            {/* ── Step 1: Business details ───────────────────────────── */}
            {step === 1 && (
                <Card style={{ borderRadius: 12 }}>
                    <SectionHeader step={1} />
                    <Form form={form} layout="vertical" initialValues={draft}>
                        <Row gutter={[16, 8]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="legalName"
                                    label="Legal name"
                                    rules={[{ required: true, max: 200 }]}
                                >
                                    <Input placeholder="Sahara Trading L.L.C." />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="activityCode"
                                    label="Business activity code"
                                    rules={[{ required: true }]}
                                >
                                    <Select options={ACTIVITY_CODES} placeholder="Select activity" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="tradeLicense"
                                    label="Trade license number"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="CN-1184223" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="trn"
                                    label={
                                        <Flex align="center" gap={6}>
                                            Tax Registration Number (TRN)
                                            <Tooltip title="Your 15-digit TRN issued by the FTA. Don't have one? Apply via Peko's in-house registration.">
                                                <QuestionCircleOutlined style={{ color: '#9CA3AF' }} />
                                            </Tooltip>
                                        </Flex>
                                    }
                                    rules={[
                                        { required: true, message: 'TRN is required' },
                                        { pattern: /^\d{15}$/, message: 'TRN must be exactly 15 digits' },
                                    ]}
                                    extra={
                                        <Typography.Link
                                            onClick={() => navigate(`${paths.dashboard.accounting}/${paths.accounting.taxRegistration}`)}
                                            style={{ fontSize: 12, cursor: 'pointer' }}
                                        >
                                            Don't have a TRN? Apply now →
                                        </Typography.Link>
                                    }
                                    style={{ marginBottom: 0 }}
                                >
                                    <TrnInput />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item
                                    name="vatStatus"
                                    label={
                                        <Flex align="center" gap={6}>
                                            VAT registration status
                                            <Tooltip title="Not VAT registered? Apply via Peko or select Exempt if applicable.">
                                                <QuestionCircleOutlined style={{ color: '#9CA3AF' }} />
                                            </Tooltip>
                                        </Flex>
                                    }
                                    rules={[{ required: true }]}
                                    extra={
                                        <Typography.Link
                                            onClick={() => navigate(`${paths.dashboard.accounting}/${paths.accounting.vatRegistration}`)}
                                            style={{ fontSize: 12, cursor: 'pointer' }}
                                        >
                                            Not VAT registered? Apply now →
                                        </Typography.Link>
                                    }
                                >
                                    <Select
                                        placeholder="Select VAT status"
                                        options={[
                                            { value: 'STANDARD', label: 'Standard (5%)' },
                                            { value: 'ZERO', label: 'Zero-rated' },
                                            { value: 'EXEMPT', label: 'Exempt' },
                                            { value: 'MIXED', label: 'Mixed' },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            )}

            {/* ── Step 2: EmaraTax Portal ───────────────────────────── */}
            {step === 2 && (
                <Card style={{ borderRadius: 12 }}>
                    <SectionHeader step={2} />

                    <Typography.Text strong style={{ display: 'block', marginBottom: 12, fontSize: 14 }}>
                        Are you registered on the EmaraTax portal?
                    </Typography.Text>
                    <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
                        <Col xs={24} md={12}>
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => setEmaraTaxStatus('registered')}
                                onKeyDown={e => e.key === 'Enter' && setEmaraTaxStatus('registered')}
                                style={{
                                    borderRadius: 8,
                                    border: emaraTaxStatus === 'registered' ? '2px solid #2563EB' : '1px solid #E5E7EB',
                                    padding: '14px 16px',
                                    cursor: 'pointer',
                                    background: emaraTaxStatus === 'registered' ? '#EFF6FF' : '#FAFAFA',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <Flex align="center" gap={12}>
                                    <CheckCircleFilled
                                        style={{
                                            color: emaraTaxStatus === 'registered' ? '#2563EB' : '#D1D5DB',
                                            fontSize: 20,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <div>
                                        <Typography.Text strong style={{ display: 'block' }}>
                                            Already registered
                                        </Typography.Text>
                                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                            I have an EmaraTax portal account
                                        </Typography.Text>
                                    </div>
                                </Flex>
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => setEmaraTaxStatus('not_registered')}
                                onKeyDown={e => e.key === 'Enter' && setEmaraTaxStatus('not_registered')}
                                style={{
                                    borderRadius: 8,
                                    border: emaraTaxStatus === 'not_registered' ? '2px solid #2563EB' : '1px solid #E5E7EB',
                                    padding: '14px 16px',
                                    cursor: 'pointer',
                                    background: emaraTaxStatus === 'not_registered' ? '#EFF6FF' : '#FAFAFA',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <Flex align="center" gap={12}>
                                    <AuditOutlined
                                        style={{
                                            color: emaraTaxStatus === 'not_registered' ? '#2563EB' : '#D1D5DB',
                                            fontSize: 20,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <div>
                                        <Typography.Text strong style={{ display: 'block' }}>
                                            Not yet registered
                                        </Typography.Text>
                                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                            I need to create an EmaraTax account
                                        </Typography.Text>
                                    </div>
                                </Flex>
                            </div>
                        </Col>
                    </Row>

                    {emaraTaxStatus === 'registered' && (
                        <div
                            style={{
                                background: '#F0F9FF',
                                border: '1px solid #BAE6FD',
                                borderRadius: 8,
                                padding: '16px 20px',
                                marginBottom: 16,
                            }}
                        >
                            <Typography.Text strong style={{ display: 'block', marginBottom: 12, color: '#0369A1' }}>
                                Change your ASP to Marmin
                            </Typography.Text>
                            <Space direction="vertical" size={8} style={{ width: '100%', marginBottom: 14 }}>
                                {[
                                    'Log in to the EmaraTax portal using the link below.',
                                    'Navigate to My Profile → Linked Service Providers.',
                                    'Click Change ASP and select Marmin from the list.',
                                    'Confirm the change — it takes effect immediately.',
                                ].map((text, i) => (
                                    <Flex key={i} gap={10} align="flex-start">
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                background: '#0EA5E9',
                                                color: '#fff',
                                                fontSize: 11,
                                                fontWeight: 600,
                                                flexShrink: 0,
                                                marginTop: 1,
                                            }}
                                        >
                                            {i + 1}
                                        </span>
                                        <Typography.Text style={{ fontSize: 13, color: '#0C4A6E' }}>{text}</Typography.Text>
                                    </Flex>
                                ))}
                            </Space>
                            <Typography.Link
                                href="https://eservices.tax.gov.ae"
                                target="_blank"
                                style={{ fontSize: 13, fontWeight: 500 }}
                            >
                                Open EmaraTax portal <ExportOutlined style={{ fontSize: 11 }} />
                            </Typography.Link>
                        </div>
                    )}

                    {emaraTaxStatus === 'not_registered' && (
                        <div
                            style={{
                                background: '#F0F9FF',
                                border: '1px solid #BAE6FD',
                                borderRadius: 8,
                                padding: '16px 20px',
                                marginBottom: 16,
                            }}
                        >
                            <Typography.Text strong style={{ display: 'block', marginBottom: 12, color: '#0369A1' }}>
                                Register and select Marmin as your ASP
                            </Typography.Text>
                            <Space direction="vertical" size={8} style={{ width: '100%', marginBottom: 14 }}>
                                {[
                                    'Open the EmaraTax portal using the link below.',
                                    'Click Register and complete the business registration using your TRN.',
                                    'On the ASP (Accredited Service Provider) selection step, choose Marmin.',
                                    'Finish registration and verify your account.',
                                ].map((text, i) => (
                                    <Flex key={i} gap={10} align="flex-start">
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                background: '#0EA5E9',
                                                color: '#fff',
                                                fontSize: 11,
                                                fontWeight: 600,
                                                flexShrink: 0,
                                                marginTop: 1,
                                            }}
                                        >
                                            {i + 1}
                                        </span>
                                        <Typography.Text style={{ fontSize: 13, color: '#0C4A6E' }}>{text}</Typography.Text>
                                    </Flex>
                                ))}
                            </Space>
                            <Typography.Link
                                href="https://eservices.tax.gov.ae"
                                target="_blank"
                                style={{ fontSize: 13, fontWeight: 500 }}
                            >
                                Open EmaraTax portal <ExportOutlined style={{ fontSize: 11 }} />
                            </Typography.Link>
                        </div>
                    )}

                    {emaraTaxStatus && (
                        <div
                            style={{
                                background: '#F9FAFB',
                                border: '1px solid #E5E7EB',
                                borderRadius: 8,
                                padding: '14px 16px',
                            }}
                        >
                            <Checkbox
                                checked={confirmedAspChanged}
                                onChange={e => setConfirmedAspChanged(e.target.checked)}
                            >
                                <Typography.Text style={{ fontSize: 13 }}>
                                    I confirm I have set Marmin as my ASP on the EmaraTax portal.
                                </Typography.Text>
                            </Checkbox>
                        </div>
                    )}
                </Card>
            )}

            {/* ── Step 3: Address ────────────────────────────────────── */}
            {step === 3 && (
                <Card style={{ borderRadius: 12 }}>
                    <SectionHeader step={3} />
                    <Form form={form} layout="vertical" initialValues={draft}>
                        <Row gutter={[16, 8]}>
                            <Col xs={24} md={5}>
                                <Form.Item name="buildingNumber" label="Building no." rules={[{ required: true }]}>
                                    <Input placeholder="102" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={19}>
                                <Form.Item name="street" label="Street" rules={[{ required: true }]}>
                                    <Input placeholder="Sheikh Zayed Road" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="district" label="District" rules={[{ required: true }]}>
                                    <Input placeholder="Business Bay" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="city" label="City" rules={[{ required: true }]}>
                                    <Input placeholder="Dubai" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="emirate" label="Emirate" rules={[{ required: true }]}>
                                    <Select
                                        placeholder="Select emirate"
                                        options={EMIRATES.map(e => ({ value: e, label: e }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="postalCode" label="Postal code">
                                    <Input placeholder="00000" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Country">
                                    <Input value="United Arab Emirates" disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            )}

            {/* ── Step 4: Branches ───────────────────────────────────── */}
            {step === 4 && (
                <Card style={{ borderRadius: 12 }}>
                    <SectionHeader step={4} />
                    <Flex
                        align="center"
                        justify="space-between"
                        style={{
                            marginBottom: 16,
                            padding: '12px 16px',
                            background: '#F9FAFB',
                            borderRadius: 8,
                            border: '1px solid #E5E7EB',
                        }}
                    >
                        <div>
                            <Typography.Text strong style={{ display: 'block', lineHeight: '20px' }}>
                                I have multiple branches
                            </Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                Each branch gets its own invoice sequence and prefix.
                            </Typography.Text>
                        </div>
                        <Switch checked={hasBranches} onChange={setHasBranches} />
                    </Flex>

                    {hasBranches ? (
                        <Space direction="vertical" size={10} style={{ width: '100%' }}>
                            {branches.map((b, i) => (
                                <Card
                                    key={i}
                                    size="small"
                                    type="inner"
                                    title={
                                        <Typography.Text strong style={{ fontSize: 13 }}>
                                            Branch {i + 1}
                                        </Typography.Text>
                                    }
                                    style={{ borderRadius: 8 }}
                                >
                                    <Row gutter={[16, 8]}>
                                        <Col xs={24} md={8}>
                                            <Typography.Text style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                                                Name
                                            </Typography.Text>
                                            <Input
                                                placeholder="e.g. Dubai Marina"
                                                value={b.name}
                                                onChange={e => {
                                                    const copy = [...branches];
                                                    copy[i].name = e.target.value;
                                                    setBranches(copy);
                                                }}
                                            />
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Typography.Text style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                                                Code
                                            </Typography.Text>
                                            <Input
                                                placeholder="e.g. DXB"
                                                value={b.code}
                                                onChange={e => {
                                                    const copy = [...branches];
                                                    copy[i].code = e.target.value.toUpperCase();
                                                    setBranches(copy);
                                                }}
                                            />
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Typography.Text style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                                                Invoice prefix
                                            </Typography.Text>
                                            <Input
                                                placeholder="e.g. INV-"
                                                value={b.prefix}
                                                onChange={e => {
                                                    const copy = [...branches];
                                                    copy[i].prefix = e.target.value;
                                                    setBranches(copy);
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                            <Button
                                type="dashed"
                                style={{ width: '100%' }}
                                onClick={() => setBranches(b => [...b, { name: '', code: '', prefix: 'INV-' }])}
                            >
                                + Add branch
                            </Button>
                        </Space>
                    ) : (
                        <Flex
                            align="center"
                            gap={10}
                            style={{
                                padding: '12px 16px',
                                background: '#F0FDF4',
                                borderRadius: 8,
                                border: '1px solid #BBF7D0',
                            }}
                        >
                            <CheckCircleFilled style={{ color: '#16A34A', fontSize: 14 }} />
                            <Typography.Text style={{ color: '#166534', fontSize: 13 }}>
                                Single location — you can add branches from settings later.
                            </Typography.Text>
                        </Flex>
                    )}
                </Card>
            )}

            {/* ── Step 5: Invoice defaults ───────────────────────────── */}
            {step === 5 && (
                <Card style={{ borderRadius: 12 }}>
                    <SectionHeader step={5} />
                    <Form form={form} layout="vertical" initialValues={draft}>
                        <Divider orientation="left" orientationMargin={0} style={{ marginTop: 0, marginBottom: 16, fontSize: 13 }}>
                            Invoice settings
                        </Divider>
                        <Row gutter={[16, 8]}>
                            <Col xs={24} md={8}>
                                <Form.Item name="defaultCurrency" label="Default currency" initialValue="AED">
                                    <Select
                                        options={[
                                            { value: 'AED', label: 'AED — UAE Dirham' },
                                            { value: 'USD', label: 'USD — US Dollar' },
                                            { value: 'EUR', label: 'EUR — Euro' },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="defaultTaxRate" label="Default tax rate" initialValue={5}>
                                    <Select
                                        options={[
                                            { value: 5, label: '5% (standard)' },
                                            { value: 0, label: '0% (zero-rated)' },
                                            { value: -1, label: 'Exempt' },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="invoiceFormat"
                                    label={
                                        <Flex align="center" gap={6}>
                                            Invoice number format
                                            <Tooltip title="Use {YYYY} for year, {MM} for month, {SEQ} for sequence number.">
                                                <QuestionCircleOutlined style={{ color: '#9CA3AF' }} />
                                            </Tooltip>
                                        </Flex>
                                    }
                                    initialValue="INV-{YYYY}-{SEQ}"
                                >
                                    <Input placeholder="INV-{YYYY}-{SEQ}" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="defaultPaymentTerms" label="Default payment terms (days)">
                                    <InputNumber style={{ width: '100%' }} min={0} max={120} placeholder="30" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={10}>
                                <Form.Item name="logo" label="Company logo" extra="PNG or JPG · max 1 MB">
                                    <Upload beforeUpload={() => false} maxCount={1} accept=".png,.jpg,.jpeg">
                                        <Button>Upload logo</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left" orientationMargin={0} style={{ marginBottom: 16, fontSize: 13 }}>
                            Bank details{' '}
                            <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
                                (shown on invoices)
                            </Typography.Text>
                        </Divider>
                        <Row gutter={[16, 8]}>
                            <Col xs={24} md={12}>
                                <Form.Item name="bankAccountHolder" label="Account holder name">
                                    <Input placeholder="Sahara Trading L.L.C." />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="bankIban"
                                    label="IBAN"
                                    rules={[
                                        {
                                            pattern: /^AE\d{21}$/,
                                            message: 'UAE IBAN: AE followed by 21 digits',
                                        },
                                    ]}
                                >
                                    <Input placeholder="AE070331234567890123456" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="bankSwift" label="SWIFT / BIC">
                                    <Input placeholder="NBADADXX" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            )}

            {/* ── Step 6: Review ─────────────────────────────────────── */}
            {step === 6 && (
                <Card style={{ borderRadius: 12 }}>
                    <SectionHeader step={6} />
                    <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
                        <Descriptions.Item label="Legal name">{draft.legalName ?? '—'}</Descriptions.Item>
                        <Descriptions.Item label="Trade license">{draft.tradeLicense ?? '—'}</Descriptions.Item>
                        <Descriptions.Item label="TRN">{draft.trn ?? '—'}</Descriptions.Item>
                        <Descriptions.Item label="Activity code">{draft.activityCode ?? '—'}</Descriptions.Item>
                        <Descriptions.Item label="VAT status">{draft.vatStatus ?? '—'}</Descriptions.Item>
                        <Descriptions.Item label="Default currency">{draft.defaultCurrency ?? 'AED'}</Descriptions.Item>
                        <Descriptions.Item label="Address" span={2}>
                            {[draft.buildingNumber, draft.street, draft.district, draft.city, draft.emirate]
                                .filter(Boolean)
                                .join(', ') || '—'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Branches">{branches.length || '1 (main)'}</Descriptions.Item>
                        <Descriptions.Item label="Payment terms">
                            {draft.defaultPaymentTerms ? `${draft.defaultPaymentTerms} days` : '—'}
                        </Descriptions.Item>
                    </Descriptions>

                    <div
                        style={{
                            background: '#F9FAFB',
                            border: '1px solid #E5E7EB',
                            borderRadius: 8,
                            padding: '16px 20px',
                        }}
                    >
                        <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>
                            Authorisation
                        </Typography.Text>
                        <Space direction="vertical" size={10}>
                            <Checkbox checked={confirmAccurate} onChange={e => setConfirmAccurate(e.target.checked)}>
                                <Typography.Text style={{ fontSize: 13 }}>
                                    I confirm these details are accurate and match my FTA registration.
                                </Typography.Text>
                            </Checkbox>
                            <Checkbox checked={confirmAuthorise} onChange={e => setConfirmAuthorise(e.target.checked)}>
                                <Typography.Text style={{ fontSize: 13 }}>
                                    I authorise Peko to submit and sign invoices to the FTA on my behalf.
                                </Typography.Text>
                            </Checkbox>
                        </Space>
                    </div>
                </Card>
            )}

            {/* ── Navigation ─────────────────────────────────────────── */}
            <Flex
                justify="space-between"
                align="center"
                style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: '1px solid #F3F4F6',
                }}
            >
                <Button size="large" disabled={step === 1} onClick={back}>
                    Back
                </Button>
                {step < 6 ? (
                    <Button
                        type="primary"
                        size="large"
                        disabled={step === 2 && !confirmedAspChanged}
                        onClick={next}
                    >
                        Continue
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        size="large"
                        disabled={!confirmAccurate || !confirmAuthorise}
                        onClick={submit}
                    >
                        Activate E-Invoicing
                    </Button>
                )}
            </Flex>

            {/* ── Provisioning modal ─────────────────────────────────── */}
            <Modal open={provisioning} closable={false} footer={null} centered width={420}>
                <div style={{ padding: '4px 0 8px' }}>
                    <Typography.Title level={4} style={{ marginBottom: 4 }}>
                        Setting up your account
                    </Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 24 }}>
                        This usually takes less than a minute.
                    </Typography.Text>
                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                        {provisionSteps.map((label, i) => (
                            <Flex key={label} gap={12} align="center">
                                {i < provisionStep ? (
                                    <CheckCircleFilled style={{ color: '#16A34A', fontSize: 16, flexShrink: 0 }} />
                                ) : i === provisionStep ? (
                                    <LoadingOutlined style={{ fontSize: 16, color: '#2563EB', flexShrink: 0 }} />
                                ) : (
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            background: '#E5E7EB',
                                            flexShrink: 0,
                                        }}
                                    />
                                )}
                                <Typography.Text
                                    style={{
                                        color: i < provisionStep ? '#111827' : i === provisionStep ? '#2563EB' : '#9CA3AF',
                                        fontWeight: i === provisionStep ? 500 : undefined,
                                    }}
                                >
                                    {label}
                                </Typography.Text>
                            </Flex>
                        ))}
                    </Space>
                </div>
            </Modal>
        </div>
    );
};

export default Onboarding;
