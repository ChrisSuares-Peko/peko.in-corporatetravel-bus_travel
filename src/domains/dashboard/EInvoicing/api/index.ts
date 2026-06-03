// E-Invoicing BFF adapter. Today this returns deterministic mock data with
// realistic latencies; swap each function's body for an `ApiClient` call when
// the real Peko BFF (proxying Marmin) is wired up. The function signatures and
// return shapes are stable contracts and should not change at the call site.

import {
    BulkBatch,
    BulkRow,
    DocumentType,
    EInvoiceDocument,
    EInvoicingState,
    ProvisionResult,
    ZatcaResponse,
    ZatcaStatus,
} from '../types';
import {
    MOCK_BUSINESS_PROFILE,
    MOCK_CREDIT_NOTES,
    MOCK_CUSTOMERS,
    MOCK_DOCUMENTS,
    MOCK_PURCHASE_INVOICES,
} from '../mocks/seed';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const docCollection = (type: DocumentType): EInvoiceDocument[] => {
    if (type === 'sales-invoice') return MOCK_DOCUMENTS.filter(d => d.documentTypeCode === '380');
    if (type === 'sales-credit-note') return MOCK_CREDIT_NOTES;
    if (type === 'purchase-invoice') return MOCK_PURCHASE_INVOICES;
    return MOCK_PURCHASE_INVOICES.map(d => ({ ...d, documentTypeCode: '261' as const }));
};

export const eInvoicingApi = {
    async getProfile() {
        await delay(120);
        return MOCK_BUSINESS_PROFILE;
    },

    async getCustomers() {
        await delay(100);
        return MOCK_CUSTOMERS;
    },

    async getMetrics(): Promise<EInvoicingState['metrics']> {
        await delay(120);
        const sales = MOCK_DOCUMENTS.filter(d => d.documentTypeCode === '380');
        return {
            cleared: sales.filter(d => d.status === 'CLEARED').length,
            clearedAmount: sales
                .filter(d => d.status === 'CLEARED')
                .reduce((acc, d) => acc + d.totals.grandTotal, 0),
            pending: sales.filter(d => d.status === 'PENDING').length,
            warnings: sales.filter(d => d.status === 'WARNING').length,
            rejected: sales.filter(d => d.status === 'REJECTED').length,
        };
    },

    async listDocuments(type: DocumentType): Promise<EInvoiceDocument[]> {
        await delay(180);
        return docCollection(type);
    },

    async getDocument(id: string): Promise<EInvoiceDocument | undefined> {
        await delay(120);
        return [...MOCK_DOCUMENTS, ...MOCK_CREDIT_NOTES, ...MOCK_PURCHASE_INVOICES].find(
            d => d.documentId === id
        );
    },

    async provision(_payload: Record<string, unknown>): Promise<ProvisionResult> {
        // Sequenced delays mirror the spec: account → credentials → profile → branches → webhooks.
        await delay(300);
        await delay(200);
        await delay(500);
        await delay(200);
        await delay(200);
        return {
            status: 'ACTIVE',
            smbEinvoicingId: 'mrm_acc_demo',
            businessProfileId: MOCK_BUSINESS_PROFILE.id,
        };
    },

    async submitInvoice(payload: {
        forceStatus?: ZatcaStatus;
        documentTypeCode: '380' | '381' | '389' | '261';
        documentNumber: string;
        customer: EInvoiceDocument['customer'];
        lineItems: EInvoiceDocument['lineItems'];
        totals: EInvoiceDocument['totals'];
    }): Promise<EInvoiceDocument> {
        await delay(200); // validating
        await delay(400); // generating UBL
        await delay(1200); // submitting

        const status: ZatcaStatus = payload.forceStatus ?? 'PASS';
        const zatca: ZatcaResponse = {
            status,
            messages:
                status === 'WARNING'
                    ? [{ code: 'BR-AE-W-02', severity: 'warning' }]
                    : status === 'ERROR'
                      ? [{ code: 'BR-AE-01', severity: 'error' }]
                      : [],
        };
        const docStatus: EInvoiceDocument['status'] =
            status === 'PASS'
                ? 'CLEARED'
                : status === 'WARNING'
                  ? 'WARNING'
                  : status === 'ERROR'
                    ? 'REJECTED'
                    : 'PENDING';

        const documentId = `doc_live_${Date.now()}`;
        return {
            documentId,
            documentNumber: payload.documentNumber,
            documentTypeCode: payload.documentTypeCode,
            issuedDate: new Date().toISOString().slice(0, 10),
            currency: payload.totals.currency,
            customer: payload.customer,
            lineItems: payload.lineItems,
            totals: payload.totals,
            status: docStatus,
            ftaUuid: status === 'PASS' || status === 'WARNING' ? `uuid-${documentId}` : undefined,
            qrCode: status === 'PASS' || status === 'WARNING' ? 'QR_BASE64_PLACEHOLDER' : undefined,
            metaInfo: {
                zatcaResponse: zatca,
                documentHash: 'sha256:fresh',
                icv: Math.floor(Math.random() * 10000),
                pih: 'pih_fresh',
                ublVersion: '2.1',
            },
            downloads: { pdf: '#mock-pdf', ublXml: '#mock-xml' },
            timeline: [
                { event: 'Created', at: new Date().toISOString() },
                { event: 'Submitted to FTA', at: new Date().toISOString() },
                ...(status === 'PASS' || status === 'WARNING'
                    ? [{ event: 'Cleared by FTA', at: new Date().toISOString() }]
                    : []),
            ],
        };
    },

    async saveDraft(payload: {
        documentTypeCode: '380' | '381' | '389' | '261';
        documentNumber: string;
        customer: EInvoiceDocument['customer'];
        lineItems: EInvoiceDocument['lineItems'];
        totals: EInvoiceDocument['totals'];
    }): Promise<EInvoiceDocument> {
        await delay(150);
        const documentId = `doc_draft_${Date.now()}`;
        return {
            documentId,
            documentNumber: payload.documentNumber,
            documentTypeCode: payload.documentTypeCode,
            issuedDate: new Date().toISOString().slice(0, 10),
            currency: payload.totals.currency,
            customer: payload.customer,
            lineItems: payload.lineItems,
            totals: payload.totals,
            status: 'DRAFT',
            downloads: undefined,
            timeline: [{ event: 'Draft created', at: new Date().toISOString() }],
        };
    },

    async sendInvoice(_payload: {
        documentId: string;
        to: string[];
        cc?: string[];
        subject: string;
        message: string;
        attachments: { pdf: boolean; xml: boolean };
    }) {
        await delay(450);
        return { success: true };
    },

    async submitBulk(rows: BulkRow[], templateType: DocumentType): Promise<BulkBatch> {
        const batchId = `batch_${Date.now()}`;
        const initial: BulkBatch = {
            batchId,
            templateType,
            rows: rows.map(r => ({ ...r, status: 'queued' })),
            counters: { submitted: 0, cleared: 0, warning: 0, failed: 0 },
            completed: false,
        };
        return initial;
    },

    async pollBulk(batch: BulkBatch): Promise<BulkBatch> {
        // Simulated round of progress: advance up to 6 rows per poll.
        await delay(800);
        const next = { ...batch, rows: batch.rows.map(r => ({ ...r })) };
        let advanced = 0;
        for (const row of next.rows) {
            if (advanced >= 6) break;
            if (!row.valid && row.status === 'queued') {
                row.status = 'failed';
                next.counters.failed += 1;
                advanced += 1;
                continue;
            }
            if (row.status === 'queued') {
                row.status = 'submitted';
                advanced += 1;
            } else if (row.status === 'submitted') {
                const draw = Math.random();
                if (draw < 0.85) {
                    row.status = 'cleared';
                    next.counters.cleared += 1;
                    next.counters.submitted += 1;
                } else if (draw < 0.95) {
                    row.status = 'warning';
                    next.counters.warning += 1;
                    next.counters.submitted += 1;
                } else {
                    row.status = 'failed';
                    next.counters.failed += 1;
                }
                advanced += 1;
            }
        }
        next.completed = next.rows.every(
            r => r.status === 'cleared' || r.status === 'warning' || r.status === 'failed'
        );
        return next;
    },

    async exportArchive(_payload: { from: string; to: string; types: DocumentType[] }) {
        await delay(900);
        return {
            success: true,
            url: '#mock-archive-zip',
            manifestRows: MOCK_DOCUMENTS.length,
        };
    },

    async generateApiKey() {
        await delay(300);
        return { apiKey: `pk_live_${Math.random().toString(36).slice(2, 18)}` };
    },
};
