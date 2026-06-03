import React, { useEffect, useRef, useState } from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Drawer, Flex, Typography } from 'antd';
import { Formik, FormikProps } from 'formik';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import OtpModal from '@components/molecular/modals/OtpModal';
import useHideWidgetOnDrawer from '@src/components/molecular/freshChat/hooks/useHideWidgetOnDrawer';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import useGetBeneficiaries from '../../hooks/beneficiary/useBeneficiaryApis';
import { generateBeneficiarySchema } from '../../schema';
import { BeneficiaryModalProps, BeneficiaryActionType, BeneficiaryFormValues } from '../../types';
import BeneficiaryForm from '../forms/BeneficiaryForm';

const BeneficiaryModal: React.FC<BeneficiaryModalProps> = ({
    open,
    onCancel,
    closeAddModal,
    editValues,
    beneficiaryActionType,
    setBeneficiaryActionType,
    accesskeyValue,
}) => {
    const { id, role } = useAppSelector(state => state.reducer.auth);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [formValues, setFormValues] = useState<BeneficiaryFormValues>();
    const beneficiaryForm = useRef<FormikProps<any>>(null);
    const dispatch = useAppDispatch();
    const [selectedProvider, setSelectedProvider] = useState('');
    const {
        buttonLoader,
        sendOtpApi,
        addBeneficiary,
        updateBeneficicary,
        deleteBeneficicary,
        isOtpSending,
    } = useGetBeneficiaries({
        accesskey: accesskeyValue,
        openOtpModal: () => setShowOtpModal(true),
        closeOtpModal: () => setShowOtpModal(false),
        closeConfirmationModal: () => setOpenConfirmationModal(false),
        closeAddModal,
        formRefName: beneficiaryForm,
    });
    const initialValues = {
        name: editValues?.name || '',
        accountNo: editValues?.accountNo || '',
        accessKey: editValues?.accessKey || '',
        optional1: editValues?.optional1 || '',
    };
    const { ADD, EDIT, DELETE } = BeneficiaryActionType;
    const handleFormSubmit = async (values: BeneficiaryFormValues) => {
        const valuesAreSame = JSON.stringify(values) === JSON.stringify(initialValues);
        if (valuesAreSame) {
            dispatch(
                showToast({
                    description: 'Please change some values before submitting.',
                    variant: 'error',
                })
            );
            return;
        }
        if (values.accessKey) {
            setFormValues(values);
        } else {
            setFormValues({ ...values, accessKey: accesskeyValue! });
        }
        if (editValues) {
            setBeneficiaryActionType(EDIT);
            await sendOtpApi(EDIT, { ...values, beneficiaryId: editValues.id });
            return;
        }
        await sendOtpApi(ADD, values);
    };
    useEffect(() => {
        if (editValues) {
            setSelectedProvider(editValues.accessKey);
        } else {
            setSelectedProvider('');
        }
    }, [editValues]);

    useHideWidgetOnDrawer(open);
    return (
        <>
            <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={handleFormSubmit}
                innerRef={beneficiaryForm}
                validationSchema={generateBeneficiarySchema(accesskeyValue || selectedProvider)}
            >
                {formikBag => {
                    const onClickSubmit = (e: React.MouseEvent<HTMLElement>) => {
                        e.preventDefault();
                        formikBag.handleSubmit();
                    };
                    return (
                        <>
                            <Drawer
                                title={
                                    <>
                                        <Flex justify="space-between">
                                            <Typography.Text className="font-medium">
                                                {beneficiaryActionType !== ADD ? 'Edit' : 'Add'}{' '}
                                                Beneficiary Details
                                            </Typography.Text>
                                            {beneficiaryActionType !== ADD && (
                                                <DeleteOutlined
                                                    className="text-xl text-bgOrange2"
                                                    onClick={() => setOpenConfirmationModal(true)}
                                                />
                                            )}
                                        </Flex>
                                        <Typography.Text className="text-textGrey font-normal text-xs sm:text-md">
                                            This will help you to process the payment quickly
                                        </Typography.Text>
                                    </>
                                }
                                open={open}
                                onClose={() => {
                                    onCancel();
                                    formikBag.resetForm();
                                }}
                                closeIcon={null}
                                width={470}
                                styles={{
                                    body: { paddingInline: 20, paddingBlock: 16 },
                                    header: { paddingInline: 20 },
                                }}
                                zIndex={20}
                                footer={[
                                    <Flex className="w-full " justify="flex-end" gap={10} key="">
                                        <Button
                                            key="submit"
                                            type="primary"
                                            danger
                                            loading={formikBag.isSubmitting}
                                            onClick={onClickSubmit}
                                            className="px-5"
                                        >
                                            Submit
                                        </Button>

                                        <Button
                                            key="back"
                                            onClick={() => {
                                                onCancel();
                                                formikBag.resetForm();
                                            }}
                                            className="px-5"
                                        >
                                            Cancel
                                        </Button>
                                    </Flex>,
                                ]}
                                maskClosable={false}
                            >
                                <BeneficiaryForm
                                    accesskeyValue={accesskeyValue}
                                    selectedProvider={selectedProvider}
                                    setSelectedProvider={setSelectedProvider}
                                />
                            </Drawer>
                            <OtpModal
                                isOpen={showOtpModal}
                                isLoading={buttonLoader!}
                                handleCancel={() => setShowOtpModal(false)}
                                onResend={() => sendOtpApi(beneficiaryActionType, formikBag.values)}
                                isOtpSending={isOtpSending}
                                handleSubmit={async otp => {
                                    if (beneficiaryActionType === ADD) {
                                        addBeneficiary({
                                            userId: id,
                                            userType: role,
                                            ...formValues,
                                            isActive: true,
                                            credentialId: id.toString(),
                                            scope: 'email',
                                            otp,
                                        });
                                    } else if (beneficiaryActionType === EDIT) {
                                        updateBeneficicary({
                                            id: editValues?.id,
                                            userId: id,
                                            userType: role,
                                            ...formValues,
                                            isActive: true,
                                            credentialId: id.toString(),
                                            scope: 'email',
                                            otp,
                                        });
                                    } else if (beneficiaryActionType === DELETE) {
                                        const resp = await deleteBeneficicary({
                                            userId: id,
                                            userType: role,
                                            id: editValues?.id,
                                            scope: 'email',
                                            otp,
                                        });
                                        if (resp) setBeneficiaryActionType(EDIT);
                                    }
                                }}
                                title="OTP Verification"
                            />
                        </>
                    );
                }}
            </Formik>
            <ConfirmationModal
                isOpen={openConfirmationModal}
                handleCancel={() => setOpenConfirmationModal(false)}
                title="Are you sure you want to delete this beneficiary ?"
                handleSubmit={async () => {
                    sendOtpApi(DELETE);
                    setBeneficiaryActionType(DELETE);
                }}
                isLoading={isOtpSending!}
            />
        </>
    );
};
export default BeneficiaryModal;
