import * as Yup from 'yup';

export const ReceiverDetailsSchema = Yup.object().shape({
    phone: Yup.string()
        .trim()
        .min(9, 'Mobile number must be at least 9 digits')
        .max(10)
        .required('Please enter the mobile number'),
    email: Yup.string()
        .email('Please enter a valid email id')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email id'
        )
        .required('Please enter the email id'),
});
export const cancellationSchema = Yup.object().shape({
    reasonForCancellation: Yup.string()
        .required('Please enter the reason for cancellation')
        .min(3, 'Reason must be at least 3 characters')
        .max(200, 'Maximum 200 characters are allowed')
        .test(
            'no-leading-whitespace',
            'Reason cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Reason cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Reason cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ),
});
