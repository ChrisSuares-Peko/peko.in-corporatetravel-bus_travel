import * as Yup from 'yup';

export const VocherIdSchema = Yup.object().shape({
    voucherId: Yup.number()
        .required('Please enter the voucher ID')
        .typeError('Please Enter a valid Voucher ID'),
});

export const customerDetailsSchema = Yup.object().shape({
    customerName: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces are allowed in Customer Name')
        .min(3, 'Customer name must be at least 3 characters')
        .required('Please enter the customer name')
        .test(
            'no-leading-whitespace',
            'Customer name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Customer name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Customer name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    emiratesId: Yup.string()
        .matches(/^[0-9]{15}$/, 'Please enter a valid 15-digit Emirates ID')
        .required('Please enter the customer Emirates ID'),
});
