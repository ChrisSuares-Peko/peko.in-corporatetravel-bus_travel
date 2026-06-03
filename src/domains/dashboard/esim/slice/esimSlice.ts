import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchData: {
        esimType: 'local',
        country: 'AL',
        region: 'asia',
    },
    esimDetails: {
        id: '',
        iccid: '',
    },
};

const esimSlice = createSlice({
    name: 'esim',
    initialState,
    reducers: {
        setSearchData: (state, action: PayloadAction<any>) => {
            state.searchData = action.payload;
        },
        setEsimDetails: (state, action: PayloadAction<any>) => {
            state.esimDetails = action.payload;
        },
        resetFormState: () => initialState,
    },
});

export const { setSearchData, setEsimDetails, resetFormState } = esimSlice.actions;
export default esimSlice.reducer;
