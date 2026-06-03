import * as Yup from 'yup';

export const holidaySchema = Yup.object().shape({
    title: Yup.string().required('Please enter holiday name'),
    start: Yup.string().required('Please select start date'),
    end: Yup.string().required('Please select end date'),
});
