import * as Yup from 'yup';

export const haflatSchema = Yup.object().shape({
    cardNumber: Yup.string()
        .min(15, 'Card number must be at least 15 characters')
        .max(30, 'Card number can have at most 30 characters')
        .required('Please enter the card number'),
});

export const darbSchema = Yup.object().shape({
    plateNumber: Yup.string()
        .min(10, 'Traffic number must be at least 10 characters')
        .required('Please enter the traffic number'),
    eid: Yup.string()
        .min(15, 'Emirates ID must be 15 characters')
        .required('Please enter Emirates ID'),
});
