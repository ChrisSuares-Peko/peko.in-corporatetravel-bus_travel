import * as Yup from 'yup';

export const departmentSchema = Yup.object().shape({
    departmentName: Yup.string()
        .required('Please enter department name')
        .matches(/^\S.*$/, 'Department name cannot start with a space')
        .min(2, ' Department name must be at least 2 characters '),
});
