import * as Yup from 'yup';

export const offBoardEmployeeSchema = Yup.object().shape({
    lastWorkingDay: Yup.date()
        .required('Please select last working day of the employee')
        .nullable()

        .typeError('Please provide a valid date'),
    offBoardingDate: Yup.date()
        .required('Please select offboarding date of the employee')
        .nullable()

        .typeError('Please provide a valid date'),

    noticePeriod: Yup.number()
        .required('Please enter notice period of the employee')
        .positive('Please enter a valid notice period')
        .integer('Please enter a valid notice period'),
    offBoardingType: Yup.string().required('Please enter the type of resignation of the employee'),
    reasonForOffBoarding: Yup.string()
        .required('Please enter the reason for resignation')
        .matches(/^[^\s].*$/, 'Reason cannot start with a white space')
        .min(3, 'Reason cannot be less than 3 characters')
        .max(500, 'Reason cannot be more than 500 characters'),

    resignationLetter: Yup.mixed().required('Please upload the resignation letter of the employee'),
});
