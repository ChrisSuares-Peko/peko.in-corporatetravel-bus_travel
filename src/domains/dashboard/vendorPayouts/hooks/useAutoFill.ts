import { useEffect } from 'react';

interface BankDetailsValues {
    bankCode: string;
    [key: string]: any;
}

interface BankBranch {
    bankCode: string;
    bankName: string;
    bankAddress1: string;
    bankAddress2: string;
}

type SetFieldValueFunction = (field: string, value: any, shouldValidate?: boolean) => void;

const useAutoFill = (
    values: BankDetailsValues,
    bankBranches: BankBranch[],
    setBankName: (name: string) => void,
    setFieldValue: SetFieldValueFunction
) => {
    useEffect(() => {
        if (values.bankCode) {
            const selectedBranch = bankBranches.find(
                (branch: BankBranch) => branch.bankCode === values.bankCode
            );
            if (selectedBranch) {
                setBankName(selectedBranch.bankName);
                setFieldValue('bankName', selectedBranch.bankName);
                setFieldValue(
                    'bankAddress',
                    `${selectedBranch.bankAddress1}, ${selectedBranch.bankAddress2}`
                );
            }
        }
    }, [values.bankCode, bankBranches, setBankName, setFieldValue]);
};

export default useAutoFill;
