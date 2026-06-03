import * as Yup from 'yup';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const invoiceDetailsSchema = Yup.object().shape({
    billerName: Yup.string()
        .required("Please enter the biller's name")
        .matches(/^[^\s].*$/, 'Biller name cannot start with whitespace')
        .test(
            'no-multiple-whitespace',
            'Biller name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Biller name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        )
        .min(3, 'Biller name must be at least 3 characters'),
    billerCompanyAddress: Yup.string()
        .matches(/^[a-zA-Z0-9\s.,]+$/, 'Please enter valid company address')
        .required('Please enter the company address')
        .matches(/^[^\s].*$/, 'Company address cannot start with whitespace')
        .test(
            'no-multiple-whitespace',
            'Company address cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Company address cannot be only whitespace',
            value => !/^\s*$/.test(value)
        )
        .min(3, 'Company address must be at least 3 characters'),

    billerEmail: Yup.string()
        .email('Please enter a valid email id')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email id'
        )
        .required("Please enter the biller's email id"),
    billerPhone: Yup.string()
        .matches(/^[0-9]{9,12}$/, 'Mobile number must be at least 9 digits')
        .required("Please enter the biller's mobile number"),

    billerGST: Yup.string().optional(),

    customerName: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'Please enter valid customer name')
        .required("Please enter the customer's name")
        .matches(/^[^\s].*$/, 'Customer name cannot start with whitespace')
        .test(
            'no-multiple-whitespace',
            'Customer name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Customer name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        )
        .min(3, 'Customer name must be at least 3 characters'),
    customerAddress: Yup.string()
        .matches(/^[a-zA-Z0-9\s.,]+$/, 'Please enter valid customer address')
        .required("Please enter the customer's address")
        .matches(/^[^\s].*$/, 'Customer address cannot start with whitespace')
        .test(
            'no-multiple-whitespace',
            'Customer address cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Customer address cannot be only whitespace',
            value => !/^\s*$/.test(value)
        )
        .min(3, 'Customer address must be at least 3 characters'),
    customerPhone: Yup.string()
        .matches(/^[0-9]{9,12}$/, 'Mobile number must be at least 9 digits')
        .required("Please enter the customer's mobile number"),
    customerEmail: Yup.string()
        .required("Please enter the customer's email id")
        .email('Please enter a valid email id')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter valid email address'
        ),
    paymentMode: Yup.string().required('Please select a payment mode'),
    invoiceNo: Yup.string()
        .required('Please enter the invoice number')
        .matches(/^[^\s].*$/, 'Invoice number cannot start with whitespace'),
    invoiceDate: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invoice date must be in the format YYYY-MM-DD')
        .required('Please enter the invoice date'),
    dueDate: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in the format YYYY-MM-DD')
        .required('Please enter the due date'),
    items: Yup.array().of(
        Yup.object().shape({
            item: Yup.string()
                .matches(/^[\w\s.,;:'"-]+$/, 'Please enter a valid description')
                .required('Please enter an item description')
                .matches(/^[^\s].*$/, 'Description cannot start with a space')
                .test(
                    'no-multiple-whitespace',
                    'Description cannot contain consecutive whitespaces',
                    value => !/\s{2,}/.test(value)
                ) // No consecutive spaces
                .test(
                    'not-only-whitespace',
                    'Description cannot be only whitespace',
                    value => !/^\s*$/.test(value)
                )
                .test(
                    'not-only-numbers',
                    'Description cannot contain only numbers',
                    value => !/^\d+$/.test(value)
                )
                .min(3, 'Description must be at least 3 characters'),
            quantity: Yup.number()
                .typeError('Quantity must be a number')
                .required('Please enter the quantity'),

            price: Yup.number()
                .typeError('Price must be a number')
                .min(1, 'Price must be greater than 0')
                .required('Please enter the price'),

            vat: Yup.number().typeError('VAT must be a number'),

            discount: Yup.number().typeError('Discount must be a number'),
        })
    ),
});
// export const DaysSchema = Yup.object().shape({
//     data: Yup.array().of(
//         Yup.object().shape({
//             days: Yup.number()

//                 .required('Days are required')
//                 .min(1, 'Days must be at least 1')
//                 .max(365, 'Days cannot exceed 365'),
//         })
//     ),
// });

export const DaysSchema = Yup.object().shape({
    data: Yup.array().of(
        Yup.object().shape({
            days: Yup.string()
                .matches(/^\d+$/, 'Days must be a number')
                .required('Days are required')
                .test('is-not-zero', 'Days cannot be zero', value => Number(value) !== 0)
                .test('is-valid-number', 'Days cannot exceed 31', value => {
                    const num = Number(value);
                    return num >= 1 && num <= 31;
                }),
        })
    ),
});

export const emailvalidationSchema = Yup.object().shape({
    data: Yup.array().of(
        Yup.object().shape({
            templet: Yup.object().shape({
                email: Yup.object().shape({
                    subject: Yup.string().required('Subject is required'),
                    body: Yup.string().required('Email body is required'),
                }),
            }),
        })
    ),
});

export const customersSchema = Yup.object().shape({
    // name: Yup.string()
    //     .required('Please enter the customer name')
    //     .trim()
    //     .min(3, 'Customer name must be at least 3 characters'),
    name: Yup.string()
        .min(3, 'Customer name must be at least 3 characters ')
        .matches(/^[^\s].*$/, 'Customer name cannot start with a space')
        .required('Please enter the customer name'),
    email: Yup.string()
        .required('Please enter the email id')
        .matches(emailRegex, 'Please enter a valid email id')
        .matches(/^[^\s].*$/, 'Email ID cannot start with a space'),
    address: Yup.string()
        .required('Please enter the address')
        .trim()
        .min(3, 'Address must be at least 3 characters')

        .max(200, 'Maximum 200 characters are allowed')
        .test(
            'no-leading-whitespace',
            'Address cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Address cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Address cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ),
    phoneNumber: Yup.string()
        .required('Please enter the mobile number')
        .trim()

        .min(9, 'Mobile number must be atleast 9 digits')
        .max(12, 'Maximum 12 characters are allowed'),
    trnNo: Yup.string()
        .required('Please enter the TRN number')
        .trim()
        .min(10, 'TRN number must be atleast 10 digits')
        .max(15, 'Maximum 15 characters are allowed'),
});

export const paymentLinkSchema = Yup.object().shape({
    full_name: Yup.string()
        .min(3, 'Customer name must be at least 3 characters ')
        .required('Please enter the customer name')
        .test(
            'no-leading-whitespace',
            'Customer name cannot start with whitespace',
            value => !/^\s/.test(value) // Check if starts with whitespace
        )
        .test(
            'no-multiple-whitespace',
            'Customer name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Customer name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ),
    email: Yup.string()
        .email('Please enter a valid email id')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email id'
        )
        .required('Please enter the email id')
        .matches(/^[^\s].*$/, 'Email ID cannot start with a space'),
    expires_at: Yup.string().required('Please select the expiry date'),
    phone_number: Yup.string()
        .required('Please enter the mobile number')
        .trim()
        .min(9, 'Mobile number must be atleast 9 digits')
        .max(12, 'Maximum 12 characters are allowed'),
    amount: Yup.string()
        .required('Please enter the amount')
        .test('is-not-zero', 'Amount cannot be zero', value => Number(value) !== 0),
});

export const createSupplierSchema = Yup.object().shape({
    bankId: Yup.string()
        .required('Bank name is required.')
        .matches(/^[a-zA-Z0-9]+$/, 'Bank name must be alphanumeric.'),
    accountHolderName: Yup.string()
        .required('Please enter the account holder name')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Maximum 50 characters are allowed')
        .matches(/^[a-zA-Z\s]+$/, 'Please enter a valid name')
        .test(
            'no-leading-whitespace',
            'Name cannot start with whitespace',
            value => !/^\s/.test(value)
        )
        .test(
            'no-multiple-whitespace',
            'Name cannot contain consecutive whitespaces',
            value => !/\s{2,}/.test(value)
        ) // No consecutive spaces
        .test(
            'not-only-whitespace',
            'Name cannot be only whitespace',
            value => !/^\s*$/.test(value)
        ), // Not only whitespaces,
    accountNumber: Yup.string()
        .required('Please enter the account number')
        .min(15, 'Account number must be at least 15 characters'),
    ibanNumber: Yup.string()
        .required('Please enter the IBAN number')
        .matches(/^AE\d{2}\d{3}\d{16}$/, 'Please enter a valid IBAN starting with AE'),
});

const kybSupportedFileTypes = [
    'image/jpeg', // JPG, JPEG
    'image/png', // PNG
    'image/bmp', // BMP
    'image/gif', // GIF
    'application/pdf', // PDF
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'application/vnd.ms-excel', // XLS
];

export const kybDocumentsSchema = Yup.object().shape({
    tradeLicense: Yup.string().required('Trade license is required.'),

    articleOfAssociation: Yup.string().required('Article of association is required.'),

    emiratesID: Yup.string().required('Emirates ID is required.'),

    passportCopy: Yup.string().required('Passport copy is required.'),

    bankLetter: Yup.string().required('Bank letter is required.'),

    websiteLink: Yup.string()
        .required('Proof of business is required.')
        .url('Proof of business must be a valid URL.'),
});
