import * as Yup from 'yup';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const taxRegistrationSchema = Yup.object().shape({
    tradeLicenseDoc: Yup.array().of(
        Yup.object().shape({
            tradeLicenseDoc_1: Yup.lazy(value => {
                if (typeof value === 'object') {
                    return Yup.object().required('Please upload a file');
                }
                return Yup.string().required('Please upload a file');
            }),
        })
    ),
    corporateGovernanceDoc: Yup.lazy(value => {
        if (typeof value === 'object') {
            return Yup.object().required('Please upload a file');
        }
        return Yup.string().required('Please upload a file');
    }),
    emiratesIDDoc: Yup.lazy(value => {
        if (typeof value === 'object') {
            return Yup.object().required('Please upload a file');
        }
        return Yup.string().required('Please upload a file');
    }),
    passportDoc: Yup.lazy(value => {
        if (typeof value === 'object') {
            return Yup.object().required('Please upload a file');
        }
        return Yup.string().required('Please upload a file');
    }),

    contactPerson: Yup.string()
        .required('Please enter the contact person name')
        .min(3, 'Contact person name must be at least 3 characters')
        .max(50, 'Contact person name cannot be longer than 50 characters')
        .test(
            'no-leading-whitespace',
            'Contact person name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Contact person name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Contact person name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    startMonth: Yup.string().required('Please select the start month'),
    endMonth: Yup.string().required('Please select the end month'),
    companyName: Yup.string()
        .required('Please enter the company name')
        .min(3, 'Company name must be at least 3 characters')
        .test(
            'no-leading-whitespace',
            'Company name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Company name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Company name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    phoneNumber: Yup.string()
        .min(9, 'Mobile number must be at least 9 digits')
        .max(12, 'Mobile number must be at most 12 digits')
        .required('Please enter the mobile number'),
    email: Yup.string()
        .required('Please enter the email id')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email id'
        ),
    selfDeclaration: Yup.boolean()
        .oneOf([true], 'Please verify to continue')
        .required('Please verify to continue'),

    // selfDeclaration: Yup.boolean()
    //       .oneOf([true], 'Please verify to continue')
    //       .required('Please verify to continue'),
});
