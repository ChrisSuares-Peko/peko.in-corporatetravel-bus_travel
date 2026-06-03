import * as Yup from 'yup';

export const payrollSettingsSchema = Yup.object().shape({
    organizationWorkingDays: Yup.number().required('Please select total working days'),
    salaryCycleDay: Yup.number().required('Please select a day'),
    payrollStartsFrom: Yup.date().required('Please choose your payroll start date'),
    hrManagerName: Yup.string()
        .required('Please enter your name')
        .min(3, 'HR name must be atleast 3 characters'),
    establishmentId: Yup.string()
        .matches(/^[0-9]{12}$/, 'Establishment ID must be a 12-digit number')
        .required('Please enter your Establishment ID'),
    // selectedWeekdaysCount: Yup.number().required('Please select total working days in a week'),
    selectedWeekdaysCount: Yup.array()
        .of(Yup.number().required('Please select weekdays'))
        .min(1, 'Please select at least one weekday')
        .required('Please select the working week days'),
    companyOfficialStamp: Yup.string().required('Please upload your company stamp'),
    hrManagerSignature: Yup.string().required('Please upload your signature'),
});

export const leaveSummarySchema = Yup.object().shape({
    annualLeave: Yup.number()
        .typeError('Enter a number')
        .required('Annual leave is required')
        .min(0, 'Annual leave cannot be negative'),
    sickLeave: Yup.number().typeError('Enter a number').min(0, 'Sick leave cannot be negative'),
    parentalLeave: Yup.number()
        .typeError('Enter a number')
        .min(0, 'Parental leave cannot be negative'),
    sabbaticalLeave: Yup.number()
        .typeError('Enter a number')
        .min(0, 'Sabbatical leave cannot be negative'),
    studyLeave: Yup.number().typeError('Enter a number').min(0, 'Study leave cannot be negative'),
    HajjAndUmrahLeave: Yup.number()
        .typeError('Enter a number')
        .min(0, 'Hajj and Umrah leave cannot be negative'),
    maternityLeave: Yup.number()
        .typeError('Enter a number')
        .min(0, 'Maternity leave cannot be negative'),
    officialLeavesAndVacations: Yup.number()
        .typeError('Enter a number')
        .min(0, 'Official leaves and vacations cannot be negative'),
    otherPaidLeaves: Yup.number()
        .typeError('Enter a number')
        .min(0, 'Other paid leaves cannot be negative'),
    eligibilityTimePeriod: Yup.number()
        .typeError('Enter a number')
        .min(0, 'Eligibility time period cannot be negative'),
});

export const wpsSettingsSchema = (isFreeZoneCompany: boolean) => {
    if (isFreeZoneCompany) {
        return null;
    }

    return Yup.object().shape({
        employerId: Yup.string()
            .min(3, 'Employer ID must be at least 3 characters')
            .required('Please enter employer ID'),
        employerRoutingCode: Yup.string()
            .min(3, 'Employer routing code must be at least 3 characters')
            .required('Please enter employer routing code'),
        employerReference: Yup.string()
            .min(3, 'Employer reference must be at least 3 characters')
            .required('Please enter employer reference'),
    });
};

export const addOnSchema = Yup.object().shape({
    addonQuantity: Yup.string().required('Please enter the no.of additional employees'),
});
