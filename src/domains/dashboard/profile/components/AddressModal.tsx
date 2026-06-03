import { useEffect, useMemo, useState } from 'react';

import { useDispatch } from 'react-redux';

import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import OtpModal from '@components/molecular/modals/OtpModal';
import { Scope } from '@src/enums/enums';
import { useAppSelector } from '@src/hooks/store';

import AddressForm from './forms/AddressForm';
import { getAddressOtp } from '../api/address';
import useAddressesApi from '../hooks/useAddressesApi';
import useAddressTypes from '../hooks/useAddressTypes';
import { addressSchema } from '../schema';
import { setData } from '../slices/address';
import { AddressDetail } from '../types';

interface AddressModalProps {
    open: boolean;
    handleCancel: () => void;
}

const AddressModal = ({ open, handleCancel }: AddressModalProps) => {
    const { addressTypesList } = useAddressTypes();
    const { id, role } = useAppSelector(state => state.reducer.auth);
    const { id: itemId, tableData } = useAppSelector(state => state.reducer.address);
    const { handleAddAddress, refresh, handleUpdateAddress, isLoading } = useAddressesApi({
        handleCancel,
    });
    const [currentAddress, setCurrentAddress] = useState<AddressDetail | null>(null);
    const [isOtpSending, setIsOtpSending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [formValues, setFormValues] = useState<any>();
    const dispatch = useDispatch();
    useEffect(() => {
        if (itemId && itemId > 0) {
            const selected = tableData.find(item => item.id === itemId);
            setCurrentAddress(selected!);
        } else {
            setCurrentAddress(null);
        }
    }, [setCurrentAddress, itemId, tableData, refresh]);

    const initialValues = useMemo(
        () => ({
            addressType: currentAddress?.addressType ?? undefined,
            name: currentAddress?.name ?? '',
            addressLine1: currentAddress?.addressLine1 ?? '',
            addressLine2: currentAddress?.addressLine2 ?? '',
            phoneNumber: currentAddress?.phoneNumber ?? '',
            default: currentAddress?.default === 1 ? true : false || false,
        }),
        [currentAddress]
    );
    return (
        <>
            <CustomModalWithForm
                modalTitle="Address"
                open={open}
                handleCancel={handleCancel}
                reinitialise
                handleFormSubmit={async values => {
                    setFormValues(values);
                    dispatch(setData({ isLoading: true }));
                    let resp;
                    if (itemId && itemId > 0) {
                        resp = await getAddressOtp({
                            userId: id,
                            userType: role,
                            scope: Scope.EMAIL,
                            method: 'update',
                            selectedId: itemId || '',
                        });
                    } else {
                        resp = await getAddressOtp({
                            userId: id,
                            userType: role,
                            scope: Scope.EMAIL,
                            selectedId: itemId || '',
                        });
                    }
                    if (resp) {
                        setIsOpen(true);
                    }
                    dispatch(setData({ isLoading: false }));
                }}
                validationSchema={addressSchema}
                initialValues={initialValues}
            >
                <AddressForm addressTypesList={addressTypesList!} refresh={refresh} />
            </CustomModalWithForm>
            <OtpModal
                isOpen={isOpen}
                isLoading={isLoading}
                handleCancel={() => setIsOpen(false)}
                isOtpSending={isOtpSending}
                onResend={async () => {
                    setIsOtpSending(true);
                    if (itemId && itemId > 0) {
                        await getAddressOtp({
                            userId: id,
                            userType: role,
                            scope: Scope.EMAIL,
                            method: 'update',
                        });
                    } else {
                        await getAddressOtp({
                            userId: id,
                            userType: role,
                            scope: Scope.EMAIL,
                        });
                    }
                    setIsOtpSending(false);
                }}
                handleSubmit={async otp => {
                    dispatch(setData({ isLoading: true }));
                    if (itemId && itemId > 0) {
                        await handleUpdateAddress({
                            ...formValues,
                            credentialId: id,
                            userType: role,
                            id: itemId,
                            otp,
                            scope: Scope.EMAIL,
                        });
                    } else {
                        await handleAddAddress({
                            ...formValues,
                            credentialId: id,
                            userType: role,
                            otp,
                            scope: Scope.EMAIL,
                        });
                    }
                    dispatch(setData({ isLoading: false }));
                }}
                title="Confirmation"
            />
        </>
    );
};

export default AddressModal;
