import * as Yup from 'yup';

export const senderSchema = Yup.object().shape({
    senderName: Yup.string()
        .required('Please enter the name')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name cannot be longer than 50 characters')
        .test(
            'no-leading-whitespace',
            'Name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces
    senderCountry: Yup.string().required('Please select country'),
    senderCity: Yup.string().required('Please select the city'),
    senderAddress: Yup.string()
        .required('Please enter the address')
        .min(3, 'Address must be at least 3 characters')
        .max(50, 'Address cannot be longer than 50 characters')
        .test(
            'no-leading-whitespace',
            'Address cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Address cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Address cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces
    senderPhone: Yup.string()
        .matches(/^[0-9]{9,12}$/, 'Mobile number must be at least 9 digits')
        .required('Please enter the mobile number'),
    senderEmail: Yup.string()
        .email('Please enter a valid email id')
        .required('Please enter the email id')
        .max(50, 'Email id cannot be longer than 50 characters')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email id'
        ),
    senderZipCode: Yup.string().matches(/^\d{5,10}$/, 'Please enter a valid zip code'),
});

export const recieverSchema = (shipmentType: string) =>
    Yup.object().shape({
        recieverName: Yup.string()
            .required('Please enter the name')
            .min(3, 'Name must be at least 3 characters')
            .max(50, 'Name cannot be longer than 50 characters')
            .test(
                'no-leading-whitespace',
                'Name cannot start with whitespace',
                value => !/^\s/.test(value) // Check if starts with whitespace
            )
            .test(
                'no-multiple-whitespace',
                'Name cannot contain consecutive whitespaces',
                value => !/\s{2,}/.test(value)
            ) // No consecutive spaces
            .test(
                'not-only-whitespace',
                'Name cannot be only whitespace',
                value => !/^\s*$/.test(value)
            ), // Not only whitespaces
        recieverCountry: Yup.string().required('Please select the country'),
        recieverCity: Yup.string().required('Please select the city'),
        recieverAddress: Yup.string()
            .required('Please enter the address')
            .min(3, 'Address must be at least 3 characters')
            .max(50, 'Address cannot be longer than 50 characters')
            .test(
                'no-leading-whitespace',
                'Address cannot start with whitespace',
                value => !/^\s/.test(value) // Check if starts with whitespace
            )
            .test(
                'no-multiple-whitespace',
                'Address cannot contain consecutive whitespaces',
                value => !/\s{2,}/.test(value)
            ) // No consecutive spaces
            .test(
                'not-only-whitespace',
                'Address cannot be only whitespace',
                value => !/^\s*$/.test(value)
            ), // Not only whitespaces
        recieverPhone: Yup.string()
            .matches(/^[0-9]{9,12}$/, 'Mobile number must be at least 9 digits')
            .required('Please enter the mobile number'),
        recieverEmail: Yup.string()
            .email('Please enter a valid email id')
            .required('Please enter the email id')
            .max(50, 'Email id cannot be longer than 50 characters')
            .matches(
                /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Please enter valid email address'
            ),
        recieverZipCode: Yup.string()
            .when([], (__, schema) =>
                shipmentType === 'EXP' ? schema.required('Please enter the zip code') : schema
            )
            .matches(/^\d{5,10}$/, 'Please enter a valid zip code'),
    });

export const generateLogisticsPickupDetailsSchema = (shipmentDetails: any) => {
    let schema = Yup.object().shape({
        shipmentContent: Yup.string().required('Please select the shipment content'),
        noOfPieces: Yup.number()
            .required('Please enter the no of pieces')
            .integer('Only integer values are allowed')
            .min(1, 'At least 1 piece is required')
            .max(100, 'Maximum of 100 pieces allowed')
            .typeError('Only numbers are allowed'),

        totalWeight: Yup.number()
            .required('Please enter the total weight')
            .positive('Weight must be greater than zero')
            .test('maxDigitsBeforeDecimal', 'Invalid weight: Max value is 999', number => {
                if (!number) return false; // Ensure it's a valid number
                const [integerPart] = String(number).split('.');
                return integerPart.length <= 3 && Number(integerPart) <= 999; // Max 3 digits before decimal and less than or equal to 999
            })
            .typeError('Only numeric values are allowed'),

        pickupDate: Yup.string().required('Please select the pickup date'),
        serviceType: Yup.string().required('Please select the service type'),
    });

    if (shipmentDetails.productGroup === 'EXP') {
        schema = schema.shape({
            customsValueAmount: Yup.string()
                .required('Please enter the customs value')
                .test(
                    'is-greater-than-zero',
                    'Value must be greater than zero',
                    value => parseFloat(value) > 0
                ),
        });
    }

    return schema;
};
export const agreementSchema = Yup.object().shape({
    agreementOne: Yup.boolean().required('Required').oneOf([true], 'Agree to continue'),
    agreementTwo: Yup.boolean().required('Required').oneOf([true], 'Agree to continue'),
});
