import * as Yup from 'yup';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const editProfileData = Yup.object().shape({
    mobileNo: Yup.string()
        .required('Mobile number is required')
        .min(9, 'Mobile number must be at least 9 digits'),
    email: Yup.string()
        .required('Email ID is required')
        .matches(emailRegex, 'Please enter valid email ID'),
});

export default editProfileData;
