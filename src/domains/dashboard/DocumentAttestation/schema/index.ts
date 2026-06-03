import * as Yup from 'yup';

export const documentDetailsSchema = Yup.object().shape({
    documentType: Yup.string().required('Select the type of document'),
    issuedCountry: Yup.string().required('Select the issued country'),
    submissionCountry: Yup.string().required('Select the submission country'),
    promoCode: Yup.string().min(3, 'Promo code must have at least 3 characters'),
});

export const deliveryDetailsSchema = Yup.object().shape({
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
        ),
    email: Yup.string()
        .email('Please enter a valid email id')
        .required('Please enter the email id')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email id'
        ),
    phoneNumber: Yup.string()
        .min(9, 'Mobile number must be at least 9 digits')
        .max(10, 'Mobile number must be at most 10 digits')
        .required('Please enter the mobile number'),
});
