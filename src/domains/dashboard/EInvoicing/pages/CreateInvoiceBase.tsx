import { useState } from 'react';

import { Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { eInvoicingApi } from '../api';
import ClearanceModal from '../components/ClearanceModal';
import SendInvoiceModal from '../components/SendInvoiceModal';
import InvoiceForm, { ComposedInvoice, InvoiceFormMode } from '../forms/InvoiceForm';
import { EInvoiceDocument } from '../types';

interface CreateInvoiceBaseProps {
    mode: InvoiceFormMode;
    title: string;
    listPath: string;
    detailParent: string;
}

const CreateInvoiceBase = ({ mode, title, listPath, detailParent }: CreateInvoiceBaseProps) => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [clearanceOpen, setClearanceOpen] = useState(false);
    const [sendOpen, setSendOpen] = useState(false);
    const [resultDoc, setResultDoc] = useState<EInvoiceDocument | undefined>();

    const handleIssue = async (
        payload: ComposedInvoice & { forceStatus?: 'PASS' | 'WARNING' | 'ERROR' | 'PENDING' }
    ) => {
        setClearanceOpen(true);
        setSubmitting(true);
        setResultDoc(undefined);

        try {
            const doc = await eInvoicingApi.submitInvoice({
                forceStatus: payload.forceStatus,
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

    return (
        <div style={{ padding: '24px 0' }}>
            <Typography.Title level={3}>{title}</Typography.Title>
            <InvoiceForm
                mode={mode}
                onSaveDraft={() => {
                    message.success('Draft saved');
                    navigate(`${paths.dashboard.einvoicing}/${listPath}`);
                }}
                onIssue={handleIssue}
            />

            <ClearanceModal
                open={clearanceOpen}
                document={resultDoc}
                submitting={submitting}
                onClose={() => {
                    setClearanceOpen(false);
                    if (resultDoc) {
                        navigate(`${paths.dashboard.einvoicing}/${detailParent}/${resultDoc.documentId}`);
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
                    message.success('Invoice sent');
                    if (resultDoc) {
                        navigate(`${paths.dashboard.einvoicing}/${detailParent}/${resultDoc.documentId}`);
                    }
                }}
            />
        </div>
    );
};

export default CreateInvoiceBase;
