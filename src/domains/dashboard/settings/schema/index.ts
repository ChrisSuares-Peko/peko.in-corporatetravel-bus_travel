import * as Yup from 'yup';

export const subCorporateSchema = Yup.object().shape({
    name: Yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Employee name can only contain alphabets and spaces')
        .test(
            'not-only-whitespace',
            'Employee name cannot be only whitespace',
            value => (value || '').trim() !== ''
        )
        .required('Please enter employee name'),
    email: Yup.string().email('Please enter a valid email').required('Please enter a valid email'),
    confirmemail: Yup.string()
        .oneOf([Yup.ref('email'), undefined], 'Email must match')
        .required('Please confirm employee email'),
    mobileNo: Yup.string().matches(/^[0-9]{9,10}$/, 'Mobile number must be at least 9 digits'),
    role: Yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Employee role can only contain alphabets and spaces')
        .test(
            'not-only-whitespace',
            'Employee role cannot be only whitespace',
            value => (value || '').trim() !== ''
        )
        .required('Please enter employee role'),
});
