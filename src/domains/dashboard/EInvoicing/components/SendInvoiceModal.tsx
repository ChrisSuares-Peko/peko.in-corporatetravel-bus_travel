import { useState } from 'react';

import { Button, Flex, Form, Input, Modal, Select, Space, Switch, Tag, Typography } from 'antd';

import { eInvoicingApi } from '../api';
import { EInvoiceDocument } from '../types';

interface SendInvoiceModalProps {
    open: boolean;
    document?: EInvoiceDocument;
    onClose: () => void;
    onSent?: () => void;
}

const SendInvoiceModal = ({ open, document, onClose, onSent }: SendInvoiceModalProps) => {
    const [form] = Form.useForm();
    const [includeXml, setIncludeXml] = useState(false);
    const [sending, setSending] = useState(false);

    if (!document) return null;

    const send = async () => {
        const values = await form.validateFields();
        setSending(true);
        try {
            await eInvoicingApi.sendInvoice({
                documentId: document.documentId,
                to: values.to,
                cc: values.cc ?? [],
                subject: values.subject,
                message: values.message,
                attachments: { pdf: true, xml: includeXml },
            });
            onSent?.();
            onClose();
        } finally {
            setSending(false);
        }
    };

    return (
        <Modal
            open={open}
            title={`Send ${document.documentNumber}`}
            onCancel={onClose}
            onOk={send}
            okText="Send"
            confirmLoading={sending}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    to: document.customer.email ? [document.customer.email] : [],
                    subject: `Invoice ${document.documentNumber} from your supplier`,
                    message: `Dear ${document.customer.name},\n\nPlease find attached invoice ${document.documentNumber}. Thank you for your business.\n\nBest regards.`,
                }}
            >
                <Form.Item name="to" label="To" rules={[{ required: true, type: 'array', min: 1 }]}>
                    <Select mode="tags" placeholder="recipient@example.com" tokenSeparators={[',', ' ']} />
                </Form.Item>
                <Form.Item name="cc" label="CC">
                    <Select mode="tags" tokenSeparators={[',', ' ']} />
                </Form.Item>
                <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="message" label="Message" rules={[{ required: true }]}>
                    <Input.TextArea rows={5} />
                </Form.Item>
                <Form.Item label="Attachments">
                    <Space wrap>
                        <Tag color="blue">{document.documentNumber}.pdf</Tag>
                        <Flex align="center" gap={8}>
                            <Switch checked={includeXml} onChange={setIncludeXml} size="small" />
                            <Typography.Text>Include UBL XML</Typography.Text>
                        </Flex>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SendInvoiceModal;
