// Realistic mock fixtures matching the Marmin schema. Wire these into the BFF
// adapter (api/index.ts). When real BFF endpoints are ready, replace the imports.

import {
    BusinessProfile,
    Customer,
    EInvoiceDocument,
} from '../types';

export const MOCK_BUSINESS_PROFILE: BusinessProfile = {
    id: 'bp_demo_42',
    legalName: 'Sahara Trading L.L.C.',
    tradeLicense: 'CN-1184223',
    trn: '100123456700003',
    activityCode: '4690',
    vatStatus: 'STANDARD',
    address: {
        buildingNumber: '12B',
        street: 'Sheikh Zayed Road',
        district: 'Trade Centre',
        city: 'Dubai',
        emirate: 'Dubai',
        postalCode: '500011',
        country: 'AE',
    },
    branches: [
        {
            id: 'br_dxb_01',
            name: 'Dubai HQ',
            code: 'DXB',
            invoicePrefix: 'INV-DXB-',
            enabled: true,
            address: {
                buildingNumber: '12B',
                street: 'Sheikh Zayed Road',
                district: 'Trade Centre',
                city: 'Dubai',
                emirate: 'Dubai',
                postalCode: '500011',
                country: 'AE',
            },
        },
        {
            id: 'br_auh_01',
            name: 'Abu Dhabi Office',
            code: 'AUH',
            invoicePrefix: 'INV-AUH-',
            enabled: true,
            address: {
                buildingNumber: '4',
                street: 'Khalifa Street',
                district: 'Markaziya',
                city: 'Abu Dhabi',
                emirate: 'Abu Dhabi',
                postalCode: '12345',
                country: 'AE',
            },
        },
    ],
    defaults: {
        currency: 'AED',
        taxRate: 5,
        invoiceNumberFormat: 'INV-{YYYY}-{SEQ}',
    },
    bank: {
        accountHolder: 'Sahara Trading L.L.C.',
        iban: 'AE070331234567890123456',
        swift: 'EBILAEAD',
    },
};

export const MOCK_CUSTOMERS: Customer[] = [
    {
        id: 'c_001',
        type: 'business',
        name: 'Al Naseem Logistics',
        trn: '100456789200003',
        email: 'finance@naseem.ae',
        phone: '+97142223344',
        address: {
            buildingNumber: '8',
            street: 'Al Garhoud Road',
            district: 'Garhoud',
            city: 'Dubai',
            emirate: 'Dubai',
            country: 'AE',
        },
    },
    {
        id: 'c_002',
        type: 'business',
        name: 'Emirates Steel Industries',
        trn: '100222333400003',
        email: 'ap@esi.ae',
        address: {
            buildingNumber: '14',
            street: 'Mussafah Industrial Area',
            district: 'Mussafah',
            city: 'Abu Dhabi',
            emirate: 'Abu Dhabi',
            country: 'AE',
        },
    },
    {
        id: 'c_003',
        type: 'individual',
        name: 'Layla Hassan',
        email: 'layla.hassan@gmail.com',
        address: {
            buildingNumber: '32',
            street: 'Jumeirah Beach Road',
            district: 'Jumeirah 2',
            city: 'Dubai',
            emirate: 'Dubai',
            country: 'AE',
        },
    },
    {
        id: 'c_004',
        type: 'business',
        name: 'Acme Supplies Ltd',
        email: 'orders@acme.co.uk',
        address: {
            buildingNumber: '221B',
            street: 'Baker Street',
            district: 'Marylebone',
            city: 'London',
            emirate: '',
            country: 'GB',
        },
    },
    {
        id: 'c_005',
        type: 'business',
        name: 'Dubai Hospitality Group',
        trn: '100888999100003',
        email: 'finance@dhg.ae',
        address: {
            buildingNumber: '101',
            street: 'Downtown Boulevard',
            district: 'Downtown',
            city: 'Dubai',
            emirate: 'Dubai',
            country: 'AE',
        },
    },
];

const buildLine = (
    description: string,
    quantity: number,
    unitPrice: number,
    taxRate = 5
) => ({
    description,
    quantity,
    unit: 'PCE',
    unitPrice,
    taxRate,
});

const totalsFor = (
    lines: { quantity: number; unitPrice: number; taxRate: number }[],
    currency = 'AED'
) => {
    const subtotal = lines.reduce((acc, l) => acc + l.quantity * l.unitPrice, 0);
    const tax = lines.reduce(
        (acc, l) => acc + l.quantity * l.unitPrice * (Math.max(l.taxRate, 0) / 100),
        0
    );
    return { subtotal, tax, grandTotal: subtotal + tax, currency };
};

let seq = 0;
const nextId = () => `doc_${(++seq).toString().padStart(4, '0')}`;
const today = () => new Date().toISOString().slice(0, 10);
const monthsAgo = (n: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() - n);
    return d.toISOString().slice(0, 10);
};

const makeInvoice = (
    customerIdx: number,
    description: string,
    quantity: number,
    unitPrice: number,
    status: EInvoiceDocument['status'],
    overrides: Partial<EInvoiceDocument> = {}
): EInvoiceDocument => {
    const lines = [buildLine(description, quantity, unitPrice)];
    const totals = totalsFor(lines);
    const id = nextId();
    return {
        documentId: id,
        documentNumber: `INV-2026-${id.split('_')[1]}`,
        documentTypeCode: '380',
        issuedDate: today(),
        supplyDate: today(),
        dueDate: today(),
        currency: 'AED',
        branchId: 'br_dxb_01',
        customer: MOCK_CUSTOMERS[customerIdx],
        lineItems: lines,
        totals,
        status,
        ftaUuid: status === 'CLEARED' || status === 'WARNING' ? `uuid-${id}` : undefined,
        qrCode: status === 'CLEARED' || status === 'WARNING' ? 'QR_BASE64_PLACEHOLDER' : undefined,
        metaInfo: {
            zatcaResponse: {
                status:
                    status === 'CLEARED'
                        ? 'PASS'
                        : status === 'WARNING'
                          ? 'WARNING'
                          : status === 'REJECTED'
                            ? 'ERROR'
                            : 'PENDING',
                messages: [],
            },
            documentHash: 'sha256:placeholder',
            icv: Math.floor(Math.random() * 1000),
            pih: 'pih_placeholder',
            ublVersion: '2.1',
        },
        downloads: { pdf: '#mock-pdf', ublXml: '#mock-xml' },
        timeline: [{ event: 'Created', at: `${today()}T10:23:00Z` }],
        ...overrides,
    };
};

const cleared: EInvoiceDocument[] = Array.from({ length: 30 }, (_, i) => {
    const idx = i % MOCK_CUSTOMERS.length;
    const inv = makeInvoice(
        idx,
        ['Consulting fee', 'Logistics package', 'Software license', 'Steel rods (bundle)'][i % 4],
        i % 4 === 0 ? 1 : i % 4,
        500 + (i % 7) * 320,
        'CLEARED'
    );
    inv.issuedDate = monthsAgo(i % 6);
    return inv;
});

const pending: EInvoiceDocument[] = Array.from({ length: 3 }, (_, i) =>
    makeInvoice(i, 'Pending consulting work', 1, 4500 + i * 200, 'PENDING')
);

const warnings: EInvoiceDocument[] = Array.from({ length: 4 }, (_, i) => {
    const inv = makeInvoice(i, 'Field service', 1, 1280 + i * 90, 'WARNING');
    inv.metaInfo!.zatcaResponse!.messages = [
        { code: 'BR-AE-W-02', severity: 'warning' },
    ];
    return inv;
});

const rejected: EInvoiceDocument[] = Array.from({ length: 5 }, (_, i) => {
    const inv = makeInvoice(i, 'Hardware purchase', 1, 2200 + i * 100, 'REJECTED');
    inv.metaInfo!.zatcaResponse!.messages = [
        { code: ['BR-AE-01', 'BR-AE-02', 'BR-AE-03', 'BR-AE-04', 'BR-AE-05'][i], severity: 'error' },
    ];
    return inv;
});

const drafts: EInvoiceDocument[] = [
    makeInvoice(0, 'Q2 retainer', 1, 12000, 'DRAFT'),
    makeInvoice(2, 'Replacement parts', 4, 350, 'DRAFT'),
];

export const MOCK_DOCUMENTS: EInvoiceDocument[] = [
    ...cleared,
    ...pending,
    ...warnings,
    ...rejected,
    ...drafts,
];

export const MOCK_CREDIT_NOTES: EInvoiceDocument[] = Array.from({ length: 8 }, (_, i) => {
    const inv = makeInvoice(i % MOCK_CUSTOMERS.length, 'Credit for return', 1, -(800 + i * 100), 'CLEARED');
    inv.documentTypeCode = '381';
    inv.documentNumber = `CN-2026-${inv.documentId.split('_')[1]}`;
    inv.creditNoteReason = 'RET-01';
    inv.creditNoteReasonText = 'Customer returned items';
    return inv;
});

export const MOCK_PURCHASE_INVOICES: EInvoiceDocument[] = Array.from({ length: 10 }, (_, i) => {
    const inv = makeInvoice(i % MOCK_CUSTOMERS.length, 'Inbound supplier billing', 1, 4200 + i * 150, 'CLEARED');
    inv.documentTypeCode = '389';
    inv.documentNumber = `PINV-2026-${inv.documentId.split('_')[1]}`;
    inv.supplier = inv.customer;
    return inv;
});
