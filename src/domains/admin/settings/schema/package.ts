import * as Yup from 'yup';

export const packageSchema = Yup.object().shape({
    packageName: Yup.string().required('Please enter package name'),
    description: Yup.string().optional(),
    packageType: Yup.string().required('Please select package type'),
    packagePrices: Yup.object().shape({
        monthly: Yup.string().required('Please enter monthly price'),
        annually: Yup.string().required('Please enter annual price'),
    }),
    discount: Yup.object().shape({
        monthly: Yup.string().required('Please enter monthly discount'),
        annually: Yup.string().required('Please enter annual discount'),
    }),
    accessCode: Yup.string().when('packageType', {
        is: 'INDIVIDUAL',
        then: schema => schema.required('Please select access code'),
        otherwise: schema => schema.optional().nullable(),
    }),
});
