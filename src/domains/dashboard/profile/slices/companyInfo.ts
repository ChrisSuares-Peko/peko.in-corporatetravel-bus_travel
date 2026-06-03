import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { CompanyInfoResponse } from '../types';

interface CompanyInfoState {
    data: CompanyInfoResponse | null;
    isLoading: boolean;
    refresh: boolean;
    isEditLoading: boolean;
}

const initialState: CompanyInfoState = {
    data: null,
    isLoading: false,
    refresh: false,
    isEditLoading: false,
};

export const companyInfoSlice = createSlice({
    name: 'companyInfo',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<Partial<CompanyInfoState>>) => {
            state = { ...state, ...action.payload };
            return state;
        },
    },
});

export const { setData } = companyInfoSlice.actions;

export default companyInfoSlice.reducer;
