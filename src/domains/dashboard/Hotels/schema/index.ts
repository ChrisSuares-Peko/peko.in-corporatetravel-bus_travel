import * as Yup from 'yup';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const userDetailsSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('Please enter the first name')
        .min(3, 'First name must be at least 3 characters')
        .max(12, 'First name cannot be longer than 12 characters')
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
        .required('Please enter the last name')
        .min(2, 'Last name must be at least 3 characters')
        .max(12, 'Last name cannot be longer than 12 characters')
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
    email: Yup.string()
        .email('Please enter a valid email id')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email id'
        )
        .required('Please enter the email id'),
    // phone: Yup.number()
    // Country: Yup.string().required('Required'),
    dob: Yup.string().required('Please enter the date of birth'),
    phone: Yup.string()
        .matches(/^[0-9]{9,12}$/, 'Mobile number must be at least 9 digits')
        .required('Please enter the mobile number'),
});
