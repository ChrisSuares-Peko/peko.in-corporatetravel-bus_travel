import * as Yup from 'yup';

export const beneficiaryPersonalSchema = Yup.object().shape({
    fullName: Yup.string()
        .matches(/^[^\s].*$/, 'Full name cannot start with a space')
        .min(3, ' Full name must be at least 3 characters ')
        .required('Please enter full name'),
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Please enter the official email ID')
        .test(
            'no-leading-special-characters',
            'Email addresses cannot start with a special character',
            value => /^[a-zA-Z0-9]/.test(value)
        )
        .test('valid-domain', 'Please enter a valid email address with a domain name', value => {
            if (value) {
                const domainPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return domainPattern.test(value);
            }
            return true;
        }),
    phoneNumber: Yup.string()
        .min(9, 'Mobile number must be at least 9 characters')
        .required('Please enter mobile number'),
    relationShip: Yup.string().required('Please select relationship'),

    additionalDetails: Yup.string().required('Please enter the address details'),
});
export const addressSchema = Yup.object().shape({
    addressLineOne: Yup.string()
        .required('Please enter the address')
        .test(
            'no-multiple-spaces',
            'Multiple consecutive spaces are not allowed',
            isConsecutiveSpaces
        )
        .min(3, 'Address must be at least 3 characters'),
    addressLineTwo: Yup.string()
        .required('Please enter the address')
        .test(
            'no-multiple-spaces',
            'Multiple consecutive spaces are not allowed',
            isConsecutiveSpaces
        )
        .min(3, 'Address must be at least 3 characters'),
    country: Yup.string().required('Please select country'),
    state: Yup.string().required('Please select state'),
    city: Yup.string().required('Please select city'),
});
export const bankDetailsSchema = Yup.object().shape({
    bankAccountName: Yup.string()
        .matches(/^[^\s].*$/, 'Full name cannot start with a space')
        .min(3, ' Full name must be at least 3 characters ')
        .required('Please enter full name'),
    bankAccountNumber: Yup.string().required('Please select country'),
    deliveryMode: Yup.string(),
    bankCode: Yup.string(),
    bankName: Yup.string(),

    bankAddress: Yup.string().required('Please select city'),
});

function isConsecutiveSpaces(value: any) {
    if (value && typeof value === 'string') {
        return !/\s{2,}/.test(value);
    }
    return true;
}
