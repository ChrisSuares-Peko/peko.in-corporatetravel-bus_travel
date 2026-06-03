import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Employee } from '../types/types';

const initialState: Employee = {
    corporateUser: '',
    fullName: '',
    profileImage: '',
    dateOfBirth: '',
    gender: '',
    mobileNo: '',
    personalEmail: '',
    personalAddress: '',
    nationality: '',
    isGccNationality: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactNo: '',
    employeeInformation: {
        dateOfJoin: '',
        employeeId: '',
        reportingStaff: '',
        department: { departmentName: '', id: '' },
        workingDays: 0,
        workingHours: 0,
        status: '',
        designation: '',
        jobType: '',
        probation: '',
    },
    salaryInformation: {
        basicPay: 0, // Set default value for basicPay
        travelAllowances: null, // Set default value for travelAllowances
        homeAllowances: null, // Set default value for homeAllowances
        medicalAllowances: null, // Set default value for medicalAllowances
        otherAllowances: null, // Set default value for otherAllowances
        other: null, // Set default value for other
    },
    employeeDocuments: [], // Set default value for employeeDocuments
    bankDetails: {
        beneficiaryName: '',
        accountNumber: '',
        bankName: '',
        swiftCode: '',
        ibanNumber: '',
    },
    createdAt: '',
    updatedAt: '',
    workSchedule: {
        days: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
        },
        startTime: '',
        endTime: '',
        breakTimeHrs: 0,
    },
    emergencyNo: '',
    id: '',
};

const GetEmployeeSlices = createSlice({
    name: 'GetemployeeDetails',
    initialState,
    reducers: {
        setEmployeeFullData: (state, action: PayloadAction<Employee>) => {
            state.fullName = action.payload.fullName;
            state.gender = action.payload.gender;
            state.dateOfBirth = action.payload.dateOfBirth;
            state.profileImage = action.payload.profileImage;
            state.mobileNo = action.payload.mobileNo;
            state.emergencyNo = action.payload.emergencyNo;
            state.nationality = action.payload.nationality;
            state.isGccNationality = action.payload.isGccNationality;
            state.personalEmail = action.payload.personalEmail;
            state.emergencyContactName = action.payload.emergencyContactName;
            state.emergencyContactNo = action.payload.emergencyContactNo;
            state.emergencyContactRelation = action.payload.emergencyContactRelation;
            state.employeeInformation = action.payload.employeeInformation;
            state.salaryInformation = action.payload.salaryInformation;
            state.employeeDocuments = action.payload.employeeDocuments;
            state.id = action.payload.id;
            state.bankDetails = action.payload.bankDetails;
        },
        setEmployeeData: (state, action: PayloadAction<Employee>) => {},

        resetData: state => {
            state = initialState;
            return state;
        },
    },
});

export const { setEmployeeFullData, resetData } = GetEmployeeSlices.actions;

export default GetEmployeeSlices.reducer;
