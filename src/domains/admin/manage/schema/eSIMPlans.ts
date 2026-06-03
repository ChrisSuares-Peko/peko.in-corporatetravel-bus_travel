import * as Yup from 'yup';

export const esimPlanSchema = Yup.object().shape({
    id: Yup.number().integer().positive(),
    name: Yup.string()
        .required('Please enter the name')
        .min(3, 'Name must be at least 3 characters')
        .max(255, 'Name cannot exceed 255 characters'),
    country: Yup.string()
        .required('Please select the country')
        .min(2, 'Country details must be at least 3 characters'),
    dataMBs: Yup.number()
        .required('Please specify the data pack')
        .min(1, 'Data pack must be at least 1 MB'),
    periodDays: Yup.number()
        .required('Please specify the validity')
        .min(1, 'Validity must be at least 1 day'),
    amount: Yup.number()
        .required('Please specify the amount')
        .positive('Amount must be greater than zero')
        .max(999999.9999, 'Amount cannot exceed 999999.9999'),
    // coverageId: Yup.string()
    //     .required('Please specify the validity')
    //     .min(1, 'Validity must be at least 1 character'),
});
