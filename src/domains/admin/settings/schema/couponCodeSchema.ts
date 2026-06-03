import * as Yup from 'yup';

const couponCodeSchema = Yup.object().shape({
    couponCode: Yup.string()
        .required('Please enter the coupon code')
        .matches(/^[A-Za-z0-9]+$/, 'Coupon code must not contain spaces or special characters'),
    discountType: Yup.string()
        .required('Please select the discount type')
        .oneOf(['PERCENTAGE', 'FLAT'], 'Discount type must be either PERCENTAGE or FLAT'),
    discount: Yup.number()
        .required('Please enter the discount')
        .when('discountType', (discountType: any, schema) =>
            // eslint-disable-next-line eqeqeq
            discountType == 'PERCENTAGE'
                ? schema
                      .integer('Discount must be an integer.')
                      .min(0, 'Discount must be at least 0')
                      .max(100, 'Discount must be at most 100')
                : schema
        ),
    validFrom: Yup.string().required('Please select the start date'),
    validTo: Yup.string().required('Please select the end date'),
});

export default couponCodeSchema;
