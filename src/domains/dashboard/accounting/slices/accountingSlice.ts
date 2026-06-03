import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Record } from '../types/types';

interface InitialState {
    taxData: any;
    formDetails: any;
    amount: number;

    taxDetails: any;
}
const initialState: InitialState = {
    taxData: null,
    formDetails: {
        tradeLicenseDoc: [],
        corporateGovernanceDoc: '',
        emiratesIDDoc: '',
        passportDoc: '',
        contactPerson: '',
        startMonth: '',
        endMonth: '',
        companyName: '',
        phoneNumber: '',
        email: '',
        selfDeclaration: false,
    },
    amount: 0,
    taxDetails: null,
};

export const accountingSlice = createSlice({
    name: 'accounting',
    initialState,
    reducers: {
        TaxDetails: (state, action: PayloadAction<Record>) => {
            state.taxData = action.payload;
        },
        setDetails: (state, action: PayloadAction<any>) => {
            state.formDetails = action.payload;
        },
        setAmount: (state, action: PayloadAction<number>) => {
            state.amount = action.payload;
        },
        resetTaxData: state => {
            state.taxData = initialState.taxData;
            return state;
        },
        resetForm: state => {
            state.taxDetails = initialState.taxDetails;
            return state;
        },
        taxUpdate: (state, action: PayloadAction<Record>) => {
            state.taxDetails = action.payload;
        },
    },
});

export const { TaxDetails, setDetails, setAmount, resetTaxData, taxUpdate, resetForm } =
    accountingSlice.actions;
export default accountingSlice.reducer;
