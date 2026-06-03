import * as Yup from 'yup';

export const fileUploadSchema = Yup.object().shape({
    docket_title: Yup.string().trim().required('Please enter the document name'),
    base64: Yup.string().required('Please upload a PDF file'),
});

export const eSignDocSchema = Yup.object().shape({
    docket_title: Yup.string().trim().required('Please enter the document name'),
    expiry_date: Yup.date(), // required('Please enter the expiry date'),
    docket_description: Yup.string().trim(), // required('Please enter the docket description'),
    reminder: Yup.boolean().required('Please specify if reminders are needed'),
    initiator_email: Yup.string()
        .email('Please enter a valid email')
        .required('Please enter the initiator email'),
    reminder_interval: Yup.string().when('reminder', {
        is: true,
        then: schema =>
            schema
                .required('Please enter the reminder interval')
                .matches(/^\d+$/, 'Reminder interval must be a number')
                .test(
                    'is-greater-than-zero',
                    'Reminder interval must be at least 1 day',
                    value => Number(value) > 0
                ),
        otherwise: schema => schema.optional(),
    }),
    documentBase64: Yup.string().required('Document base64 is required'),
    sequentialSignature: Yup.boolean().required('Please specify if reminders are needed'),
    termsofUse: Yup.boolean().required('Please accept the terms of use to proceed'),
    signers_info: Yup.array()
        .of(
            Yup.object().shape({
                signer_name: Yup.string()
                    .min(3, 'Min 3 characters required')
                    .required('Please enter the signer name'),
                signer_email: Yup.string()
                    .email('Please enter a valid email')
                    .required('Please enter the signer email'),
                signer_mobile: Yup.string()
                    .matches(/^\d{9,10}$/, 'Number must be 9 or 10 digits')
                    .optional(),
                sequence: Yup.string()
                    .matches(/^\d+$/, 'Sequence must be a number')
                    .required('Please enter the sequence'),
                page_number: Yup.array()
                    .of(Yup.string())
                    .min(1, 'Page number is required')
                    .required('Page number is required'),
                signer_position: Yup.array()
                    .of(Yup.string())
                    .min(1, 'Signature position is required')
                    .required('Signature position is required'),
            })
        )
        .required('Please add at least one signer'),
});
