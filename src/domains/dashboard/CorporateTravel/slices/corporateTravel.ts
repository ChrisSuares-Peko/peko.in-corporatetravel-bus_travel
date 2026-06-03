import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: { selectedType: string } = {
    selectedType: '1',
};

export const corporateTravelSlice = createSlice({
    name: 'corporateTravel',
    initialState,
    reducers: {
        resetSelectedType: () => initialState,
        updateSelectedType: (state, action: PayloadAction<string>) => {
            state.selectedType = action.payload;
        },
    },
});

export const { resetSelectedType, updateSelectedType } = corporateTravelSlice.actions;

export default corporateTravelSlice.reducer;
