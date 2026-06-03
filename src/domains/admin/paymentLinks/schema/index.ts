import * as Yup from 'yup';

export const paymentLinkSchema = Yup.object().shape({
    corporate: Yup.string().required('Please select a corporate'),
    service: Yup.string().required('Please select a service'),
    transactionType: Yup.string().required('Please select a transaction type'),
    emailSubject: Yup.string()
        .required('Please enter the email subject')
        .max(255, 'Email subject cannot exceed 255 characters')
        .test(
            'no-leading-whitespace',
            'Email subject cannot start with whitespace',
            value => !/^\s/.test(value)
        )
        .test(
            'no-multiple-whitespace',
            'Email subject cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        )
        .test(
            'not-only-whitespace',
            'Email subject cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ),
    message: Yup.string().required('Please enter a message'),
    amount: Yup.string()
        .required('Please enter the amount')
        .matches(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number with up to two decimal places')
        .test('is-not-zero', 'Amount cannot be zero', value => Number(value) !== 0)
        .max(15, 'Maximum 15 characters are allowed'),
    currency: Yup.string()
        .required('Please enter the currency code')
        .matches(/^[A-Za-z]+$/, 'Currency code can only contain letters')
        .max(15, 'Maximum 15 characters are allowed'),
    expiryDate: Yup.string().required('Please select the expiry date'),
    paymentAttempts: Yup.string().optional(),
});

export const mailSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email id')
        .required(' Please enter the email id ')
        .test(
            'is-valid-email',
            'Please enter a valid email id',
            value => !/^\.|^.+@\.|^.*\.@.*\..*|^.*\.$/.test(value)
        ),
});
