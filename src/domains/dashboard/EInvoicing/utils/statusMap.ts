import { DocumentStatus, ZatcaStatus } from '../types';

export const ZATCA_TO_DOC_STATUS: Record<ZatcaStatus, DocumentStatus> = {
    PASS: 'CLEARED',
    WARNING: 'WARNING',
    ERROR: 'REJECTED',
    PENDING: 'PENDING',
};

export const STATUS_LABEL: Record<DocumentStatus, string> = {
    DRAFT: 'Draft',
    PENDING: 'Submitting',
    CLEARED: 'Cleared',
    WARNING: 'Cleared with warnings',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
};

export const STATUS_TONE: Record<
    DocumentStatus,
    { color: string; bg: string; dot: string; label: string }
> = {
    DRAFT: { color: '#525252', bg: '#F5F5F5', dot: '#A3A3A3', label: STATUS_LABEL.DRAFT },
    PENDING: { color: '#1D4ED8', bg: '#DBEAFE', dot: '#2563EB', label: STATUS_LABEL.PENDING },
    CLEARED: { color: '#15803D', bg: '#DCFCE7', dot: '#16A34A', label: STATUS_LABEL.CLEARED },
    WARNING: { color: '#A16207', bg: '#FEF9C3', dot: '#CA8A04', label: STATUS_LABEL.WARNING },
    REJECTED: { color: '#B91C1C', bg: '#FEE2E2', dot: '#DC2626', label: STATUS_LABEL.REJECTED },
    CANCELLED: { color: '#525252', bg: '#F5F5F5', dot: '#737373', label: STATUS_LABEL.CANCELLED },
};

export const formatAed = (value: number, currency = 'AED') =>
    new Intl.NumberFormat('en-AE', { style: 'currency', currency }).format(value);
