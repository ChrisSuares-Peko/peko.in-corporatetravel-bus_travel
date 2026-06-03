import * as Yup from 'yup';

const cashbackSchema = Yup.object().shape({
    packageId: Yup.string().required('Please enter the package'),
    serviceOperatorId: Yup.string().required('Please enter the service operator'),
    cashbackType: Yup.string().required('Please enter the cashback type'),
    cashback: Yup.string().required('Please enter the cashback'),
    surcharge: Yup.string().required('Please enter the surcharge'),
});

export default cashbackSchema;
