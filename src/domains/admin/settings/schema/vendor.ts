import * as Yup from 'yup';

import { alphabets } from '@utils/regex';

export const vendorData = Yup.object().shape({
    vendorName: Yup.string()
        .required('Please enter the vendor name')
        .matches(alphabets, 'Please enter valid vendor name')
        .min(3, 'Vendor name must be at least 3 characters'),
    type: Yup.string().required('Please select the type'),
    apiUrl: Yup.string().required('Please enter a valid API URL'),
    vendorEmail: Yup.string()
        .required('Please enter at least one email id')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:,[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/,
            'Please enter a valid email id'
        ),
});
