import * as Yup from 'yup';

const noConsecutiveWhitespaces = (message: string) =>
    Yup.string().test('no-consecutive-whitespaces', message, value => {
        if (typeof value !== 'string') return true;
        return !/\s{2,}/.test(value);
    });
export const subscriptionSchema = Yup.object().shape({
    productId: Yup.string()
        .concat(noConsecutiveWhitespaces('Product ID must not contain consecutive whitespaces'))
        .required('Please enter Product ID'),
    name: Yup.string()
        .concat(noConsecutiveWhitespaces('Software name must not contain consecutive whitespaces'))
        .required('Please enter software name')
        .min(3, 'Software name must be at least 3 characters'),
    description: Yup.string()
        .concat(noConsecutiveWhitespaces('Description must not contain consecutive whitespaces'))
        .required('Please enter description')
        .min(3, 'Description must be at least 3 characters'),
    features: Yup.string()
        .concat(noConsecutiveWhitespaces('Features must not contain consecutive whitespaces'))
        .required('Please enter features')
        .min(3, 'Features must be at least 3 characters'),
    categoryId: Yup.string().required('Please select a category'),
    pekoEmail: Yup.string()
        .concat(
            noConsecutiveWhitespaces('Email addresses must not contain consecutive whitespaces')
        )
        .required('Please enter at least one email id')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:,[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/,
            'Please enter a valid email id'
        ),
    typeOfOrder: Yup.string().required('Please select type'),
    vendorId: Yup.string().required('Please select a vendor'),
});

export const subscriptionPlanSchema = Yup.object().shape({
    softwareId: Yup.string()
        .concat(noConsecutiveWhitespaces('Software ID must not contain consecutive whitespaces'))
        .required('Please select a software'),
    planId: Yup.string()
        .concat(noConsecutiveWhitespaces('Plan ID must not contain consecutive whitespaces'))
        .required('Please enter Plan ID'),
    name: Yup.string()
        .required('Please enter software plan name')
        .min(3, 'Plan name must be at least 3 characters'),
    vendorPrice: Yup.string()
        .concat(noConsecutiveWhitespaces('Vendor Price must not contain consecutive whitespaces'))
        .required('Please enter vendor price'),
    price: Yup.string()
        .concat(noConsecutiveWhitespaces('Price must not contain consecutive whitespaces'))
        .required('Please enter customer price'),
    validity: Yup.string().required('Please enter validity'),
    // .min(3, 'Validity must have at least 3 characters'),
    noOfUsers: Yup.string().required('Please enter No of users'),
    features: Yup.string()
        .concat(noConsecutiveWhitespaces('Features must not contain consecutive whitespaces'))
        .required('Please enter features')
        .min(3, 'Features must be at least 3 characters'),
});
