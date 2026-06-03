import * as Yup from 'yup';

import { GiftCardOrderTypes } from '../types/employee';

export const giftCardSchema = (orderType: GiftCardOrderTypes, selectAllChecked = false) => {
    if (orderType !== GiftCardOrderTypes.BUYFOREMPLOYEE) {
        return Yup.object().shape({
            receiverFirstName: Yup.string()
                .min(3, 'Recipient name must be at least 3 characters')
                .matches(/^[a-zA-Z ]*$/, 'First name must contain only letters')
                .required('Please enter the name of the recipient')
                .test(
                    'no-leading-whitespace',
                    'Recipient name cannot start with whitespace',
                    value => !/^\s/.test(value) // Check if starts with whitespace
                )
                .test(
                    'no-multiple-whitespace',
                    'Recipient name cannot contain consecutive whitespaces',
                    value => !/\s{2,}/.test(value)
                ) // No consecutive spaces
                .test(
                    'not-only-whitespace',
                    'Recipient name cannot be only whitespace',
                    value => !/^\s*$/.test(value)
                ), // Not only whitespaces

            receiverEmail: Yup.string()
                .email('Please enter a valid email id of the recipient')
                .matches(
                    /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    'Please enter a valid email id of the recipient'
                )
                .required('Please enter the email id of the recipient'),

            senderName: Yup.string()
                .min(3, 'Sender name must have at least 3 characters')
                .required('Please enter the name of the sender')
                .test(
                    'no-leading-whitespace',
                    'Sender name cannot start with whitespace',
                    value => !/^\s/.test(value) // Check if starts with whitespace
                )
                .test(
                    'no-multiple-whitespace',
                    'Sender name cannot contain consecutive whitespaces',
                    value => !/\s{2,}/.test(value)
                ) // No consecutive spaces
                .test(
                    'not-only-whitespace',
                    'Sender name cannot be only whitespace',
                    value => !/^\s*$/.test(value)
                ), // Not only whitespaces
        });
    }
    const employeeValidation = selectAllChecked
        ? Yup.array().notRequired()
        : Yup.array()
              .of(Yup.string().required('Employee name is required'))
              .min(1, 'At least one employee must be selected')
              .required('Employee is required');
    return Yup.object().shape({
        receiverFirstName: Yup.string().optional(),
        receiverEmail: Yup.string().optional(),
        employee: employeeValidation,
        senderName: Yup.string()
            .min(3, 'Sender name must have at least 3 characters')
            .required('Please enter the name of the sender')
            .test(
                'no-leading-whitespace',
                'Sender name cannot start with whitespace',
                value => !/^\s/.test(value) // Check if starts with whitespace
            )
            .test(
                'no-multiple-whitespace',
                'Sender name cannot contain consecutive whitespaces',
                value => !/\s{2,}/.test(value)
            ) // No consecutive spaces
            .test(
                'not-only-whitespace',
                'Sender name cannot be only whitespace',
                value => !/^\s*$/.test(value)
            ), // Not only whitespaces
    });
};
