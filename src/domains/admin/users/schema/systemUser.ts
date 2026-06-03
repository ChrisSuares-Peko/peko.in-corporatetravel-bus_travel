import * as Yup from 'yup';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const noConsecutiveWhitespaces = (message: string) =>
    Yup.string().test('no-consecutive-whitespaces', message, value => {
        if (typeof value !== 'string') return true;
        return !/\s{2,}/.test(value);
    });
const systemUserSchema = Yup.object().shape({
    email: Yup.string()
        .required('Please enter the email id')
        .matches(emailRegex, 'Please enter a valid email id'),
    name: Yup.string()
        .concat(noConsecutiveWhitespaces('Please enter the name'))
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters'),
    username: Yup.string()
        .concat(noConsecutiveWhitespaces('Please enter the username'))
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    roleAndPermissionId: Yup.string().required('Please select the role'),
    portalUrl: Yup.string()
        .optional()
        .matches(
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            'Must be a valid URL'
        ),
});

export default systemUserSchema;
