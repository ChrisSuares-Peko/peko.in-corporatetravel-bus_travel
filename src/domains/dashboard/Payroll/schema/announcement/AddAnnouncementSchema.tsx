import * as Yup from 'yup';

export const addAnouncementSchema = Yup.object().shape({
    subject: Yup.string()
        .matches(/^[^\s].*$/, 'Subject cannot start with a space')
        .required('Please enter subject'),
    details: Yup.string()
        .matches(/^[^\s].*$/, 'Details cannot start with a space')
        .required('Please enter details'),
});
