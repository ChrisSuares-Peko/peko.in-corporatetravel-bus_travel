import * as Yup from 'yup';

import { Step } from '../types/types'; // Adjust the import path as needed

export const getValidationSchema = (stepData: Step) => {
    const yupObject: any = {};

    stepData.questionAnswers.forEach((item, index) => {
        const { questionText, isRequired, questionType } = item;

        const fieldName = `answer_${index}`;

        // Handle required vs optional fields
        if (isRequired) {
            switch (questionType) {
                case 'text':
                    // Validation for text fields
                    yupObject[fieldName] = Yup.string()
                        .trim() // Removes whitespace from start and end
                        .required(`${questionText} is required`);
                    break;

                case 'number':
                    // Validation for number fields
                    yupObject[fieldName] = Yup.number()
                        .typeError(`${questionText} must be a valid number`)
                        .required(`${questionText} is required`)
                        .nullable(); // Allows null values if it's optional
                    break;

                case 'select':
                    // Validation for select dropdowns
                    yupObject[fieldName] = Yup.string().required(
                        `Please select a valid option for ${questionText}`
                    );
                    break;

                case 'radio':
                    // Validation for radio buttons
                    yupObject[fieldName] = Yup.string().required(
                        `Please select an option for ${questionText}`
                    );
                    break;

                case 'checkbox':
                    // Validation for checkbox groups
                    yupObject[fieldName] = Yup.array()
                        .min(1, `Please select at least one option for ${questionText}`)
                        .required(`${questionText} is required`);
                    break;

                default:
                    // Fallback for any other types
                    yupObject[fieldName] = Yup.mixed().required(`${questionText} is required`);
                    break;
            }
        } else {
            // Optional fields (Allow empty values)
            switch (questionType) {
                case 'text':
                    yupObject[fieldName] = Yup.string().trim(); // Allows empty strings for optional text fields
                    break;

                case 'number':
                    yupObject[fieldName] = Yup.number().nullable(); // Allows null or empty for optional numbers
                    break;

                case 'select':
                    yupObject[fieldName] = Yup.string().nullable(); // Allows null for optional select fields
                    break;

                case 'radio':
                    yupObject[fieldName] = Yup.string().nullable(); // Allows null for optional radio buttons
                    break;

                case 'checkbox':
                    yupObject[fieldName] = Yup.array().nullable(); // Allows null for optional checkbox groups
                    break;

                default:
                    yupObject[fieldName] = Yup.mixed().nullable(); // Fallback for other optional fields
                    break;
            }
        }
    });

    // Return the Yup object schema
    const schema = Yup.object().shape(yupObject);
    console.log('🚀 ~ getValidationSchema ~ schema:', schema);
    return schema;
};
export const Step1Schema = Yup.object().shape({
    clientName: Yup.string().required('Client Name is required'),
    period: Yup.string().required('Period is required'),
});

export const Step2Schema = Yup.object().shape({
    tradeLicenceName: Yup.string().required('Trade Licence Name is required'),
    tradeLicenceNumber: Yup.string().required('Trade Licence Number is required'),
    tradeLicenseAuthority: Yup.string().required('Trade License Authority is required'),
    emailAddress: Yup.string()
        .required('Email address is required')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:,[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/,
            'Please enter a valid email id'
        ),
    ownerNameAndShares: Yup.array()
        .of(
            Yup.object().shape({
                ownerName: Yup.string().required("Owner's Name is required"),
                ownerShares: Yup.number()
                    .required("Owner's Share is required")
                    .min(0, "Owner's Share must be a positive number")
                    .max(100, "Owner's Share cannot be greater than 100"),
            })
        )
        .min(1, 'At least one owner is required'),
    contactNumber: Yup.string().required('Contact number is required'),
    officeRegisteredAddress: Yup.string().required('Office Registered Address is required'),
    financialYearStartDate: Yup.date().nullable().required('Financial Year Start Date is required'),
    financialYearEndDate: Yup.date().required('Financial Year End Date is required'),
    revenueEarnedPrevFY: Yup.number().required('Revenue for FY 2022 is required').positive(),
    authorizedPersonName: Yup.string().required('Name of authorized person is required'),
    uaeEntityShareResident: Yup.number()
        .required("UAE entity's share in UAE resident company is required")
        .positive(),
    uaeEntityShareForeign: Yup.number()
        .required("UAE entity's share in foreign resident company is required")
        .positive(),
    connectedPartiesTradeLicenses: Yup.string().required(
        'Trade licenses of Connected parties is required'
    ),
});
export const Step3Schema = Yup.object().shape({
    numberOfEmployees: Yup.string()
        .required('Number of employees is required')
        .min(1, 'Must be at least 1 employee'),
    outsourcedActivity: Yup.string().required('Outsourced activity is required'),
    serviceProviderFee: Yup.string()
        .required('Service provider fee is required')
        .min(0, 'Service provider fee must be a positive number'),
    serviceProviderLocation: Yup.string().required('Service provider location is required'),
    minutesOfBODMeeting: Yup.string()
        .required('Minutes of BOD meeting are required')
        .min(1, 'Minutes must be at least 1'),
    numberOfBODMeetingsUAE: Yup.string()
        .required('Number of BOD meetings in UAE is required')
        .min(1, 'Must be at least 1 meeting'),
    totalExpenditureinPrevFY: Yup.number().required('Total Expenditure is required'),
    qualificationOfEmployees: Yup.string().required('Qualification of employees is required'),
    numberOfBODMeetingsinPrevFY: Yup.string()
        .required('Number of of BOD meeting in Previous FY is required')
        .min(1, 'Must be at least 1 meeting'),
});

export const Step4Schema = Yup.object().shape({
    acceptingDeposits: Yup.string().required('Please select an option for Accepting Deposits'),
    makingInvestments: Yup.string().required(
        'Please select an option for Making of investments for the account and at the risk of the Licensee.'
    ),
    advancingLoans: Yup.string().required(
        'Please select an option for Advancing Loans or arranging overdraft'
    ),
    currencyExchanges: Yup.string().required(
        'Please select an option for Providing Currency Exchanges,money transfer services, marketing licensed financial activities'
    ),
    bankingLicense: Yup.string().required(
        'Please select an option for Banking & Financial license by the following regulators'
    ),
    takingHedgingPosition: Yup.string().required(
        'Please select an option for Taking Hedging Position'
    ),
    managingCapitalAdequacy: Yup.string().required(
        'Please select an option for Managing & Testing Capital Adequacy'
    ),
    raisingFunds: Yup.string().required('Please select an option for Raising Funds'),
    incomeFromRoyalties: Yup.string().required(
        'Please select an option for Income Coming from Royalties'
    ),
    franchiseIncome: Yup.string().required('Please select an option for Any Franchise Income'),
    incomeFromIntangibleAssets: Yup.string().required(
        'Please select an option for Income From Licensing Intangible Assets'
    ),
    incomeFromCapitalGains: Yup.string().required(
        'Please select an option for Income From Capital gains of IP'
    ),
    expertCompetency: Yup.string().required(
        'Please select an option for Competency & Experience of Experts/employees developing the IP'
    ),
    controlOverResearch: Yup.string().required(
        'Please select an option for Degree of control over research & Development happening in UAE'
    ),
    inhouseDevelopedIP: Yup.string().required('Please select an option for Inhouse developed IP'),
    purchasedIPFromGroup: Yup.string().required(
        'Please select an option for IP Purchased from a group company'
    ),
    soldIPToGroup: Yup.string().required('Please select an option for IP Sold to a group company'),
    decisionsByNonResidentDirectors: Yup.string().required(
        'Please select an option for Periodic Decisions by non resident directors for high risk IP'
    ),
    incomeFromDividends: Yup.string().required(
        'Please select an option for Do Licensee earn Income From Dividends of Equity interest'
    ),
    incomeFromCapitalGainsEquity: Yup.string().required(
        'Please select an option for Do Licensee earn Income from capital gain of Equity Interest'
    ),
    equityInterestHolding: Yup.string().required(
        'Please select an option for Holding of equity interest only'
    ),
    realEstateInterest: Yup.string().required(
        'Please select an option for Do Licensee holds interest in real estate'
    ),
    incomeFromBonds: Yup.string().required(
        'Please select an option for Do Licensee earn Income from Bonds,Govt securities'
    ),
    reportToRegulatoryAuthorities: Yup.string().required(
        'Please select an option for Do Licensee Report to Regulatory authorities'
    ),
    groupPosition: Yup.string().required('Please select an option for Licensees Group position'),
    servicesToGroupMembers: Yup.string().required(
        'Please select an option for Any Services (IT or HR)provided to group members inside or outside UAE with or without fee'
    ),
    seniorManagementServices: Yup.string().required(
        'Please select an option for Do Licensee provide senior management services to group companies ( Foreign or local)'
    ),
    strategicPlansForGroup: Yup.string().required(
        'Please select an option for Do licensee provide strategic plans to group companies ( foreign or local) and exercise control with or without fee'
    ),
    anyITorHRServicesToGroupMembers: Yup.string().required(
        'Please select an option for Any Services (IT or HR)provided to group members inside or outside UAE with or without fee'
    ),
    investmentFund: Yup.string().required(
        'Please select an option for Do licensee has any investment fund?'
    ),
    investmentAdvisoryServices: Yup.string().required(
        'Please select an option for Investment advisory services inside or outside UAE'
    ),
    fundAdministrationServices: Yup.string().required(
        'Please select an option for Fund administration services'
    ),
    fundManagementServices: Yup.string().required(
        'Please select an option for Do Licensee provide Investment fund management services ( decision related to divestment, investment, risk related decisions on behalf of foreign or domestic funds)'
    ),
    hedgingOnInvestments: Yup.string().required(
        'Please select an option for Taking Hedging Position on investment risks'
    ),
    reportOnInvestments: Yup.string().required(
        'Please select an option for Do licensee prepare reports to Regulatory bodies on investment'
    ),
    riskReservesCalculation: Yup.string().required(
        'Please select an option for Do licensee calculate Risk & Reserves'
    ),
    interestBearingLoanFacilities: Yup.string().required(
        'Please select an option for Do licensee offer loans in consideration of interest & processing fee)'
    ),
    hirePurchaseAgreements: Yup.string().required(
        'Please select an option for Do licensee offer hire purchase agreements in relation to assets other than loan.'
    ),
    assetsToBeLeased: Yup.string().required(
        'Please select an option for Do licensee identify assets to be acquired to be leased?'
    ),
    incomeFromCapitalGainsOnLoans: Yup.string().required(
        'Please select an option for Do licensee earn income from capital gains upon conversion of loans into share capital or late payment penalties'
    ),
    termsAndDurationOfLease: Yup.string().required(
        'Please select an option for Do licensee set the terms and duration of any finance lease?'
    ),
    interestBearingLoanFacilitiesToGroupMembers: Yup.string().required(
        'Please select an option for Do licensee provide any of interest bearing loan facilities to group member?'
    ),
    goodsPurchasedFromForeignConnectedPersons: Yup.string().required(
        'Please select an option for Do licensee purchased goods ( components, Items for resale) from Foreign connected person'
    ),
    importsAndStorageInState: Yup.string().required(
        'Please select an option for Do licensee imports and store in the state?'
    ),
    administrationToForeignConnectedPersons: Yup.string().required(
        'Please select an option for Do licensee provide administration & to foreign connected persons outside UAE'
    ),
    consent: Yup.boolean().oneOf([true], 'You must accept the terms and conditions.'),
});

export const Step5Schema = Yup.object().shape({
    isFiledPreviously: Yup.string().required('Please select an option.'),

    dualLicense: Yup.string().when('isFiledPreviously', (isFiledPreviously, schema) =>
        isFiledPreviously[0] === 'yes'
            ? schema.required('Please select an option.')
            : schema.notRequired()
    ),

    licenseeName: Yup.string()
        .matches(/^[a-zA-Z\s]*$/, 'Licensee Name must only contain letters.')
        .when('isFiledPreviously', (isFiledPreviously, schema) =>
            isFiledPreviously[0] === 'yes'
                ? schema.required('Licensee Name is required.')
                : schema.notRequired()
        ),

    commercialLicensePermitNumber: Yup.string()
        .matches(/^[a-zA-Z0-9]*$/, 'Commercial License/Permit Number must be alphanumeric.')
        .when('isFiledPreviously', (isFiledPreviously, schema) =>
            isFiledPreviously[0] === 'yes'
                ? schema.required('Commercial License/Permit Number is required.')
                : schema.notRequired()
        ),

    licensingAuthority: Yup.string().when('isFiledPreviously', (isFiledPreviously, schema) =>
        isFiledPreviously[0] === 'yes'
            ? schema.required('Licensing Authority is required.')
            : schema.notRequired()
    ),

    mainRegulatoryAuthority: Yup.string().when('isFiledPreviously', (isFiledPreviously, schema) =>
        isFiledPreviously[0] === 'yes'
            ? schema.required('Primary/Main Regulatory Authority is required.')
            : schema.notRequired()
    ),

    reportingRelevantActivity: Yup.string().when(
        'isFiledPreviously',
        (isFiledPreviously, schema) =>
            isFiledPreviously[0] === 'yes'
                ? schema.required('Relevant Activity is required.')
                : schema.notRequired()
    ),

    tradeLiscenseNo: Yup.string().when('isFiledPreviously', (isFiledPreviously, schema) =>
        isFiledPreviously[0] === 'yes'
            ? schema.required('Trade license number is required.')
            : schema.notRequired()
    ),

    licensingAuthorityNoOfbranch: Yup.string().when(
        'isFiledPreviously',
        (isFiledPreviously, schema) =>
            isFiledPreviously[0] === 'yes'
                ? schema.required('Licensing authority name is required.')
                : schema.notRequired()
    ),
});
export const Step6Schema = Yup.object().shape({
    uboGeneralInfo: Yup.string().required('UBO General Info is required'),
    uboList: Yup.array()
        .of(
            Yup.object().shape({
                uboType: Yup.string().required('UBO Type is required'),
                name: Yup.string().required('Name is required'),
                taxIdentificationNumber: Yup.string().required(
                    'Tax Identification Number is required'
                ),
                address: Yup.string().required('Address is required'),
                countryOfTaxResidence: Yup.string().required('Country of Residence is required'),
            })
        )
        .when('uboGeneralInfo', (uboGeneralInfo, schema) => {
            console.log('🚀 ~ .when ~ uboGeneralInfo:', uboGeneralInfo);
            // Checking explicitly that uboGeneralInfo is 'yes'
            if (uboGeneralInfo[0] === 'yes') {
                return schema
                    .min(1, 'At least one UBO is required')
                    .required('UBO List is required');
            }
            return schema.notRequired();
        }),
});
export const Step7Schema = Yup.object().shape({
    contactPersonName: Yup.string()
        .required('Name is required')
        .matches(/^[a-zA-Z\s]*$/, 'Only alphabets are allowed for this field'),
    designation: Yup.string()
        .required('Designation is required')
        .matches(/^[a-zA-Z\s]*$/, 'Only alphabets are allowed for this field'),
    phone: Yup.string()
        .required('Phone number is required')
        .trim()
        .min(9, 'Phone number must be at least 9 digits')
        .max(10),
    email: Yup.string()
        .required('Email is required')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:,[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/,
            'Please enter a valid email id'
        ),
    selfDeclaration: Yup.boolean()
        .oneOf([true], 'Please verify to continue')
        .required('Please verify to continue'),
});
export const Stage2Step1Schema = Yup.object().shape({
    fled_penalty: Yup.string().required(
        'Please select an option for Have you fled previously or been issued a penalty for failure to file?'
    ),

    dualLicense: Yup.string().required('Please select an option for Did you have a dual license?.'),

    licenseeName: Yup.string()
        .required('Licensee Name is required.')
        .matches(/^[a-zA-Z\s]*$/, 'Licensee Name must only contain letters.'),

    commercialLicensePermitNumber: Yup.string()
        .required('Commercial License/Permit Number is required.')
        .matches(/^[a-zA-Z0-9]*$/, 'Commercial License/Permit Number must be alphanumeric.'),

    licensingAuthority: Yup.string().required('Licensing Authority is required.'),

    mainRegulatoryAuthority: Yup.string().required(
        'Primary/Main Regulatory Authority is required.'
    ),

    placeOfEstablishment: Yup.string().required('Place of Establishment is required.'),

    registeredOfficeAddress: Yup.string().required('Registered office address is required.'),

    registeredOfficeCity: Yup.string()
        .required('Registered office city is required.')
        .matches(/^[a-zA-Z\s]*$/, 'Registered Office City must only contain letters.'),

    registeredOfficeCountry: Yup.string()
        .required('Registered office country is required.')
        .matches(/^[a-zA-Z\s]*$/, 'Registered Office Country must only contain letters.'),

    legalForm: Yup.string().required('Legal Form is required.'),

    vatRegistrationInUAE: Yup.string().required(
        'Please select an option for Is the license registered for VAT in the UAT?'
    ),
});
export const Stage2Step2Schema = Yup.object().shape({
    reportingRelevantActivity: Yup.string().required('Relevant activity is required'),
    branchDetails: Yup.array()
        .of(
            Yup.object().shape({
                commercialLicensePermitNumber: Yup.string().required(
                    'Commercial Licence/Trade License/Permit No. is required'
                ),
                licensingAuthority: Yup.string().required('Licensing authority is required'),
            })
        )
        .min(1, 'At least one branch detail is required'),
});
export const Stage2Step3Schema = Yup.object().shape({
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date must be after start date'),
});
export const Stage2Step4Schema = Yup.object().shape({
    relevantActivityReported: Yup.string().required(
        'Please select an option for Did the Licensee carry on a Relevant Activity (as defined under Article 4 of the Economic Substance Regulations) during the Reportable Period?'
    ),
    relevantActivities: Yup.array().min(1, 'Please select at least one relevant activity.'),
    incomeEarned: Yup.string().required(
        'Please select an option for Did the Licensee earn income from the Relevant Activity during the Reportable Period?'
    ),
    incomeTaxOutsideUAE: Yup.string().required(
        'Is the income earned from the Relevant Activity subject to tax outside the UAE?'
    ),
    regulatoryAuthority: Yup.string().required('Regulatory Authority (RA) is required.'),
    answeredNoToAll2B: Yup.string().required('This field is required.'),
    highRiskIPLicensee: Yup.string().required('This field is required.'),
});

export const Stage2Step5Schema = Yup.object().shape({
    ConfirmExemptedLicensee: Yup.string().required('The Applicable Exemption is required'),
    confirm1A: Yup.string().required('This field is required'),
    confirm1B: Yup.string().required('This field is required'),
    confirm1C: Yup.string().required('This field is required'),
    confirm1D: Yup.string().required('This field is required'),
    confirm1E: Yup.string().required('This field is required'),
});

export const Stage2Step6Schema = Yup.object().shape({
    parentCompany: Yup.object().shape({
        name: Yup.string().required('Name is required'),
        taxIdentificationNumber: Yup.string().required('Tax Identification Number is required'),
        address: Yup.string().required('Address is required'),
        countryOfTaxResidence: Yup.string().required('Country Of Residence is required'),
    }),
    ultimateParentCompany: Yup.object().shape({
        name: Yup.string().required('Name is required'),
        taxIdentificationNumber: Yup.string().required('Tax Identification Number is required'),
        address: Yup.string().required('Address is required'),
        countryOfTaxResidence: Yup.string().required('Country of Residence is required'),
    }),
    uboGeneralInfo: Yup.string().required(''),
    uboList: Yup.array().of(
        Yup.object().shape({
            uboType: Yup.string().required('UBO Type is required'),
            name: Yup.string().required('Name is required'),
            taxIdentificationNumber: Yup.string().required('Tax Identification Number is required'),
            address: Yup.string().required('Address is required'),
            countryOfTaxResidence: Yup.string().required('Country of Residence'),
        })
    ),
});
export const Stage2Step7Schema = Yup.object().shape({
    contactPersonName: Yup.string()
        .required('Name is required')
        .matches(/^[a-zA-Z\s]*$/, 'Only alphabets are allowed for the name'),
    designation: Yup.string()
        .required('Designation is required')
        .matches(/^[a-zA-Z\s]*$/, 'Only alphabets are allowed for the designation'),
    phone: Yup.string()
        .required('Phone number is required')
        .trim()
        .min(9, 'Phone number must be at least 9 digits')
        .max(10),
    email: Yup.string()
        .required('Email is required')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:,[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/,
            'Please enter a valid email id'
        ),
});
