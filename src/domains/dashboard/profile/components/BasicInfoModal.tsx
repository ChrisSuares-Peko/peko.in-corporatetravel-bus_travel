import { Suspense, lazy, useMemo, useState } from 'react';

import { Flex, Typography } from 'antd';

import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import OtpModal from '@components/molecular/modals/OtpModal';
import { Scope } from '@src/enums/enums';
import { useAppSelector } from '@src/hooks/store';
import useScreenSize from '@src/hooks/useScreenSize';

import BasicInfoForm from './forms/BasicInfoForm';
import MobileOtpModal from './MobileOtpModal';
import { getOtp, getOtpSms } from '../api/general';
import useBasicInfoApi from '../hooks/useBasicInfoApi';
import useCompanySizes from '../hooks/useCompanySizes';
import useCountries from '../hooks/useCountries';
import useGetPasswordPolicies from '../hooks/useGetPasswordPolicies';
import usePasswordPolicyValidation from '../hooks/usePasswordPolicyValidation';
import { basicInfoSchema } from '../schema';
import { UpdateBasicInfoRequestPayload } from '../types';

const ChangerPasswordModal = lazy(() => import('./ChangePasswordModal'));

interface BasicInfoModalProps {
    open: boolean;
    handleCancel: () => void;
}

const BasicInfoModal = ({ open, handleCancel }: BasicInfoModalProps) => {
    const { data } = useAppSelector(state => state.reducer.basicInfo);
    const { id, role } = useAppSelector(state => state.reducer.auth);
    const { countriesList } = useCountries();
    const { companySizesList } = useCompanySizes();
    const [isOtpSending, setIsOtpSending] = useState(false);
    const { handleUpdateBasicInfo, isEditLoading } = useBasicInfoApi({
        handleCancel,
        handleOtpClose: () => setIsOpen(false),
    });
    const [formValues, setFormValues] = useState<UpdateBasicInfoRequestPayload>();
    const [isOpen, setIsOpen] = useState(false);
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
    const [changingPhoneNumber, setChangingPhoneNumber] = useState(false);
    const { respData } = useGetPasswordPolicies();
    const { validatePassword } = usePasswordPolicyValidation(respData);
    const { lg } = useScreenSize();
    const initialValues = useMemo(
        () => ({
            name: data?.name ?? '',
            contactPersonName: data?.contactPersonName ?? '',
            mobileNo: data?.mobileNo ?? '',
            email: data?.email ?? '',
            designation: data?.designation ?? '',
            city: data?.city ?? '',
            country: data?.country ?? undefined,
            companySize: data?.companySize ?? undefined,
            landlineNo: data?.landlineNo ?? '',
            profileImageBase: data?.logo ?? '',
        }),
        [data]
    );

    return (
        <>
            <CustomModalWithForm
                modalTitle="Basic Information"
                open={open}
                handleCancel={handleCancel}
                validationSchema={basicInfoSchema}
                handleFormSubmit={async values => {
                    let resp;
                    setFormValues(values);
                    if (JSON.stringify(initialValues) === JSON.stringify(values))
                        return handleCancel();
                    if (data?.mobileNo !== values.mobileNo) {
                        setChangingPhoneNumber(true);
                        resp = await getOtpSms({
                            userId: id,
                            userType: role,
                        });
                    } else {
                        setChangingPhoneNumber(false);
                        resp = await getOtp({
                            userId: id,
                            userType: role,
                        });
                    }
                    if (resp) {
                        setIsOpen(true);
                    }
                    return undefined;
                }}
                initialValues={initialValues}
                reinitialise
            >
                <BasicInfoForm
                    companySizesList={companySizesList!}
                    countriesList={countriesList!}
                />
                {!lg && (
                    <Flex>
                        <Typography.Text
                            className="text-brandColor cursor-pointer"
                            onClick={() => setOpenChangePasswordModal(true)}
                        >
                            Change Password
                        </Typography.Text>
                    </Flex>
                )}
            </CustomModalWithForm>
            {changingPhoneNumber ? (
                <MobileOtpModal
                    isOpen={isOpen}
                    isLoading={isEditLoading!}
                    handleCancel={() => setIsOpen(false)}
                    isOtpSending={isOtpSending}
                    onResend={async () => {
                        setIsOtpSending(true);
                        const res = await getOtp({
                            userId: id,
                            userType: role,
                        });
                        if (res) setIsOtpSending(false);
                        else setIsOtpSending(false);
                    }}
                    handleSubmit={otp => {
                        handleUpdateBasicInfo({
                            ...formValues!,
                            otp,
                            scope: Scope.MOBILE,
                            userId: id,
                            userType: role,
                        });
                    }}
                    title="Confirmation"
                />
            ) : (
                <OtpModal
                    isOpen={isOpen}
                    isLoading={isEditLoading!}
                    handleCancel={() => setIsOpen(false)}
                    isOtpSending={isOtpSending}
                    onResend={async () => {
                        setIsOtpSending(true);
                        const res = await getOtp({
                            userId: id,
                            userType: role,
                        });
                        if (res) setIsOtpSending(false);
                        else setIsOtpSending(false);
                    }}
                    handleSubmit={otp => {
                        handleUpdateBasicInfo({
                            ...formValues!,
                            otp,
                            scope: Scope.EMAIL,
                            userId: id,
                            userType: role,
                        });
                    }}
                    title="Confirmation"
                />
            )}

            <Suspense>
                {openChangePasswordModal && (
                    <ChangerPasswordModal
                        validatePassword={validatePassword}
                        open={openChangePasswordModal}
                        handleCancel={() => setOpenChangePasswordModal(false)}
                    />
                )}
            </Suspense>
        </>
    );
};

export default BasicInfoModal;
