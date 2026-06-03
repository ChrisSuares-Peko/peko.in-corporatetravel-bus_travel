import * as Yup from 'yup';

const nameRegex = /^[A-Za-z0-9\s\-']+$/;

export const workInformationSchema = Yup.object().shape({
    pocName: Yup.string()
        .required('Please enter the POC name')
        .min(3, 'POC name must be at least 3 characters')
        .test(
            'no-leading-whitespace',
            'POC name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'POC name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'POC name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces
    email: Yup.string()
        .email('Please enter a valid email id')
        .required('Please enter the email id')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email id'
        ),
    requirement: Yup.string()
        .required('Please enter the requirements')
        .min(3, 'Requirement must be at least 3 characters')
        .matches(nameRegex, 'Enter a valid requirement')
        .test(
            'no-leading-whitespace',
            'Requirement cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Requirement cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Requirement cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces
});
