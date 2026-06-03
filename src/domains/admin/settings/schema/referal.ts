import * as Yup from 'yup';

const referal = Yup.object().shape({
    referralCode: Yup.string().required('Please enter the referral code'),
    contactPersonName: Yup.string().required('Please enter the contact person name'),
    contactPersonPhone: Yup.string()
        .required('Please enter the contact person mobile')
        .min(9, 'Mobile number must be at least 9 digits'),
});

export default referal;
