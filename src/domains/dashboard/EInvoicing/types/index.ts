// Types for the E-Invoicing domain. All types mirror the shapes the BFF
// returns when proxying Marmin (docs.ae.marmin.ai/docs/2026-01-01).

export type EInvoicingStatus = 'INACTIVE' | 'PENDING' | 'ACTIVE';

export type ZatcaStatus = 'PASS' | 'WARNING' | 'ERROR' | 'PENDING';

export type DocumentStatus =
    | 'DRAFT'
    | 'PENDING'
    | 'CLEARED'
    | 'WARNING'
    | 'REJECTED'
    | 'CANCELLED';

export type DocumentType =
    | 'sales-invoice' // 380
    | 'sales-credit-note' // 381
    | 'purchase-invoice' // 389
    | 'purchase-credit-note'; // 261

export type Severity = 'error' | 'warning';

export interface Address {
    buildingNumber: string;
    street: string;
    district: string;
    city: string;
    emirate: string;
    postalCode?: string;
    country: string;
}

export interface Branch {
    id: string;
    name: string;
    code: string;
    address: Address;
    invoicePrefix: string;
    enabled: boolean;
}

export interface BankDetails {
    accountHolder?: string;
    iban?: string;
    swift?: string;
}

export interface BusinessProfile {
    id: string;
    legalName: string;
    tradeLicense: string;
    trn: string;
    activityCode: string;
    vatStatus: 'STANDARD' | 'ZERO' | 'EXEMPT' | 'MIXED';
    address: Address;
    branches: Branch[];
    defaults: {
        currency: string;
        taxRate: number;
        invoiceNumberFormat: string;
    };
    bank: BankDetails;
    logoUrl?: string;
}

export interface Customer {
    id: string;
    type: 'business' | 'individual';
    name: string;
    trn?: string;
    email?: string;
    phone?: string;
    address: Address;
}

export interface LineItem {
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    taxRate: number; // 0, 5, etc. -1 for exempt, -2 for out-of-scope
    taxExemptionReason?: string;
    discount?: { type: 'percent' | 'absolute'; value: number };
}

export interface Totals {
    subtotal: number;
    tax: number;
    grandTotal: number;
    currency: string;
}

export interface ZatcaResponse {
    status: ZatcaStatus;
    messages: { code: string; severity: Severity; message?: string; field?: string }[];
}

export interface EInvoiceDocument {
    documentId: string;
    documentNumber: string;
    documentTypeCode: '380' | '381' | '389' | '261';
    issuedDate: string;
    supplyDate?: string;
    dueDate?: string;
    paymentTerms?: string;
    notes?: string;
    currency: string;
    branchId?: string;
    buyerReference?: string;
    customer: Customer;
    supplier?: Customer; // for purchase invoices
    lineItems: LineItem[];
    totals: Totals;
    ftaUuid?: string;
    qrCode?: string;
    status: DocumentStatus;
    referencedDocument?: { documentId: string; uuid?: string };
    creditNoteReason?: string;
    creditNoteReasonText?: string;
    metaInfo?: {
        zatcaResponse?: ZatcaResponse;
        documentHash?: string;
        icv?: number;
        pih?: string;
        ublVersion?: string;
    };
    downloads?: { pdf: string; ublXml: string };
    timeline: { event: string; at: string; reference?: string }[];
    audit?: { actor: string; action: string; at: string }[];
}

export interface EInvoicingState {
    status: EInvoicingStatus;
    smbEinvoicingId: string | null;
    businessProfileId: string | null;
    eligibility: {
        passed: boolean;
        nonVat: boolean;
        notifyWhenReady: boolean;
    };
    metrics: {
        cleared: number;
        clearedAmount: number;
        pending: number;
        warnings: number;
        rejected: number;
    };
    onboardingDraft: Record<string, unknown>;
    onboardingStep: number;
}

export interface ProvisionResult {
    status: 'ACTIVE' | 'PENDING' | 'FAILED';
    smbEinvoicingId: string;
    businessProfileId: string;
    failureReason?: string;
}

export interface BulkRow {
    rowNumber: number;
    raw: Record<string, string>;
    valid: boolean;
    status?: 'queued' | 'submitted' | 'cleared' | 'warning' | 'failed';
    error?: string;
}

export interface BulkBatch {
    batchId: string;
    templateType: DocumentType;
    rows: BulkRow[];
    counters: { submitted: number; cleared: number; warning: number; failed: number };
    completed: boolean;
}
