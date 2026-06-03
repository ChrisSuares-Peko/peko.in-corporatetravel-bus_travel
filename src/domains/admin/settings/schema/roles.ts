import * as Yup from 'yup';

const rolesSchema = Yup.object().shape({
    registeredBy: Yup.string().required('Partner is required'),
});

export default rolesSchema;
