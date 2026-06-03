import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: {
        documentType: '',
        issuedCountry: '',
        submissionCountry: 'UAE',
        amount: '',
        credentialId: '',
        actualPrice: '',
    },
};

const documentAttestationSlice = createSlice({
    name: 'documentAttestation',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        resetFormState: () => initialState,
    },
});

export const { setData, resetFormState } = documentAttestationSlice.actions;
export default documentAttestationSlice.reducer;
