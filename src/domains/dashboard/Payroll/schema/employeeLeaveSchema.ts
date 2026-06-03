import * as Yup from 'yup';

export const leaveSchema = Yup.object().shape({
    employeeId: Yup.string().required('Please select a employee'),
    typeOfLeave: Yup.string().required('Please select a type of leave'),
    // leaveCount: Yup.string().required('Please enter duration of leave'),
    leaveCount: Yup.number()
        .required('Please enter duration of leave')
        .moreThan(0, 'Leave count must be greater than zero'),
    start: Yup.string().required('Please choose leave start date'),
    end: Yup.string().required('Please choose leave end date'),
    leaveSupportingDocs: Yup.string(),
});
