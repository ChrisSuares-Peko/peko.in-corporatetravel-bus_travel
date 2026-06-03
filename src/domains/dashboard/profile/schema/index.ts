import * as Yup from 'yup';

import {
    alphaNumeric,
    alphabets,
    ibanRegex,
    numbers,
    tradeLicenseRegex,
    trnRegex,
} from '@utils/regex';

export const addressSchema = Yup.object().shape({
    addressType: Yup.string().required('Please select the address type'),
    name: Yup.string()
        .required('Please enter the name')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Maximum 50 characters are allowed')
        .matches(alphabets, 'Please enter a valid name')
        .test(
            'no-leading-whitespace',
            'Name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    addressLine1: Yup.string()
        .required('Please enter the address line 1')
        .min(3, 'Address line 1 must be at least 3 characters')
        .max(50, 'Maximum 50 characters are allowed')
        .matches(alphaNumeric, 'Please enter a valid address line 1')
        .test(
            'no-leading-whitespace',
            'Address line 1 cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Address line 1 cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Address line 1 cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    addressLine2: Yup.string()
        .required('Please enter the address line 2')
        .min(3, 'Address line 2 must be at least 3 characters')
        .max(50, 'Maximum 50 characters are allowed')
        .matches(alphaNumeric, 'Please enter a valid address line 2')
        .test(
            'no-leading-whitespace',
            'Address line 2 cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Address line 2 cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Address line 2 cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    phoneNumber: Yup.string()
        .required('Please enter the mobile number')
        .trim()
        .min(9, 'Mobile number must be at least 9 digits')
        .max(10, 'Maximum 10 characters are allowed')
        .matches(numbers, 'Please enter a valid mobile number'),
});

export const bankSchema = Yup.object().shape({
    accountHolderName: Yup.string()
        .required('Please enter the account holder name')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Maximum 50 characters are allowed')
        .matches(alphabets, 'Please enter a valid name')
        .test(
            'no-leading-whitespace',
            'Name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    bankName: Yup.string()
        .required('Please enter the bank name')
        .min(3, 'Bank name must be at least 3 characters')
        .max(50, 'Maximum 50 characters are allowed')
        .matches(alphabets, 'Please enter a valid bank name')
        .test(
            'no-leading-whitespace',
            'Bank name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Bank name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Bank name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    accountNumber: Yup.string()
        // .matches(/^[0-9]{8,16}$/, 'Please enter a valid account number')
        .required('Please enter the account number')
        .min(15, 'Account number must be at least 15 characters'),
    bankAddress: Yup.string()
        .required('Please enter the bank address')
        .min(3, 'Bank address must be at least 3 characters')
        .max(50, 'Maximum 50 characters are allowed')
        .matches(alphaNumeric, 'Please enter a bank address')
        .test(
            'no-leading-whitespace',
            'Bank address cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Bank address cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Bank address cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    iban: Yup.string()
        .required('Please enter the IBAN number')
        .matches(ibanRegex, 'Please enter a valid IBAN starting with AE'),
    swiftCode: Yup.string()
        .required('Please enter the swift code')
        .min(
            8,
            'Swift code must be at least 8 characters long and contain only letters and numbers'
        ),
    accountType: Yup.string().required('Please select the account type'),
});

export const basicInfoSchema = Yup.object().shape({
    contactPersonName: Yup.string()
        .required('Please enter the full name')
        .min(3, 'Full name must be at least 3 characters')
        .max(50, 'Maximum 50 characters are allowed')
        .matches(alphabets, 'Please enter a valid name')
        .test(
            'no-leading-whitespace',
            'Full name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Full name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Full name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    // companySize: Yup.string().required('Please select company size'),
    // country: Yup.string().required('Please select country'),
    city: Yup.string()
        .required('Please enter the city name')
        .min(3, 'City name must be at least 3 characters')
        .max(50, 'Maximum 50 characters are allowed')
        .matches(alphabets, 'Please enter a valid city')
        .test(
            'no-leading-whitespace',
            'City name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'City name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'City cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    email: Yup.string().email('Please enter valid email').required('Please enter email address'),
    mobileNo: Yup.string()
        .required('Please enter mobile number')
        .trim()
        .min(9, 'Mobile number must be at least 9 digits')
        .max(10, 'Maximum 10 characters are allowed')
        .matches(numbers, 'Please enter a valid mobile number'),
    designation: Yup.string()
        .required('Please enter the designation name')
        .min(3, 'Designation name must be at least 3 characters')
        .max(50, 'Maximum 50 characters are allowed')
        .matches(alphabets, 'Please enter a valid designation')
        .test(
            'no-leading-whitespace',
            'Designation name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Designation name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Designation name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    landlineNo: Yup.string().trim().min(9, 'Landline number must be at least 9 digits'),
});

export const companyInfoSchema = Yup.object().shape({
    activity: Yup.string()
        .test(
            'no-leading-whitespace',
            'Activity cannot start with whitespace',
            value => !/^\s/.test(value as string) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Activity cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value as string)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Activity cannot be only whitespace',
            value => !/^\s*$/.test(value as string)
        ), // Not only whitespaces,
    trnNo: Yup.string()
        // .required('Please enter the TRN number')
        .min(10, 'TRN number must be at least 10 digits')
        .matches(trnRegex, 'Please enter a valid TRN number'),
    tradeLicenseNo: Yup.string()
        // .required('Please enter the trade license number')
        .min(7, 'Trade license number must be at least 7 digits')
        .max(10, 'Maximum 10 characters are allowed')
        .matches(tradeLicenseRegex, 'Please enter a valid license number'),
    // trnExpiry: Yup.string().trim().required('Please select expiry date'),
    // tradeLicenseExpiry: Yup.string().trim().required('Please select expiry date'),
    // tradeLicenseDoc: Yup.string().required('Please upload the trade license'),
    // trnCertificate: Yup.string().required('Please upload the TRN certificate'),
    // eidDoc: Yup.string().required('Please upload owner Emirates ID '),
});

export const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Please enter the current password'),
    newPassword: Yup.string().required('Please enter the new password'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'New and confirm passwords must match')
        .required('Please confirm the new password'),
});

export const ReferralCodeSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email id')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email id'
        )
        .max(40, 'Email id must be at most 40 characters')
        .required('Please enter the email id'),
});
