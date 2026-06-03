// Maps Marmin / FTA error codes to plain English explanations.
// Wire new codes through this dictionary; the fallback hides raw codes from end users.

import { Severity } from '../types';

export interface MarminErrorEntry {
    en: string;
    field?: string;
    severity: Severity;
}

export const MARMIN_ERROR_MAP: Record<string, MarminErrorEntry> = {
    'BR-AE-01': {
        en: "Customer's TRN couldn't be verified by FTA. Please confirm with your customer.",
        field: 'customer.trn',
        severity: 'error',
    },
    'BR-AE-02': {
        en: 'Your TRN is not registered for e-invoicing yet. Check your EmaraTax registration.',
        field: 'businessProfile.trn',
        severity: 'error',
    },
    'BR-AE-03': {
        en: 'Tax category reason is required when the rate is not the standard 5%.',
        field: 'lineItems.taxExemptionReason',
        severity: 'error',
    },
    'BR-AE-04': {
        en: 'Invoice number must be unique within the calendar year.',
        field: 'documentNumber',
        severity: 'error',
    },
    'BR-AE-05': {
        en: 'Issue date cannot be in the future.',
        field: 'issuedDate',
        severity: 'error',
    },
    'BR-AE-W-01': {
        en: 'Buyer email was missing — invoice cleared but customer will not get an automatic copy.',
        field: 'customer.email',
        severity: 'warning',
    },
    'BR-AE-W-02': {
        en: 'Customer address was incomplete. We submitted with the available fields.',
        field: 'customer.address',
        severity: 'warning',
    },
    'BR-AE-W-03': {
        en: 'Line item unit code is uncommon. Verify it with FTA reference list.',
        field: 'lineItems.unit',
        severity: 'warning',
    },
};

export const resolveMarminError = (code: string): MarminErrorEntry =>
    MARMIN_ERROR_MAP[code] ?? {
        en: `An issue was reported by FTA (${code}). Our team has been notified.`,
        severity: 'error',
    };
