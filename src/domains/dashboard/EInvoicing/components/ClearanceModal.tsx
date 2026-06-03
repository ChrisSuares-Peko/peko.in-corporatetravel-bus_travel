import { useEffect, useState } from 'react';

import {
    CheckCircleFilled,
    CloseCircleFilled,
    LoadingOutlined,
    WarningFilled,
} from '@ant-design/icons';
import { Alert, Button, Flex, Modal, Space, Typography } from 'antd';

import { EInvoiceDocument } from '../types';
import { resolveMarminError } from '../utils/marminErrorMap';
import { formatAed } from '../utils/statusMap';

interface ClearanceModalProps {
    open: boolean;
    document?: EInvoiceDocument;
    submitting: boolean;
    onClose: () => void;
    onSend?: () => void;
    onEdit?: () => void;
}

const STAGES = ['Validating', 'Generating UBL XML', 'Submitting to FTA', 'Result'];

const ClearanceModal = ({
    open,
    document,
    submitting,
    onClose,
    onSend,
    onEdit,
}: ClearanceModalProps) => {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        if (!open) return;
        setStage(0);
        const t1 = setTimeout(() => setStage(1), 200);
        const t2 = setTimeout(() => setStage(2), 600);
        const t3 = setTimeout(() => setStage(3), 1800);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [open]);

    const status = document?.metaInfo?.zatcaResponse?.status;
    const messages = document?.metaInfo?.zatcaResponse?.messages ?? [];

    const renderResult = () => {
        if (submitting || stage < 3 || !document) return null;

        if (status === 'PASS') {
            return (
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <CheckCircleFilled style={{ fontSize: 56, color: '#16A34A' }} />
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Cleared by FTA
                    </Typography.Title>
                    <Typography.Text type="secondary">
                        Reference: {document.ftaUuid}
                    </Typography.Text>
                    <Typography.Text strong>
                        {formatAed(document.totals.grandTotal, document.currency)}
                    </Typography.Text>
                    <Space style={{ marginTop: 12 }}>
                        <Button type="primary" onClick={onSend}>
                            Send to customer
                        </Button>
                        <Button>Download PDF</Button>
                        <Button>Download UBL XML</Button>
                    </Space>
                </Space>
            );
        }

        if (status === 'WARNING') {
            return (
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <WarningFilled style={{ fontSize: 56, color: '#CA8A04' }} />
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Cleared with notes
                    </Typography.Title>
                    <Typography.Text type="secondary">
                        Reference: {document.ftaUuid}
                    </Typography.Text>
                    <div style={{ width: '100%', marginTop: 8 }}>
                        {messages.map(m => {
                            const r = resolveMarminError(m.code);
                            return (
                                <Alert
                                    key={m.code}
                                    type="warning"
                                    showIcon
                                    style={{ marginBottom: 8 }}
                                    message={r.en}
                                />
                            );
                        })}
                    </div>
                    <Space style={{ marginTop: 12 }}>
                        <Button type="primary" onClick={onSend}>
                            Send to customer
                        </Button>
                        <Button>Download PDF</Button>
                        <Button onClick={onClose}>Acknowledge</Button>
                    </Space>
                </Space>
            );
        }

        if (status === 'ERROR') {
            return (
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <CloseCircleFilled style={{ fontSize: 56, color: '#DC2626' }} />
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Couldn't issue this invoice
                    </Typography.Title>
                    <div style={{ width: '100%', marginTop: 8 }}>
                        {messages.map(m => {
                            const r = resolveMarminError(m.code);
                            return (
                                <Alert
                                    key={m.code}
                                    type="error"
                                    showIcon
                                    style={{ marginBottom: 8 }}
                                    message={r.en}
                                    description={r.field ? `Field: ${r.field}` : undefined}
                                />
                            );
                        })}
                    </div>
                    <Space style={{ marginTop: 12 }}>
                        <Button type="primary" onClick={onEdit}>
                            Edit invoice
                        </Button>
                        <Button>Contact support</Button>
                    </Space>
                </Space>
            );
        }

        return (
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
                <LoadingOutlined style={{ fontSize: 48 }} />
                <Typography.Title level={4} style={{ margin: 0 }}>
                    Submitted to FTA
                </Typography.Title>
                <Typography.Text type="secondary">
                    Usually under a minute. We'll notify you when it's cleared.
                </Typography.Text>
                <Button onClick={onClose}>Continue working</Button>
            </Space>
        );
    };

    return (
        <Modal open={open} closable={false} footer={null} centered width={520}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                    Issuing invoice
                </Typography.Title>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    {STAGES.map((label, i) => {
                        const done = i < stage || (i === 3 && !submitting && document);
                        const active = i === stage && submitting;
                        return (
                            <Flex key={label} gap={12} align="center">
                                {done ? (
                                    <CheckCircleFilled style={{ color: '#16A34A' }} />
                                ) : active ? (
                                    <LoadingOutlined />
                                ) : (
                                    <span
                                        style={{
                                            width: 14,
                                            height: 14,
                                            borderRadius: 999,
                                            background: '#E5E5E5',
                                            display: 'inline-block',
                                        }}
                                    />
                                )}
                                <Typography.Text>{label}</Typography.Text>
                            </Flex>
                        );
                    })}
                </Space>
                {renderResult()}
            </Space>
        </Modal>
    );
};

export default ClearanceModal;
