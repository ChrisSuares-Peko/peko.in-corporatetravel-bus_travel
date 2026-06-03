import * as Yup from 'yup';

export const plateDetailSchema = Yup.object().shape({
    searchType: Yup.string().required(),
    plateNumber: Yup.string()
        .min(5, 'Plate number must be at most 5 characters')
        .required('Please enter the plate number'),
    plateSource: Yup.string().required('Please select the plate source'),
    plateCategory: Yup.string().required('Please select the plate category'),
    plateCode: Yup.string().required('Please select the plate code'),
});

export const licenseDetailSchema = Yup.object().shape({
    searchType: Yup.string().required(),
    licenseNo: Yup.string().required('Please enter the license number'),
    licenseFrom: Yup.string().required('Please enter the license source'),
});

export const ticketDetailSchema = Yup.object().shape({
    searchType: Yup.string().required(),
    beneficiaryName: Yup.string().required('Please enter the beneficiary name'),
    ticketNumber: Yup.string().required('Please enter the ticket number'),
    ticketYear: Yup.string().required('Please select the ticket year'),
});

export const tcNumberDetailSchema = Yup.object().shape({
    searchType: Yup.string().required(),
    plateNumber: Yup.string().required('Please enter the traffic file number'),
});
