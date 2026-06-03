import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { EInvoicingState, EInvoicingStatus, ProvisionResult } from '../types';

const initialState: EInvoicingState = {
    status: 'INACTIVE',
    smbEinvoicingId: null,
    businessProfileId: null,
    eligibility: {
        passed: false,
        nonVat: false,
        notifyWhenReady: false,
    },
    metrics: {
        cleared: 0,
        clearedAmount: 0,
        pending: 0,
        warnings: 0,
        rejected: 0,
    },
    onboardingDraft: {},
    onboardingStep: 1,
};

const eInvoicingSlice = createSlice({
    name: 'eInvoicing',
    initialState,
    reducers: {
        setStatus(state, action: PayloadAction<EInvoicingStatus>) {
            state.status = action.payload;
        },
        setEligibility(state, action: PayloadAction<Partial<EInvoicingState['eligibility']>>) {
            state.eligibility = { ...state.eligibility, ...action.payload };
        },
        setOnboardingStep(state, action: PayloadAction<number>) {
            state.onboardingStep = action.payload;
        },
        patchOnboardingDraft(state, action: PayloadAction<Record<string, unknown>>) {
            state.onboardingDraft = { ...state.onboardingDraft, ...action.payload };
        },
        resetOnboardingDraft(state) {
            state.onboardingDraft = {};
            state.onboardingStep = 1;
        },
        setMetrics(state, action: PayloadAction<Partial<EInvoicingState['metrics']>>) {
            state.metrics = { ...state.metrics, ...action.payload };
        },
        provisionSucceeded(state, action: PayloadAction<ProvisionResult>) {
            state.status = action.payload.status === 'FAILED' ? 'PENDING' : action.payload.status;
            state.smbEinvoicingId = action.payload.smbEinvoicingId;
            state.businessProfileId = action.payload.businessProfileId;
        },
    },
});

export const {
    setStatus,
    setEligibility,
    setOnboardingStep,
    patchOnboardingDraft,
    resetOnboardingDraft,
    setMetrics,
    provisionSucceeded,
} = eInvoicingSlice.actions;

export default eInvoicingSlice.reducer;
