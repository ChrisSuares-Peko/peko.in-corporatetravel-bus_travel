import moment from 'moment';
import * as Yup from 'yup';

import { ibanRegex } from '@utils/regex';

const scheduleValidation = Yup.string()
    .required('Please enter the work schedule of the employee')
    .test('is-valid-schedule', 'Please enter valid schedule', (value: string | undefined) => {
        if (!value) return false;

        const [startTime, endTime] = value.split(' - ');

        const start = moment(startTime, 'h:mm A');
        const end = moment(endTime, 'h:mm A');

        return end.isAfter(start);
    });

export default scheduleValidation;

export const employeePersonalSchema = Yup.object().shape({
    fullName: Yup.string()
        .matches(/^[^\s].*$/, 'Full name cannot start with a space')
        .min(3, ' Full name must be at least 3 characters ')
        .required('Please enter full name of the employee'),
    dob: Yup.date().required('Please enter date of birth of the employee').nullable(),
    gender: Yup.string().required('Please select gender of the employee'),
    mobileNo: Yup.string()
        .min(9, 'Mobile number must be at least 9 characters')
        .required('Please enter mobile number of the employee'),

    personalEmail: Yup.string()
        .email('Please enter a valid email address of the employee')
        .required('Please enter the official email ID of the employee')
        .test(
            'no-leading-special-characters',
            'Email addresses cannot start with a special character',
            value => /^[a-zA-Z0-9]/.test(value)
        )
        .test('valid-domain', 'Please enter a valid email address with a domain name', value => {
            if (value) {
                const domainPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return domainPattern.test(value);
            }
            return true;
        }),

    emergencyContactNo: Yup.string().min(9, 'Mobile number must be at least 9 characters'),
    emergencyContactName: Yup.string()
        .matches(/^[^\s].*$/, 'Emergency contact name cannot start with a space')

        .min(3, 'Name must be at least 3 characters '),
    emergencyContactRelation: Yup.string()
        .matches(/^[^\s].*$/, 'Emergency contact relation cannot start with a space')

        .min(3, 'Relation type must be at least 3 characters '),

    nationality: Yup.string().required('Please select nationality of the employee'),
    qualification: Yup.string(),
    experience: Yup.string(),
    maritialStatus: Yup.string(),
    sendWelcomeEmail: Yup.boolean(),
});

export const editPersonalSchema = Yup.object().shape({
    fullName: Yup.string()
        .matches(/^[^\s].*$/, 'Full name cannot start with a space')
        .min(3, 'Name must be at least 3 characters ')
        // .trim('Full name cannot start with a space')
        .required('Please enter full name of the employee'),
    dateOfBirth: Yup.date().required('Please enter date of birth of the employee').nullable(),
    gender: Yup.string().required('Please select gender of the employee'),
    mobileNo: Yup.string()
        .min(9, 'Mobile number must be at least 9 characters')
        .required('Please enter mobile number of the employee'),

    personalEmail: Yup.string()
        .email('Please enter valid email address of the employee')
        .required('Please enter official email ID of the employee'),
    email: Yup.string()
        .email('Please enter valid email address of the employee')
        .required('Please enter personal email ID of the employee'),
    emergencyNo: Yup.string().min(9, 'Mobile number must be at least 9 characters'),
    emergencyContactName: Yup.string()
        .matches(/^[^\s].*$/, 'Emergency contact name cannot start with a space')
        .min(3, 'Name must be at least 3 characters'),
    emergencyContactRelation: Yup.string()
        .matches(/^[^\s].*$/, 'Emergency contact relation cannot start with a space')

        .min(3, 'Relation type must be at least 3 characters '),

    nationality: Yup.string().required('Please select nationality of the employee'),
    qualification: Yup.string(),
    experience: Yup.string(),
    maritialStatus: Yup.string(),
});

export const employeeSchema = Yup.object().shape({
    dateOfJoin: Yup.date().required('Please enter joining date of the employee').nullable(),
    employeeId: Yup.string()
        .required('Please enter  employee ID of the employee')
        .matches(/^[^\s].*$/, 'Employee ID cannot start with a space'),
    department: Yup.string().required('Please select  department of the employee'),
    probation: Yup.string().required('Pleae select probation period of the employee'),
    // workingDays: Yup.number()
    //     .required('Please select number of working days of the employee')
    //     .min(1, 'Working days should be at least 1')
    //     .max(31, 'Working days should be at most 31'),
    // workingHours: Yup.string().required('Please add workschedule of the employee'),
    designation: Yup.string()
        .required('Please enter the designation of the employee')
        .matches(/^[^\s].*$/, 'Designation cannot start with a space')
        .min(3, 'Designation must be at least 3 characters '),

    jobType: Yup.string().required('Please select  job type of the employee'),
    workingHours: Yup.lazy(value => {
        if (value && value.length > 0) {
            const { start, end } = value[0];
            const duration = moment.duration(moment(end, 'h:mm A').diff(moment(start, 'h:mm A')));

            return Yup.number()
                .positive('Working hours should be greater than 0')
                .required('Working Hours is required')
                .test(
                    'working-hours-validation',
                    'Working hours should be greater than 0',
                    val => val > 0
                );
        }
        return Yup.number().required('Working Hours is required');
    }),

    schedule: scheduleValidation,
});

export const editEmployeeSchema = Yup.object().shape({
    dateOfJoin: Yup.date().required('Please enter joining date of the employee').nullable(),
    department: Yup.string().required('Please select a department for the employee'),

    jobType: Yup.string().required('Please select a job type for the employee'),
    reportingStaff: Yup.string().nullable(),
    employeeId: Yup.string()
        .required('Please enter an employee ID')
        .matches(/^[^\s].*$/, 'Employee ID cannot start with a space'),

    designation: Yup.string()
        .required('Please enter the designation of the employee')
        .min(3, 'Designation must be at least 3 characters ')
        .matches(/^[^\s].*$/, 'Designation cannot start with a space'),
    schedule: Yup.string()
        .required('Please enter the work schedule of the employee')
        .test('is-valid-schedule', 'Invalid schedule format', (value: string | undefined) => {
            if (!value) return false;

            const [startTime, endTime] = value.split(' - ');

            const start = moment(startTime, 'h:mm A');
            const end = moment(endTime, 'h:mm A');

            return end.isAfter(start);
        }),
});

export const salarySchema = Yup.object().shape({
    basicPay: Yup.number().required('Please enter basic pay of the employee'),
    homeAllowances: Yup.number().required('Please enter home allowances of the employee'),
    travelAllowances: Yup.number().required('Please enter travel allowances of the employee'),
    medicalAllowances: Yup.number().required('Please enter medical allowances of the employee'),
});

export const bankSchema = Yup.object().shape({
    beneficiaryName: Yup.string()
        .required('Pleaase enter beneficiary name of the employee')
        .matches(/^[^\s].*$/, 'Beneficiary name cannot start with a space')
        .min(3, 'Beneficiary name must be atleast 3 characters')
        .optional(),
    accountNumber: Yup.string()
        .required('Please enter account number of the employee ')
        .min(15, 'Account number must be atleast 15 characters')
        .optional(),
    bankName: Yup.string()
        .required('Please enter bank name of the employee')
        .matches(/^[^\s].*$/, 'Bank name cannot start with a space')

        .min(3, 'Bank name must be atleast 3 characters')
        .optional(),
    swiftCode: Yup.string()
        .nullable()
        .matches(
            /^[a-zA-Z0-9]{8,}$/,
            'Swift Code must be at least 8 characters long and contain only letters and numbers'
        ),
    ibanNumber: Yup.string()
        .required('Please enter IBAN number of the employee')
        .matches(ibanRegex, 'Please enter a valid IBAN starting with AE')
        .optional(),
    routingCode: Yup.string()
        .matches(/^[a-zA-Z0-9]{9,10}$/, 'Routing code must be 9 to 10 characters')
        .nullable(),
});

export const editBankSchema = Yup.object().shape({
    beneficiaryName: Yup.string()
        .required('Pleaase enter  name of the employee')
        .matches(/^[^\s].*$/, 'Beneficiary name cannot start with a space')

        .min(3, 'Beneficiary name must be atleast 3 characters')
        .nullable(),
    accountNumber: Yup.string()
        .required('Please enter account number of the employee ')
        .min(15, 'Account number must be atleast 15 characters'),
    bankName: Yup.string()
        .required('Please enter bank name of the employee')
        .matches(/^[^\s].*$/, 'Bank name cannot start with a space')

        .min(3, 'Bank name must be atleast 3 characters'),
    swiftCode: Yup.string()
        .nullable()
        .matches(
            /^[a-zA-Z0-9]{8,}$/,
            'Swift Code must be at least 8 characters long and contain only letters and numbers'
        ),
    ibanNumber: Yup.string()
        .required('Please enter 23 digit IBAN number of the employee starting with AE')
        .matches(ibanRegex, 'Please enter a valid IBAN starting with AE'),
    routingCode: Yup.string()
        .matches(/^[a-zA-Z0-9]{9,10}$/, 'Routing code must be 9 to 10 characters')
        .nullable(),
});

export const offBoardSchema = Yup.object().shape({
    lastWorkingDay: Yup.string().required('Please last working day of the employee'),
    noticePeriod: Yup.string().required('Please notice period of the employee'),
    offBoardingType: Yup.string().required('Please off boarding type of the employee'),
    reasonForOffBoarding: Yup.string()
        .required('Please enter reason for off boarding')
        .matches(/^[^\s].*$/, 'Reason cannot start with a space')

        .min(3, 'Reason of resignation must be at least 3 characters'),
});

export const profileImageSchema = Yup.object().shape({
    profileImage: Yup.string().required('Please provide profile image'),
});
