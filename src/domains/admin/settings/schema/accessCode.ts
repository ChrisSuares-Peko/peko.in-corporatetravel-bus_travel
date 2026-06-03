import * as Yup from 'yup';

const accessCode = Yup.object().shape({
    access_code: Yup.string().required('Please enter the access code'),
    partnerId: Yup.string().required('Please enter the partner name'),
});

export default accessCode;
