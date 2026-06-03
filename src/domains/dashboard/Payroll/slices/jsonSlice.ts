import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateDataType = {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    mobileNo: string;
    emergencyNo: any;
    personalEmail: string;
    emergencyContactName: any;
    emergencyContactRelation: any;
    isGccNationality: boolean;
    nationality: string;
    personalAddress?: string;
    dateOfJoin: string;
    employeeId: number;
    designation: string;
    department: string;
    schedule: string;
    jobType: string;
    reportingStaff: string;
    workingDays: string;
    workingHours: string;
    workLocation: string;
    // status: string;
    basicPay: string;
    travelAllowances: string;
    homeAllowances: string;
    medicalAllowances: string;
    otherAllowances: any;
    other: any;
    accountName: string;
    accountNumber: string;
    swiftCode: string;
    bankName: string;
    bankBranch: string;
    ibanNumber: string;
    routingCode: string;
    accountType: string;
    beneficiaryName: string;
    validated: boolean;
    errors: string[];
    corporateUser?: string;
};

const initialStateData: InitialStateDataType[] = [
    {
        fullName: '',
        dateOfBirth: '',
        gender: '',
        mobileNo: '',
        emergencyNo: null,
        dateOfJoin: '',
        jobType: '',
        personalEmail: '',
        emergencyContactName: null,
        emergencyContactRelation: null,
        isGccNationality: false,
        nationality: '',
        schedule: '',
        employeeId: 0,
        designation: '',
        department: '',
        reportingStaff: '',
        workingDays: '',
        workingHours: '',
        workLocation: '',

        basicPay: '',

        travelAllowances: '',
        homeAllowances: '',
        medicalAllowances: '',
        otherAllowances: null,
        other: null,
        accountName: '',
        accountNumber: '',
        swiftCode: '',
        bankName: '',
        bankBranch: '',
        ibanNumber: '',
        accountType: '',
        beneficiaryName: '',

        routingCode: '',
        corporateUser: '',
        validated: false,
        errors: [],
    },
];

const dataSlice = createSlice({
    name: 'EmployeeBulkData',
    initialState: initialStateData,
    reducers: {
        setBulkEmployeeData: (state, action: PayloadAction<InitialStateDataType[]>) =>
            action.payload,
        resetData: state => {
            // Reset logic
        },
        updateEmployeeDetails: (
            state,
            action: PayloadAction<{ index: number; data: InitialStateDataType }>
        ) => {
            const { index, data } = action.payload;
            // No need to find the employee by ID, directly access it by index
            if (index >= 0 && index < state.length) {
                state[index] = { ...state[index], ...data };
            }
        },
    },
});

export const { setBulkEmployeeData, updateEmployeeDetails } = dataSlice.actions;

export default dataSlice.reducer;
