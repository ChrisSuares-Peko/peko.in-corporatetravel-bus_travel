import * as Yup from 'yup';

export const estimateCalculatorSchema = Yup.object().shape({
    sourceCountry: Yup.string().required('Please select country name'),
    destinationCountry: Yup.string().required('Please select destination country'),
    deliveryMode: Yup.string().required('Please select delivery mode'),
    sourceAmount: Yup.string()
        .matches(/^[^\s].*$/, 'Amount cannot start with a space')
        .min(2, 'Amount must be at least 2 digit ')
        .required('Please enter amount'),
});
export const kybDetailsSchema = Yup.object().shape({
    icRegNumber: Yup.string().required('Please enter ic registration number'),
    companyName: Yup.string()
        .matches(/^[^\s].*$/, 'Company name cannot start with a space')
        .min(3, ' Company name must be at least 3 characters ')
        .required('Please enter company name'),
    tradeName: Yup.string()
        .matches(/^[^\s].*$/, 'Trade name cannot start with a space')
        .min(3, ' Trade name must be at least 3 characters ')
        .required('Please enter trade name'),
    legalStatus: Yup.string().required('Please select legal status'),
    otherLegalStatus: Yup.string().when('legalStatus', {
        is: 'other',
        then: schema =>
            schema
                .required('Please enter other legal status')
                .matches(/^[^\s].*$/, 'Other legal status cannot start with a space')
                .min(3, 'Other legal status must be at least 3 characters'),
        otherwise: schema => schema.notRequired(),
    }),
    natureOfBusiness: Yup.string()
        .matches(/^[^\s].*$/, 'Nature of business cannot start with a space')
        .min(3, ' Nature of business must be at least 3 characters ')
        .required('Please enter nature of business'),
    countryOfIncorporation: Yup.string().required('Please select country of incorporation'),
    dateOfIncorporation: Yup.date().required('Please enter date of incorporation').nullable(),
    TLNumber: Yup.string()
        .matches(/^[^\s].*$/, 'TL Number cannot start with a space')
        .min(3, 'TL Number must be at least 3 characters ')
        .required('Please enter TL number'),
    tlIssuingAuthority: Yup.string()
        .matches(/^[^\s].*$/, 'TL issuing authority name cannot start with a space')
        .min(3, 'TL issuing authority name must be at least 3 characters ')
        .required('Please enter TL issuing authority name'),
    expiryDateofTL: Yup.date().required('Please enter expiry date of TL').nullable(),
    VATTRN: Yup.string()
        .matches(/^[^\s].*$/, 'VAT / TRN cannot start with a space')
        .min(3, 'VAT / TRN must be at least 3 characters ')
        .required('Please enter VAT / TRN'),
    tradeLicense: Yup.string().required('Please upload trade license copy'),
    poBox: Yup.string().required('Please enter po box / zip code'),
    buildingName: Yup.string()
        .matches(/^[^\s].*$/, 'Building name cannot start with a space')
        .min(3, 'Building name must be at least 3 characters ')
        .required('Please enter building name'),
    streetName: Yup.string()
        .matches(/^[^\s].*$/, 'Street name cannot start with a space')
        .min(3, 'Street name must be at least 3 characters ')
        .required('Please enter street name'),
    city: Yup.string()
        .matches(/^[^\s].*$/, 'City cannot start with a space')
        .min(3, 'City must be at least 3 characters ')
        .required('Please enter city'),
    country: Yup.string().required('Please select country'),
    offWebsite: Yup.string()
        .matches(/^[^\s].*$/, 'Official website cannot start with a space')
        .min(3, 'Official website must be at least 3 characters ')
        .required('Please enter official website'),
    offEmail: Yup.string()
        .email('Please enter a valid email id')
        .matches(
            /^(?!\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email id'
        )
        .max(40, 'Email id must be at most 40 characters')
        .required('Please enter the email id'),
    contactPersonName: Yup.string()
        .matches(/^[^\s].*$/, 'Contact person name cannot start with a space')
        .min(3, 'Contact person name must be at least 3 characters ')
        .required('Please enter contact person name'),
    phoneNumber: Yup.string()
        .min(9, 'Phone number must be at least 9 characters')
        .required('Please enter phone number'),
});

export const ownerDetailsSchema = Yup.object().shape({
    owners: Yup.array()
        .of(
            Yup.object().shape({
                ownerName: Yup.string().required('Owner name is required'),
                nationality: Yup.string().required('Owner nationality is required'),
                id: Yup.string().required('Owner National ID/Passport No. is required'),
                designation: Yup.string().required('Owner designation is required'),
                percentageShares: Yup.number()
                    .required('Owner percentage of shares is required')
                    .min(0, 'Percentage of shares must be at least 0')
                    .max(100, 'Percentage of shares cannot exceed 100'),
                document: Yup.mixed().required('Please upload id copy'),
            })
        )
        .min(1, 'At least one owner is required'),
    authorizedPersonName: Yup.string()
        .required('Authorized person name is required')
        .matches(/^[^\s].*$/, 'Authorized person name cannot start with a space'),
    authorizedPersonNationality: Yup.string().required('Authorized person nationality is required'),
    authorizedPersonID: Yup.string()
        .required('Authorized person ID is required')
        .matches(/^[^\s].*$/, 'Authorized person ID cannot start with a space'),
    hasPresenceInIranOrNorthKorea: Yup.boolean().required('This field is required'),
});
