import * as Yup from 'yup';

const emailRegex = /^[a-zA-Z0-9._%+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const loginSchema = Yup.object().shape({
    username: Yup.string()
        .required('Please enter the email id or account number')
        .matches(/^[a-zA-Z0-9\-_@.]+$/, 'Please enter a valid email id or account number')
        .test(
            'no-leading-whitespace',
            'Email ID or Account Number cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Email ID or Account Number cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Email ID or Account Number cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    password: Yup.string().required('Please enter the password'),
});

export const registerSteponeSchema = Yup.object().shape({
    contactPersonName: Yup.string()
        .matches(/^[a-zA-Z ]+$/, 'Please enter a valid full name')
        .required('Please enter the full name')
        .min(3, 'Full name must be at least 3 characters')
        .test(
            'no-leading-whitespace',
            'Full name cannot start with whitespace',
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
    name: Yup.string()
        .matches(/^[a-zA-Z0-9 .&]+$/, 'Please enter a valid company name')
        .required('Please enter the company name')
        .min(3, 'Company name must be at least 3 characters')
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
        ), // Not only whitespaces,
    email: Yup.string()
        .email('Please enter a valid business email id') // Please enter a valid business email id
        .matches(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid business email id'
        )
        .max(50, 'Email must be at most 50 characters')
        .required('Please enter the business email id')
        .test(
            'no-leading-whitespace',
            'Email cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Email cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Email cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    phonenumber: Yup.string()
        // .matches(/^[0-9]{9,12}$/, 'Invalid mobile number')
        .required('Please enter the mobile number')
        .min(9, 'Mobile number must be at least 9 digits'),
});
// export const registerStepTwoSchema = Yup.object().shape({
//     password: Yup.string().required('Required'),
//     confirmpassword: Yup.string()
//         .oneOf([Yup.ref('password')], 'Passwords must match')
//         .required('Required'),
// });
export const registerStepTwoSchema = Yup.object().shape({
    password: Yup.string()
        .required('Please enter your password')
        .test(
            'no-leading-whitespace',
            'password cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'password cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'password cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ),
    // .min(8, 'Password must have at least 8 characters')
    // .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .matches(/[0-9!@#$%^&*(),.?":{}|<>]/, 'Password must contain a number or symbol'),
    confirmpassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Password and confirm password must match')
        .required('Please confirm your password'),
});

export const forgotPasswordStepfourSchema = Yup.object().shape({
    password: Yup.string()
        .required('Please enter your new password')
        .test(
            'no-leading-whitespace',
            'password cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'password cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'password cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ),
    // .min(8, 'Password must have at least 8 characters')
    // .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .matches(/[0-9!@#$%^&*(),.?":{}|<>]/, 'Password must contain a number or symbol'),

    confirmpassword: Yup.string()
        .oneOf([Yup.ref('password')], 'New and confirm passwords must match')
        .required('Please confirm your new password'),
});
export const forgotPasswordStepOneSchema = Yup.object().shape({
    username: Yup.string()
        .email('Please enter a valid email id')
        .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email id')
        .max(40, 'Email must be at most 40 characters')
        .required('Please enter the email id'),
});
