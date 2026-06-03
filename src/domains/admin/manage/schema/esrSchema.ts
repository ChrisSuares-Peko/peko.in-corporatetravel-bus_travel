import * as Yup from 'yup';

export const ESRSchema = Yup.object().shape({
    status: Yup.string().required('Status is required'),
    remarks: Yup.string().optional(),
});
