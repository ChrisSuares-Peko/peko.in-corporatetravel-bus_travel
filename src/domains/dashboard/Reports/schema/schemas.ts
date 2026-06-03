import * as Yup from 'yup';

export const schema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email id')
        .required(' Please enter the email id ')
        .test(
            'is-valid-email',
            'Please enter a valid email id',
            value => !/^\.|^.+@\.|^.*\.@.*\..*|^.*\.$/.test(value)
        ),
});
