import * as Yup from 'yup';

export const notificationSchema = Yup.object().shape({
    notificationTitle: Yup.string()
        .trim()
        .min(3, 'Notification title must be at least 3 characters long')
        .max(120, 'Notification title cannot be longer than 120 characters')
        .required('Please enter the notification title'),
    notificationBrief: Yup.string()
        .trim()
        .min(3, 'Notification brief must be at least 3 characters long')
        .max(350, 'Notification brief cannot be longer than 350 characters')
        .required('Please enter the notification brief'),
    notificationCategory: Yup.string().trim().required('Please select category'),
    notificationTo: Yup.lazy(value =>
        Array.isArray(value)
            ? Yup.array()
                  .of(Yup.string().trim())
                  .required('Please select corporate')
                  .min(1, 'Please select at least one corporate')
            : Yup.string().trim().required('Please select corporate')
    ),
});
