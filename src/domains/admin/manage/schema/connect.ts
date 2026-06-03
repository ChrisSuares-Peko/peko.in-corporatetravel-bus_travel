import * as Yup from 'yup';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const connectSchema = Yup.object().shape({
    serviceProvider: Yup.string()
        .required('Please enter the service provider')
        .test(
            'no-multiple-spaces',
            'Multiple consecutive spaces are not allowed',
            isConsecutiveSpaces
        )
        .min(3, 'Service provider must be at least 3 characters'),
    tagline: Yup.string()
        .required('Please enter the tagline')
        .test(
            'no-multiple-spaces',
            'Multiple consecutive spaces are not allowed',
            isConsecutiveSpaces
        )
        .min(3, 'Tagline must be at least 3 characters'),
    mobileNo: Yup.string().min(9, 'Mobile number must be at least 9 digits'),
    email: Yup.string()
        .email('Please enter a valid email id')
        .matches(emailRegex, 'Please enter a valid email id'),
    //  website: Yup.string().url('Please enter website URL').required('Please enter website URL'),
    website: Yup.string().matches(
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/\S*)?$/,
        'Please enter a valid URL'
    ),
    address: Yup.string()
        .required('Please enter the address')
        .test(
            'no-multiple-spaces',
            'Multiple consecutive spaces are not allowed',
            isConsecutiveSpaces
        )
        .min(3, 'Address must be at least 3 characters'),
    category: Yup.string().required('Please enter the category'),
    description: Yup.string()
        .required('Please enter the description')
        .test(
            'no-multiple-spaces',
            'Multiple consecutive spaces are not allowed',
            isConsecutiveSpaces
        )
        .min(3, 'Description must be at least 3 characters'),
    offerings: Yup.string()
        .required('Please enter the offerings')
        .test(
            'no-multiple-spaces',
            'Multiple consecutive spaces are not allowed',
            isConsecutiveSpaces
        )
        .min(3, 'Offerings must be at least 3 characters'),
    rewards: Yup.string().test(
        'no-multiple-spaces',
        'Multiple consecutive spaces are not allowed',
        isConsecutiveSpaces
    ),

    // status: Yup.boolean().required('Please specify status'),
    // services: Yup.array().of(Yup.string()),
});

function isConsecutiveSpaces(value: any) {
    if (value && typeof value === 'string') {
        return !/\s{2,}/.test(value);
    }
    return true;
}
