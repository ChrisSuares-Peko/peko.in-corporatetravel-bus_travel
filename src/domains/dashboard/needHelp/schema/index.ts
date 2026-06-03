import * as Yup from 'yup';

export const ticketSchema = Yup.object().shape({
    issueType: Yup.string().required('Please select the issue type'),
    module: Yup.string().required('Please select the module'),
    description: Yup.string()
        .trim()
        .min(3, 'Description must be at least 3 characters')
        .required('Please enter the description'),
    screenshotImage: Yup.string(),
});
