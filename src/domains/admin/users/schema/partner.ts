import * as Yup from 'yup';

const partnerSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    portalUrl: Yup.string().url('Portal URL must be a valid URL.'),
});

export default partnerSchema;
