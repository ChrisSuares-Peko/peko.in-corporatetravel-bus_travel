import * as Yup from 'yup';

export const SalikSchema = (minRechargeAmount = 0, maxRechargeAmount = Number.MAX_SAFE_INTEGER) => {
    const multipleOf = 50;
    const min = 5;
    const max = 10;
    return Yup.object().shape({
        accountNumber: Yup.string()
            .matches(/^[0-9]+$/, 'Only alphanumeric characters are allowed')
            .min(min, `Account number must be ${min}-${max} digits`)
            .max(max, 'Account number cannot exceed 10 digits')
            .required('Please enter a valid account number'),

        accountPin: Yup.string()
            .length(4, 'Account PIN must be exactly 4 digits')
            .required('Please enter a valid account pin'),

        rechargeAmount: Yup.number()
            .required('Please enter a valid top-up amount')
            .typeError('Top-up amount must be a number')
            .min(
                minRechargeAmount,
                `Amount must be greater than or equal to AED ${minRechargeAmount}`
            )
            .max(maxRechargeAmount, `Amount must be less than or equal to AED ${maxRechargeAmount}`)
            .test('multipleOf', `Amount should be a multiple of ${multipleOf}`, value => {
                if (value != null) {
                    return value % multipleOf === 0;
                }
                return true;
            }),
    });
};
