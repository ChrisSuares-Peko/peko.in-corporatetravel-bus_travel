import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Beneficiary } from '../types';
import { BeneficiaryBulkBalance } from '../types/bulkPayment';
import { BulkData } from '../types/etisalat';

interface BeneficiaryState {
    tableData: Beneficiary[] | [];
    isLoading: boolean;
    refresh: boolean;
    bulkBalanceData: BeneficiaryBulkBalance[];
    bulkData: BulkData[];
}

const initialState: BeneficiaryState = {
    tableData: [],
    isLoading: false,
    refresh: false,
    bulkBalanceData: [],
    bulkData: [],
};

export const beneficiarySlice = createSlice({
    name: 'beneficiary',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<Partial<BeneficiaryState>>) => {
            state = { ...state, ...action.payload };
            return state;
        },
        setBulkData: (state, action: PayloadAction<BulkData[]>) => {
            state.bulkData = action.payload;
        },
        updateBulkData: (
            state,
            action: PayloadAction<{ index: number; updatedBulkData: BulkData }>
        ) => {
            const { index, updatedBulkData } = action.payload;
            if (index >= 0 && index < state.bulkData.length) {
                state.bulkData[index] = {
                    ...state.bulkData[index],
                    ...updatedBulkData,
                };
            }
        },
        deleteBulkData: (state, action: PayloadAction<number>) => {
            state.bulkData.splice(action.payload, 1);
        },
        resetData: state => initialState,
    },
});

export const { setData, setBulkData, updateBulkData, deleteBulkData, resetData } =
    beneficiarySlice.actions;

export default beneficiarySlice.reducer;
