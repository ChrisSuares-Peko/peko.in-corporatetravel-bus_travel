import * as Yup from 'yup';

import { alphabets } from '@utils/regex';

export const addressSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('Please enter the first name')
        .min(3, 'First name must be at least 3 characters')
        .max(50, 'Maximum 50 characters are allowed')
        .matches(alphabets, 'Please enter a valid name')
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
        .matches(alphabets, 'Please enter a valid name')
        .test(
            'no-leading-whitespace',
            'Last name cannot start with whitespace',
            value => !/^\s/.test(value as string) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Last name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value as string)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Last name cannot be only whitespace',
            value => !/^\s*$/.test(value as string)
        ), // Not only whitespaces,
    address: Yup.string()
        .required('Please enter the address')
        .min(3, 'Address must be at least 3 characters')
        .max(200, 'Maximum 200 characters are allowed')
        .test(
            'no-leading-whitespace',
            'Address cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Address cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Address cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    phoneNumber: Yup.string()
        .required('Please enter the mobile number')
        .trim()
        .min(9, 'Mobile number must be atleast 9 digits')
        .max(12, 'Maximum 12 characters are allowed'),
});
