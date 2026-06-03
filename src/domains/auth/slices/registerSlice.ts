import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RegisterUserState } from '../types';

const initialState = {
    step: 1,
    formData: {
        name: '',
        contactPersonName: '',
        phonenumber: '',
        email: '',
        password: '',
        referralCode: '',
    },
    loginData: {
        token: '',
        refreshToken: '',
        role: '',
        id: 0,
        username: '',
        roleName: '',
        corporateId: 0,
    },
};

const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
        nextStep: state => {
            state.step += 1;
        },
        previousStep: (state, action: PayloadAction<number | undefined>) => {
            if (action.payload !== undefined) {
                state.step = action.payload;
            } else {
                state.step -= 1;
            }
        },
        setFormData: (state, action: PayloadAction<RegisterUserState>) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        setLoginData: (state, action: PayloadAction<RegisterUserState>) => {
            state.loginData = { ...state.loginData, ...action.payload };
        },
        resetRegisterState: () => initialState,
    },
});

export const { nextStep, previousStep, setFormData, resetRegisterState, setLoginData } =
    registrationSlice.actions;
export default registrationSlice.reducer;
