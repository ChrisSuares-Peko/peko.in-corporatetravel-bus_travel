import * as Yup from 'yup';

import { tradeLicenseRegex, trnRegex } from '@utils/regex';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userSchema = Yup.object().shape({
    contactPersonName: Yup.string()
        .min(3, 'Full name must be at least 3 characters')
        .test('no-multiple-spaces', 'Full name cannot start with space', isStartsWithSpace)
        .test(
            'no-multiple-spaces',
            'Multiple consecutive spaces are not allowed',
            isConsecutiveSpaces
        )
        .required('Please enter the full name'),
    name: Yup.string()
        .min(3, 'Company name must be at least 3 characters')
        .test('no-multiple-spaces', 'Company Name cannot start with space', isStartsWithSpace)
        .test(
            'no-multiple-spaces',
            'Multiple consecutive spaces are not allowed',
            isConsecutiveSpaces
        )
        .required('Please enter the company name'),
    email: Yup.string()
        .required('Please enter the email id')
        .matches(emailRegex, 'Please enter a valid email id'),
    mobileNo: Yup.string()
        .matches(/^\d{9,10}$/, 'Mobile number must be at least 9 digits')
        .required('Mobile number is required'),
    designation: Yup.string()
        .min(3, 'Designation name must be at least 3 characters')
        .test('no-multiple-spaces', 'Designation cannot start with space', isStartsWithSpace)
        .test(
            'no-multiple-spaces',
            'Multiple consecutive spaces are not allowed',
            isConsecutiveSpaces
        )
        .required('Please enter the designation name'),
    city: Yup.string()
        .min(3, 'City name must be at least 3 characters')
        .test('no-multiple-spaces', 'City cannot start with space', isStartsWithSpace)
        .test(
            'no-multiple-spaces',
            'Multiple consecutive spaces are not allowed',
            isConsecutiveSpaces
        )
        .required('Please enter the city name'),
    activity: Yup.string().optional(),
    tradeLicenseNo: Yup.string()
        .min(7, 'Trade license number must be at least 7 digits')
        .max(10, 'Maximum 10 characters are allowed')
        .matches(tradeLicenseRegex, 'Please enter a valid license number'),
    trnNo: Yup.string().matches(trnRegex, 'Please enter a valid TRN number'),
});

function isConsecutiveSpaces(value: any) {
    if (value && typeof value === 'string') {
        return !/\s{2,}/.test(value);
    }
    return true;
}

function isStartsWithSpace(value: any) {
    if (value && typeof value === 'string') {
        return value[0] !== ' ';
    }
    return true;
}

export default userSchema;
