import React, { useEffect, useMemo, useState } from 'react';

import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import OtpModal from '@components/molecular/modals/OtpModal';
import { Scope } from '@src/enums/enums';
import { useAppSelector } from '@src/hooks/store';

import BankForm from './forms/BankForm';
import { getBankOtp } from '../api/bank';
import useBankAccountTypes from '../hooks/useBankAccountTypes';
import useBankApi from '../hooks/useBankApi';
import { bankSchema } from '../schema';
import { AddBankRequestPayload, BankDetail } from '../types';

interface BankModalProps {
    open: boolean;
    handleCancel: () => void;
}

const BankModal = ({ open, handleCancel }: BankModalProps) => {
    const { id, role } = useAppSelector(state => state.reducer.auth);
    const { id: itemId, tableData } = useAppSelector(state => state.reducer.bank);
    const { accountTypeList } = useBankAccountTypes();
    const [isOtpSending, setIsOtpSending] = useState(false);
    const { handleAddBank, handleUpdateBank, refresh, isEditLoading } = useBankApi({
        handleCancel,
        handleOtpClose: () => setIsOpen(false),
    });
    const [currentBank, setCurrentBank] = useState<BankDetail | null>(null);
    const [formValues, setFormValues] = useState<AddBankRequestPayload>();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (itemId && itemId > 0) {
            const selected = tableData.find(item => item.id === itemId);
            setCurrentBank(selected!);
        } else {
            setCurrentBank(null);
        }
    }, [setCurrentBank, itemId, tableData]);

    const initialValues = useMemo(
        () => ({
            accountHolderName: currentBank?.accountHolderName ?? '',
            bankName: currentBank?.bankName ?? '',
            accountNumber: currentBank?.accountNumber ?? '',
            bankAddress: currentBank?.bankAddress ?? '',
            iban: currentBank?.iban ?? '',
            swiftCode: currentBank?.swiftCode ?? '',
            accountType: currentBank?.accountType ?? undefined,
            default: currentBank?.default === 1 ? true : false || false,
        }),
        [currentBank]
    );

    return (
        <>
            <CustomModalWithForm
                modalTitle="Bank Account"
                open={open}
                handleCancel={handleCancel}
                validationSchema={bankSchema}
                handleFormSubmit={async values => {
                    setFormValues(values);

                    const resp = await getBankOtp({
                        userId: id,
                        userType: role,
                        scope: Scope.EMAIL,
                        iban: values.iban,
                        accountNumber: values.accountNumber,
                        // ...(itemId && { selectedId: itemId }),
                        selectedId: itemId || '',
                    });
                    if (resp) {
                        setIsOpen(true);
                    }
                }}
                initialValues={initialValues}
                reinitialise
            >
                <BankForm
                    refresh={refresh}
                    isOtpOpen={isOpen}
                    accountTypesList={accountTypeList!}
                />
            </CustomModalWithForm>
            <OtpModal
                isOpen={isOpen}
                isLoading={isEditLoading!}
                handleCancel={() => setIsOpen(false)}
                isOtpSending={isOtpSending}
                onResend={async () => {
                    setIsOtpSending(true);
                    const res = await getBankOtp({
                        userId: id,
                        userType: role,
                        scope: Scope.EMAIL,
                        iban: formValues?.iban!,
                        accountNumber: formValues?.accountNumber!,
                        ...(itemId && { selectedId: itemId }),
                    });
                    if (res) setIsOtpSending(false);
                    else setIsOtpSending(false);
                }}
                handleSubmit={otp => {
                    if (itemId && itemId > 0) {
                        handleUpdateBank({
                            ...formValues!,
                            otp,
                            credentialId: id.toString(),
                            userType: role,
                            scope: Scope.EMAIL,
                            userId: id,
                            id: itemId,
                        });
                    } else {
                        handleAddBank({
                            ...formValues!,
                            otp,
                            credentialId: id.toString(),
                            userType: role,
                            scope: Scope.EMAIL,
                            userId: id,
                        });
                    }
                }}
                title="Confirmation"
            />
        </>
    );
};

export default BankModal;
