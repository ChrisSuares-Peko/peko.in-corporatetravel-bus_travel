import { useState } from 'react';

import {
    ArrowRightOutlined,
    CheckCircleFilled,
    CheckCircleOutlined,
    FileDoneOutlined,
    SafetyCertificateOutlined,
    WarningFilled,
} from '@ant-design/icons';
import { Alert, Button, Card, Flex, Radio, Switch, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { setEligibility } from '../slices/eInvoicingSlice';

type Yn = 'yes' | 'no';
type B2 = 'b2b' | 'b2c' | 'both';

interface Answers {
    vat?: Yn;
    trn?: Yn;
    invoiceMix?: B2;
}

const QUESTIONS = [
    {
        key: 'vat' as keyof Answers,
        label: 'Are you VAT-registered with the FTA?',
        required: true,
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
    },
    {
        key: 'trn' as keyof Answers,
        label: 'Do you have a Tax Registration Number (TRN)?',
        required: true,
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
    },
    {
        key: 'invoiceMix' as keyof Answers,
        label: 'What kind of invoices do you issue?',
        required: true,
        options: [
            { value: 'b2b', label: 'B2B' },
            { value: 'b2c', label: 'Mostly B2C' },
            { value: 'both', label: 'Both' },
        ],
    },
];

const EligibilityGate = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [a, setA] = useState<Answers>({});
    const [notify, setNotify] = useState(false);
    const base = paths.dashboard.einvoicing;

    const allAnswered = !!a.vat && !!a.trn && !!a.invoiceMix;
    const noTrn = a.trn === 'no';
    const noVat = a.vat === 'no';
    const canContinue = allAnswered && !noTrn;
    const answeredCount = [a.vat, a.trn, a.invoiceMix].filter(Boolean).length;

    const handleContinue = () => {
        dispatch(setEligibility({ passed: true, nonVat: noVat, notifyWhenReady: false }));
        navigate(`${base}/${paths.einvoicing.onboarding}`);
    };

    const goToTrnRegistration = () =>
        navigate(`${paths.dashboard.accounting}/${paths.accounting.taxRegistration}`);

    const goToVatRegistration = () =>
        navigate(`${paths.dashboard.accounting}/${paths.accounting.vatRegistration}`);

    return (
        <div style={{ padding: '32px 0', maxWidth: 560 }}>
            {/* Header */}
            <Tag color="blue" style={{ margin: 0, marginBottom: 12, borderRadius: 6, fontSize: 12 }}>
                Step 1 of 2 — Eligibility check
            </Tag>
            <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
                Quick eligibility check
            </Typography.Title>
            <Flex align="center" gap={8} style={{ marginBottom: 24 }}>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    3 questions · {answeredCount} of 3 answered
                </Typography.Text>
                {answeredCount > 0 && (
                    <Flex gap={4}>
                        {QUESTIONS.map((_, i) => (
                            <span
                                key={i}
                                style={{
                                    display: 'inline-block',
                                    width: 20,
                                    height: 4,
                                    borderRadius: 2,
                                    background: i < answeredCount ? '#1677FF' : '#E5E7EB',
                                    transition: 'background 0.2s',
                                }}
                            />
                        ))}
                    </Flex>
                )}
            </Flex>

            {/* Questions card */}
            <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 0 } }}>
                {QUESTIONS.map((q, i) => {
                    const val = a[q.key];
                    const answered = !!val;
                    return (
                        <div
                            key={q.key}
                            style={{
                                padding: '20px 24px',
                                borderBottom: i < QUESTIONS.length - 1 ? '1px solid #F3F4F6' : undefined,
                                background: answered ? '#FAFAFA' : undefined,
                                transition: 'background 0.2s',
                            }}
                        >
                            <Flex align="flex-start" gap={12} style={{ marginBottom: 14 }}>
                                <Flex
                                    align="center"
                                    justify="center"
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: '50%',
                                        background: answered ? '#EFF6FF' : '#F3F4F6',
                                        flexShrink: 0,
                                        marginTop: 1,
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    {answered ? (
                                        <CheckCircleFilled style={{ color: '#1677FF', fontSize: 14 }} />
                                    ) : (
                                        <Typography.Text style={{ fontSize: 11, color: '#6B7280', lineHeight: 1 }}>
                                            {i + 1}
                                        </Typography.Text>
                                    )}
                                </Flex>
                                <Typography.Text strong style={{ fontSize: 14, lineHeight: '22px' }}>
                                    {q.label}
                                </Typography.Text>
                            </Flex>
                            <div style={{ paddingLeft: 34 }}>
                                <Radio.Group
                                    value={val}
                                    onChange={e => setA(s => ({ ...s, [q.key]: e.target.value }))}
                                    optionType="button"
                                    buttonStyle="solid"
                                >
                                    {q.options.map(o => (
                                        <Radio.Button key={o.value} value={o.value}>
                                            {o.label}
                                        </Radio.Button>
                                    ))}
                                </Radio.Group>
                            </div>
                        </div>
                    );
                })}
            </Card>

            {/* Contextual callouts */}
            {noTrn && (
                <Card
                    style={{ marginTop: 12, borderColor: '#BAE0FF', background: '#F0F9FF', borderRadius: 12 }}
                    styles={{ body: { padding: '16px 20px' } }}
                >
                    <Flex gap={14} align="flex-start">
                        <SafetyCertificateOutlined style={{ color: '#1677FF', fontSize: 20, marginTop: 2, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <Typography.Text strong style={{ fontSize: 14, color: '#003EB3', display: 'block', marginBottom: 4 }}>
                                No TRN yet? We've got you.
                            </Typography.Text>
                            <Typography.Text style={{ fontSize: 13, color: '#1D4ED8', display: 'block', marginBottom: 14 }}>
                                Peko handles VAT and TRN registration in-house — no need to navigate government portals yourself.
                            </Typography.Text>
                            <Flex gap={16} align="center" wrap="wrap">
                                <Button type="primary" size="small" icon={<FileDoneOutlined />} onClick={goToTrnRegistration}>
                                    Apply now
                                </Button>
                                <Flex align="center" gap={8}>
                                    <Switch checked={notify} onChange={setNotify} size="small" />
                                    <Typography.Text style={{ fontSize: 13, color: '#1D4ED8' }}>
                                        Notify me when I'm ready
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        </div>
                    </Flex>
                </Card>
            )}

            {noVat && !noTrn && (
                <Card
                    style={{ marginTop: 12, borderColor: '#FDE68A', background: '#FFFBEB', borderRadius: 12 }}
                    styles={{ body: { padding: '16px 20px' } }}
                >
                    <Flex gap={14} align="flex-start">
                        <WarningFilled style={{ color: '#D97706', fontSize: 20, marginTop: 2, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <Typography.Text strong style={{ fontSize: 14, color: '#92400E', display: 'block', marginBottom: 4 }}>
                                VAT registration recommended
                            </Typography.Text>
                            <Typography.Text style={{ fontSize: 13, color: '#78350F', display: 'block', marginBottom: 14 }}>
                                You can proceed with a TIN-based profile, but some invoice types require VAT registration.
                                You can switch later when registered.
                            </Typography.Text>
                            <Flex gap={12} align="center" wrap="wrap">
                                <Button
                                    size="small"
                                    icon={<FileDoneOutlined />}
                                    style={{ borderColor: '#D97706', color: '#92400E' }}
                                    onClick={goToVatRegistration}
                                >
                                    Apply for VAT registration
                                </Button>
                                <Flex align="center" gap={6}>
                                    <CheckCircleOutlined style={{ color: '#059669', fontSize: 13 }} />
                                    <Typography.Text style={{ fontSize: 13, color: '#78350F' }}>
                                        You can still continue without VAT
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        </div>
                    </Flex>
                </Card>
            )}

            {allAnswered && !noTrn && !noVat && (
                <Alert
                    style={{ marginTop: 12, borderRadius: 8 }}
                    type="success"
                    showIcon
                    message="You're eligible for e-invoicing"
                    description="All requirements are met. Continue to set up your account."
                />
            )}

            <Button
                type="primary"
                size="large"
                style={{ marginTop: 20, width: '100%' }}
                disabled={!canContinue}
                onClick={handleContinue}
                icon={<ArrowRightOutlined />}
                iconPosition="end"
            >
                Continue to setup
            </Button>
        </div>
    );
};

export default EligibilityGate;
