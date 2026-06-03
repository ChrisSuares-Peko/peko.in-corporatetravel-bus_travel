// @ts-nocheck

import dayjs from 'dayjs';
import * as Yup from 'yup';

export const travellerDataWeb = Yup.object().shape({
    nameTitle: Yup.string().required('Select'),
    firstName: Yup.string()
        .min(3, 'First name must be at least 3 characters')
        .required('Please enter the first name')
        .test(
            'no-leading-whitespace',
            'First name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'First name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'First name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    lastName: Yup.string()
        .min(2, 'Last name must have at least 2 characters')
        .required('Please enter the last name')
        .test(
            'no-leading-whitespace',
            'Last name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Last name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Last name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    gender: Yup.string().required('Please select gender'),

    passengerType: Yup.string().trim(),
    dob: Yup.date().required('Please enter the date of birth'),
    phone: Yup.string()
        .trim()
        .min(9, 'Mobile number must be at least 9 digits')
        .max(10, 'Mobile must be at most 10 digits')
        .required('Please enter the mobile number'),
    phoneCode: Yup.string().trim().required('Mobile code is required'),
    email: Yup.string()
        .email('Please enter a valid email id')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email id'
        )
        .required('Please enter the email id'),
    isPassportRequired: Yup.boolean(),

    passportNo: Yup.string().when('isPassportRequired', {
        is: (passportRequired: boolean) => passportRequired === true,
        then: schema => schema.required('Please enter the passport number'),
        otherwise: schema => schema,
    }),
    issuedCountry: Yup.string().when('isPassportRequired', {
        is: (passportRequired: boolean) => passportRequired === true,
        then: schema => schema.required('Please enter Issued country'),
        otherwise: schema => schema,
    }),
    residenceCountryCode: Yup.string().when('isPassportRequired', {
        is: (passportRequired: boolean) => passportRequired === true,
        then: schema => schema.required('Please enter Nationality'),
        otherwise: schema => schema,
    }),
    expiryDate: Yup.string().when('isPassportRequired', {
        is: (passportRequired: boolean) => passportRequired === true,
        then: schema =>
            schema
                .required('Please enter the expiry date')
                .test(
                    'is-future-date',
                    'Expiry date must be in the future',
                    value => !!value && dayjs(value).isAfter(dayjs())
                ),
        otherwise: schema =>
            schema
                .nullable()
                .test(
                    'is-future-date',
                    'Expiry date must be in the future',
                    value => !value || dayjs(value).isAfter(dayjs())
                ),
    }),
});

const travellerData = Yup.object().shape({
    firstName: Yup.string()
        .min(3, 'First name must be at least 3 characters')
        .required('Please enter the first name')
        .test(
            'no-leading-whitespace',
            'First name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'First name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'First name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    lastName: Yup.string()
        .min(2, 'Last name must have at least 2 characters')
        .required('Please enter the last name')
        .test(
            'no-leading-whitespace',
            'Last name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Last name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Last name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    gender: Yup.string().trim().required('Please select gender'),
    passportNo: Yup.string().when('isPassportRequired', {
        is: (value: string) =>
            !!fareRules[0]?.bookingRules?.passengerRules[0]?.isDocumentNumberMandatory,
        then: schema => schema.required('Please enter the passport number'),
        otherwise: schema => schema,
    }),
    passengerType: Yup.string().trim(),
    isPassportRequired: Yup.boolean(),
    issuedCountry: Yup.string().when('isPassportRequired', {
        is: (value: string) =>
            !!fareRules[0]?.bookingRules?.passengerRules[0]?.isDocumentNumberMandatory,
        then: schema => schema.required('Please enter Issued country'),
        otherwise: schema => schema,
    }),
    dob: Yup.date().required('Please enter the date of birth'),
    phone: Yup.string()
        .trim()
        .min(9, 'Mobile number must be at least 9 digits')
        .max(10, 'Mobile must be at most 10 digits')
        .required('Please enter the mobile number'),
    phoneCode: Yup.string().trim().required('Mobile code is required'),
    email: Yup.string()
        .email('Please enter a valid email id')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email id'
        )
        .required('Please enter the email id'),
    expiryDate: Yup.string().when('isPassportRequired', {
        is: (value: string) =>
            !!fareRules[0]?.bookingRules?.passengerRules[0]?.isDocumentNumberMandatory,
        then: schema => schema.required('Please enter the expiry date'),
        otherwise: schema => schema,
    }),
});
