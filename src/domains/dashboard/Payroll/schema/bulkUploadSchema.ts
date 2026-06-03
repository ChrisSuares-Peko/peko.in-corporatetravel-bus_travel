import moment from 'moment';
import * as Yup from 'yup';

import { ibanRegex } from '@utils/regex';

export const bulkUploadSchema = Yup.object().shape({
    fullName: Yup.string()
        .required('Please enter full name of the employee')
        .min(3, 'Name  must be atleast 3 characters'),
    dateOfBirth: Yup.date().required('Please enter date of birth of the employee').nullable(),
    gender: Yup.string().required('Please select gender of the employee'),
    mobileNo: Yup.string()

        .min(8, 'Mobile number must be atleast 9 characters')
        .required('Please enter mobile number of the employee'),

    personalEmail: Yup.string()
        .email('Please enter valid email address of the employee')
        .required('Please enter official email ID of the employee'),
    // personalAddress: Yup.string().required('Required'),
    // Making emergency contact relation optional
    // gccNational: Yup.boolean().required('Please select your option'),
    nationality: Yup.string().required('Please select nationality of the employee'),
    dateOfJoin: Yup.date().required('Please enter joining date of the employee').nullable(),

    employeeId: Yup.string()

        .required('Please enter employee ID of the employee'),
    department: Yup.string()
        .required('Please enter  department of the employee')
        .min(3, 'Department name must be atleast 3 characters'),

    // workingDays: Yup.number()
    //     .required('Please select number of working days of the employee')
    //     .min(1, 'Minimum Working days allowed is 1')
    //     .max(31, 'Maximum Working days allowed is 31'),

    designation: Yup.string().required('Please enter the designation of the employee'),

    emergencyNo: Yup.string().min(10, 'Mobile number must be at least 9 characters').nullable(),
    emergencyContactName: Yup.string().min(3, 'Name must be at least 3 characters ').nullable(),
    emergencyContactRelation: Yup.string()
        .min(3, 'Relation type must be at least 3 characters ')
        .nullable(),

    jobType: Yup.string().required('Please select  job type of the employee'),
    workingHours: Yup.lazy(value => {
        if (value && value.length > 0) {
            const { start, end } = value[0];
            const duration = moment.duration(moment(end, 'h:mm A').diff(moment(start, 'h:mm A')));
            const hours = duration.asHours();

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
    schedule: Yup.string().required('Please enter work schedule of the employee'),
    basicPay: Yup.string()
        .required('Please enter basic pay of the employee')
        .matches(/^[0-9]+$/, 'Must be a number'),
    homeAllowances: Yup.string()
        .required('Please enter home allowances of the employee')
        .matches(/^[0-9]+$/, 'Must be a number'),
    travelAllowances: Yup.string()
        .required('Please enter travel allowances of the employee')
        .matches(/^[0-9]+$/, 'Must be a number'),
    medicalAllowances: Yup.string()
        .required('Please enter medical allowances of the employee')
        .matches(/^[0-9]+$/, 'Must be a number'),
    beneficiaryName: Yup.string()
        .required('Pleaase enter beneficiary name of the employee')
        .min(3, 'Beneficiary name must be atleast 3 characters')
        .optional(),
    accountNumber: Yup.string()
        .required('Please enter account number of the employee ')
        .min(15, 'Account number must be atleast 15 characters')
        .optional(),
    bankName: Yup.string()
        .required('Please enter bank name of the employee')
        .min(3, 'Bank name must be atleast 3 characters')
        .optional(),
    swiftCode: Yup.string()
        .nullable()
        .matches(
            /^[a-zA-Z0-9]{5,}$/,
            'Swift Code must be at least 5 characters long and contain only letters and numbers'
        ),

    ibanNumber: Yup.string()
        .optional()
        .matches(ibanRegex, 'Please enter a valid IBAN starting with AE'),

    routingCode: Yup.string()
        .matches(/^[a-zA-Z0-9]{9,10}$/, 'Routing code must be 9 to 10 characters')
        .nullable(),
});
