import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '' ?? undefined,

    email: '' ?? undefined,

    basicSalary: 0,

    dateOfJoin: '',

    payrollStartDate: '',
};

const payrollSalarySlice = createSlice({
    name: 'payrollSalary',

    initialState,

    reducers: {
        setEmployeeName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },

        setEmployeeEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },

        setBasicSalary: (state, action: PayloadAction<number>) => {
            state.basicSalary = action.payload;
        },

        setDateOfJoin: (state, action: PayloadAction<string>) => {
            state.dateOfJoin = action.payload;
        },

        setPayrollStartDate: (state, action: PayloadAction<string>) => {
            state.payrollStartDate = action.payload;
        },

        resetSalarySlice: state => {
            state = initialState;

            return state;
        },
    },
});

export const {
    setEmployeeName,

    setEmployeeEmail,

    setBasicSalary,

    setDateOfJoin,

    setPayrollStartDate,

    resetSalarySlice,
} = payrollSalarySlice.actions;

export default payrollSalarySlice.reducer;
