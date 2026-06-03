import * as Yup from 'yup';

import { numbers } from '@utils/regex';

const attestationSchema = Yup.object().shape({
    email: Yup.string()
        .required('Please enter the email id')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:,[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/,
            'Please enter a valid email id'
        ),
    contactPersonPhone: Yup.string()
        .required('Please enter the mobile number')
        .matches(numbers, 'Please enter valid mobile number')
        .min(9, 'Mobile number must be at least 9 digits'),
    address: Yup.string()
        .required('Please enter the address')
        .min(3, 'Address must be at least 3 characters'),
});

export default attestationSchema;
