import { capitalize } from 'lodash';
import * as Yup from 'yup';

import { accessKeys } from '@utils/accessKeys';

import { InputComponentsType } from '../types';
import { findObjectByAccessKey } from '../utils/data';

export const generateYupSchema = (
    inputComponents: InputComponentsType[] | undefined,
    minRechargeAmount: number = 0,
    maxRechargeAmount: number = Number.MAX_SAFE_INTEGER
) => {
    const yupObject: any = {};
    inputComponents?.forEach(field => {
        const { label, max, min, name, multipleOf, type, supportAlphabets } = field;
        const fieldName = name;
        const fieldLabel = label;

        if (type === 'input') {
            if (fieldName === 'accountNumber') {
                yupObject[fieldName] = Yup.string()
                    .matches(
                        /^[a-zA-Z0-9.]+$/,
                        `Only numbers ${supportAlphabets ? 'and alphabets' : ''}  are allowed`
                    )
                    .min(
                        min,
                        `${fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1).toLowerCase()} must be ${
                            min === max
                                ? `${min} ${supportAlphabets ? 'characters' : 'digits'}`
                                : `${min}-${max} ${supportAlphabets ? 'characters' : 'digits'}`
                        }`
                    )
                    .max(max, `${fieldLabel} Cannot exceed ${max} digits`)
                    .required(`Please enter a valid ${fieldLabel.toLocaleLowerCase()}`);
            } else if (fieldName === 'accountPin') {
                yupObject[fieldName] = Yup.string()
                    .required(`Please enter a valid ${fieldLabel.toLowerCase()}`)
                    .min(4, 'Account PIN must be exactly 4 digits');
            } else if (fieldName === 'rechargeAmount') {
                yupObject[fieldName] = Yup.number()
                    .required(`Please enter a valid ${fieldLabel.toLocaleLowerCase()} `)
                    .typeError(`${fieldLabel} must be a valid number`)
                    // .integer('Must be a whole number')
                    .min(
                        minRechargeAmount,
                        `Amount should be greater than or equal to AED ${minRechargeAmount}`
                    )
                    .max(
                        maxRechargeAmount,
                        `Amount should be less than or equal to AED ${maxRechargeAmount}`
                    )
                    .test('multipleOf', `Amount should be a multiple of ${multipleOf}`, value => {
                        if (field.multipleOf) {
                            return value % field.multipleOf === 0;
                        }
                        return true;
                    });
            } else if (fieldName === 'plateNumber') {
                yupObject[fieldName] = Yup.string()
                    .min(10, 'Traffic number must be at least 10 characters')
                    .required('Please enter the traffic number');
            } else if (fieldName === 'eid') {
                yupObject[fieldName] = Yup.string()
                    .min(15, 'Emirates ID must be 15 characters')
                    .required('Please enter Emirates ID');
            }
        } else if (type === 'select') {
            if (fieldName === 'serviceType') {
                yupObject[fieldName] = Yup.string().required(`Please select the service type`);
            }
        }
    });
    return Yup.object().shape(yupObject);
};

export const generateBeneficiarySchema = (accessKey: string) => {
    const item = findObjectByAccessKey(accessKey)?.inputComponents.find(
        obj => obj.name === 'accountNumber'
    );

    let yupObject: any = Yup.object().shape({
        name: Yup.string()
            .min(3, 'Beneficiary name must have at least 3 characters')
            .max(40, "Beneficiary name can't exceed 40 characters")
            .required('Please enter the beneficiary name')
            .test(
                'no-leading-whitespace',
                'Beneficiary name cannot start with whitespace',
                value => !/^\s/.test(value) // Check if starts with whitespace
            )
            .test(
                'no-multiple-whitespace',
                'Beneficiary name cannot contain consecutive whitespaces',
                value => !/\s{2,}/.test(value)
            ) // No consecutive spaces
            .test(
                'not-only-whitespace',
                'Beneficiary name cannot be only whitespace',
                value => !/^\s*$/.test(value)
            ), // Not only whitespaces,
        accountNo: Yup.string()
            .required(
                `Please enter a valid  ${item?.label.toLowerCase() || 'mobile number/account number'}`
            )
            .min(
                item?.min || 5,
                item?.min === item?.max
                    ? ` ${capitalize(item?.label) || 'Mobile number/Account number'} must be ${item?.max || 5} characters`
                    : ` ${capitalize(item?.label) || 'Mobile number/Account number'} must be at least ${item?.min || 5} characters`
            )
            .max(
                item?.max || 15,
                ` ${capitalize(item?.label) || 'Mobile number/Account number'} can't exceed ${item?.max || 15} digits `
            ),
    });

    if (!accessKey) {
        yupObject = yupObject.shape({
            accessKey: Yup.string().required('Please select a service provider'),
        });
    }

    if (accessKey === accessKeys.Salik) {
        yupObject = yupObject.shape({
            optional1: Yup.string()
                .required('Please enter a valid account pin')
                .matches(/^\d{4}$/, 'Account PIN must be exactly 4 digits'),
        });
    }
    if (accessKey === accessKeys.etisalatPostpaid) {
        yupObject = yupObject.shape({
            optional1: Yup.string().required('Please select the service type'),
        });
    }
    if (accessKey === accessKeys.darb) {
        yupObject = yupObject.shape({
            optional1: Yup.string()
                .min(15, 'Emirates ID must be at most 15 characters')
                .required('Please enter Emirates ID'),
        });
    }
    return yupObject;
};

export const etisalatPostpaidSchema = Yup.object().shape({
    serviceType: Yup.string().required('Please select the service type'),
    accountNumber: Yup.string()
        .trim()
        .required('Please enter a valid mobile number')
        .min(8, 'Mobile number must be 8-10 digits')
        .max(10, 'Account Number Cannot exceed 10 digits'),
});

export const etisalatBulkModalSchema = Yup.object().shape({
    name: Yup.string().required('Please enter the beneficiary name'),
    optional1: Yup.string().required('Please select the service type'),
    accountNo: Yup.string()
        .trim()
        .required('Please enter a valid mobile number')
        .min(7, 'Mobile number must be 8-10 digits')
        .max(10, 'Account Number Cannot exceed 10 digits'),
});
