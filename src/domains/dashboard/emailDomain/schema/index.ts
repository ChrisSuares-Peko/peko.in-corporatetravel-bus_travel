import * as Yup from 'yup';

export const WorkspaceSchema = Yup.object().shape({
    company_name: Yup.string()
        .trim()
        .min(3, 'Company name must be at least 3 characters')
        .matches(
            /^[A-Za-z0-9&\-_.\s]+$/,
            'Company name can only contain letters, numbers, spaces, and the special characters &, -, _, and .'
        )
        .required('Please enter the company name')
        .test(
            'no-leading-whitespace',
            'Company name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Company name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Company name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,,

    current_email_provider: Yup.string()
        .trim()
        .matches(/^[A-Za-z.]+$/, 'Current email provider can only contain alphabetic characters')
        .optional(),
    number_of_users: Yup.number()
        .required('Please enter the no. of users')
        .moreThan(0, 'Number of users must be greater than zero'),

    name: Yup.string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .matches(/^[A-Za-z\s]+$/, 'Name can only contain alphabetic characters')
        .required('Please enter the name')
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
        ), // Not only whitespaces,,

    domain_name: Yup.string()
        .trim()
        .min(3, 'Domain name must be at least 3 characters')
        .required('Please enter the domain name')
        .test(
            'no-leading-whitespace',
            'Company name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Company name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Company name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,,

    email_Id: Yup.string()
        .trim()
        .email('Please enter a valid email id')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email id'
        )
        .required('Please enter the email id'),

    alternative_email_Id: Yup.string()
        .trim()
        .email('Please enter a valid alternative email id')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid alternative email id'
        )
        .required('Please enter the alternative email id'),

    mobile_number: Yup.string()
        .trim()
        .min(9, 'Mobile number must be at least 9 digits')
        .matches(/^[0-9]{9,10}$/, 'Please enter valid mobile number')
        .required('Please enter the mobile number'),
});
