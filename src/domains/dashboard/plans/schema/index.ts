import * as Yup from 'yup';

export const addressSchema = Yup.object().shape({
    firstName: Yup.string()
        .trim()
        .required('Please enter first name')
        .min(3, 'First name must be at least 3 characters')
        .max(50, 'First name cannot be longer than 50 characters'),
    lastName: Yup.string()
        .trim()
        .required('Please enter last name')
        .min(3, 'Last name must be at least 3 characters')
        .max(50, 'Last name cannot be longer than 50 characters'),
    phoneNumber: Yup.string()
        .trim()
        .matches(/^[0-9]{9,12}$/, 'Mobile number must be at least 9 digits')
        .required('Please enter mobile number'),
    email: Yup.string()
        .trim()
        .email('Please enter valid email address')
        .required('Please enter email address')
        .matches(
            /^(?!.*\.@)(?!.*@\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter valid email address'
        ),
    flatNO: Yup.string().trim().required('Please enter flat/house no'),
    city: Yup.string().trim().required('Please enter city'),
    state: Yup.string().trim().required('Please enter state'),
    address: Yup.string()
        .trim()
        .required('Please enter address')
        .min(3, 'Address must be at least 3 characters'),
    postalCode: Yup.string()
        .trim()
        .required('Please enter postal code')
        .matches(/^\d{5,10}$/, 'Please enter postal code'),
});

export const couponSchema = Yup.object().shape({
    couponCode: Yup.string()
        .trim()
        .required('Please enter coupon/discount code')
        .max(25, 'First name cannot be longer than 50 characters'),
});
