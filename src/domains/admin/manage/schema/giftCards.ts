import * as Yup from 'yup';

export const giftCardSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required('Please enter the gift card name')
        .min(3, 'Gift card name must be at least 3 characters'),
    serviceOperatorId: Yup.number().required('Please select a vendor'),
    priceType: Yup.string()
        .oneOf(['FIXED', 'FLEXI'], 'Invalid price type')
        .required('Please select price type'),
    product_id: Yup.string().required('Please enter the product id/sku code'),
    currency: Yup.string().required('Please select the currency'),
    brand_code: Yup.string().when('serviceOperatorId', {
        is: 35,
        then: schema => schema.required('Please enter the brand code'),
        otherwise: schema => schema.optional(),
    }),
    activation_fee: Yup.string().when('serviceOperatorId', {
        is: 43,
        then: schema => schema.required('Please enter activation'),
        otherwise: schema => schema.optional(),
    }),
    minDenomination: Yup.string().when('priceType', {
        is: 'FLEXI',
        then: schema => schema.required('Please enter the min denomination'),
        otherwise: schema => schema.optional(),
    }),
    maxDenomination: Yup.string().when('priceType', {
        is: 'FLEXI',
        then: schema => schema.required('Please enter the max denomination'),
        otherwise: schema => schema.optional(),
    }),
    denominations: Yup.array()
        .of(Yup.number())
        .when('priceType', {
            is: 'FIXED',
            then: schema => schema.required('Please enter the denominations'),
            otherwise: schema => schema.optional(),
        }),

    description: Yup.string()
        .required('Please enter the description')
        .min(3, 'Description must be at least 3 characters'),
    redemption_instructions: Yup.string()
        .required('Please enter the redemption instructions')
        .min(3, 'Redemption instructions must be at least 3 characters'),
    // image: Yup.mixed().required('Image is required'),
});
export const giftCardStatusUpdateSchema = Yup.object().shape({
    serviceOperatorId: Yup.string().required('Please select vendor'),
    status: Yup.mixed().required('Please select status'),
});
