import * as Yup from 'yup';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const payrollGratuitySchema = Yup.object().shape({
    basicSalary: Yup.number().required('Please enter basic salary'),
    fromDate: Yup.string().required('Please enter first working day'),
    toDate: Yup.string().required('Please enter last working day'),
});
export const payrollOvertimeSchema = Yup.object().shape({
    employeeId: Yup.string().required('Please select an employee'),
    extraHours: Yup.number().required('Please enter extra hours'),
    overTimeDate: Yup.string().required('Please select over time date'),
    overTimeRate: Yup.number().required('Please enter over time rate'),
});
export const payrollIncentivesSchema = Yup.object().shape({
    employeeId: Yup.string().required('Please select an employee'),
    incentiveDate: Yup.string().required('Please select salary month'),
    monthlyTarget: Yup.number().required('Please enter monthly target'),
    achievedTarget: Yup.number().required('Please enter achieved target'),
    amount: Yup.number().required('Please enter incentives amount'),
});
export const payrollBonusSchema = Yup.object().shape({
    bonusDate: Yup.string().required('Please select bonus date'),
    type: Yup.string().required('Please select transfer method'),
    bonusPercentage: Yup.number().required('Please enter bonus percentage'),
    bonusAmount: Yup.number().required('Please enter bonus amount'),
});
export const payrollReimbursementSchema = Yup.object().shape({
    expenseDate: Yup.string().required('Please select your expense date'),
    managerEmail: Yup.string()
        .required('Please enter email')
        .matches(emailRegex, 'Enter valid email address'),
    expenseDetails: Yup.string().required('Please enter expense details'),
    totalPay: Yup.number().required('Please enter total pay'),
});
export const payrollIncrementSchema = Yup.object().shape({
    incrementPercentage: Yup.string().required('Please enter increment percentage'),
    incrementType: Yup.string().required('Please select transfer method'),
    incrementAmount: Yup.string().required('Please enter increment amount'),
    effectiveDate: Yup.string().required('Please select effective date'),
});
export const payrollDeductionSchema = Yup.object().shape({
    employeeId: Yup.string().required('Please select an employee'),
    deductionDate: Yup.string().required('Please choose a deduction date'),
    deductionType: Yup.string().required('Please enter deduction type'),
    deductionAmount: Yup.string().required('Please enter deduction amount'),
});
