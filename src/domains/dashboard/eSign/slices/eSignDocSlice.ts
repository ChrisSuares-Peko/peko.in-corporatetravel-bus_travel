import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ESignDocState } from '../types';

const initialState: ESignDocState = {
    docket_title: '',
    expiry_date: '',
    docket_description: '',
    reminder: false,
    reminder_interval: '',
    documentBase64: '',
    document_url: '',
    sequentialSignature: false,
    signers_info: [],
    initiator_email: '',
    isDisabled: false,
    status: '',
    pageNumbers: null,
    doc_expiry_date: '',
    id: '',
    termsofUse: false,
};

export const eSignDocSlice = createSlice({
    name: 'eSignDoc',
    initialState,
    reducers: {
        setESignDocData: (state, action: PayloadAction<Partial<ESignDocState>>) => ({
            ...state,
            ...action.payload,
        }),
        clearESignDocData: () => initialState,
    },
});

export const { setESignDocData, clearESignDocData } = eSignDocSlice.actions;

export default eSignDocSlice.reducer;
