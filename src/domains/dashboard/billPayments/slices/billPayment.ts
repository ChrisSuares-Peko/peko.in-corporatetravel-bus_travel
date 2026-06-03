import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Vendor, Beneficiary } from '../types';

interface VendorState {
    vendor: Vendor | null;
    isLoading: boolean;
    beneficiary: Beneficiary | null;
    formKey: number | null;
}

const initialState: VendorState = {
    vendor: null,
    isLoading: false,
    beneficiary: null,
    formKey: null,
};

export const billPaymentSlice = createSlice({
    name: 'billPayment',
    initialState,
    reducers: {
        setVendor: (state, action: PayloadAction<Vendor | null>) => {
            state.vendor = action.payload;
        },
        setBeneficiary: (state, action: PayloadAction<Beneficiary>) => {
            state.beneficiary = action.payload;
        },
        setFormKey: (state, action: PayloadAction<number>) => {
            state.formKey = action.payload;
        },
        resetVendors: state => initialState,
    },
});

// Export the actions generated from the slice
export const { setVendor, resetVendors, setBeneficiary, setFormKey } = billPaymentSlice.actions;

// Export the reducer, either as a default or named export
export default billPaymentSlice.reducer;
