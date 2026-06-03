import * as Yup from 'yup';

const noConsecutiveWhitespaces = (message: string) =>
    Yup.string().test('no-consecutive-whitespaces', message, value => {
        if (typeof value !== 'string') return true;
        return !/\s{2,}/.test(value);
    });

const emailDomainPlansSchema = Yup.object().shape({
    name: Yup.string()
        .concat(noConsecutiveWhitespaces('Plan name must not contain consecutive whitespaces'))
        .required('Please enter the plan name')
        .min(3, 'Plan name must be at least 3 characters'),
    monthlyPrice: Yup.number()
        .required('Please enter the monthly price')
        .min(1, 'Monthly price must be at least 1'),
    yearlyPrice: Yup.number()
        .required('Please enter the yearly price')
        .min(1, 'Yearly price must be at least 1')
        .test('is-greater', 'Yearly price must be greater than monthly price', function (value) {
            const { monthlyPrice } = this.parent; // Access the monthlyPrice field
            return value > monthlyPrice;
        }),
    softwaresSubscriptionId: Yup.number().required('Please select a product'),
    image: Yup.string().required('Please select the product image'),

    descriptions: Yup.string()
        .required('Pease enter the description')
        .min(3, 'Description must be at least 3 characters'),
    features: Yup.array()
        .of(
            Yup.object().shape({
                label: Yup.string()
                    .required('Please enter a feature label')
                    .min(2, 'Feature label must be at least 2 characters long')
                    .max(50, 'Feature label can be at most 50 characters long'),
                value: Yup.string()
                    .required('Please enter a feature value')
                    .min(2, 'Feature value must be at least 2 characters long')
                    .max(50, 'Feature value can be at most 50 characters long'),
            })
        )
        .min(1, 'Please add at least one feature'),
});

export default emailDomainPlansSchema;
