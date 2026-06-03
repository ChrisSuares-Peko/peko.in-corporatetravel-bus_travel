import * as Yup from 'yup';

export const ticketSchema = Yup.object().shape({
    issueType: Yup.string().required('Please select the issue type'),
    module: Yup.string().required('Please select the module '),
    description: Yup.string()
        .trim()
        .required('Please enter the description')
        .min(3, 'Description must be at least 3 characters'),
    screenshotImage: Yup.string(),
    corporateUserId: Yup.string().required('Please select user '),
});
