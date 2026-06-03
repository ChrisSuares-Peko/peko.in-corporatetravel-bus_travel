import { useState } from 'react';

import { Flex, Form } from 'antd';

import CustomSelectSearch from '@components/atomic/inputs/CustomSelectSearch';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import OtpModal from '@components/molecular/modals/OtpModal';
import { commonSelectType } from '@customtypes/general';
import { Scope } from '@src/enums/enums';

import { useGetOtpApi } from '../../hooks/useGetOtpGiftcardUpdate';
import useGiftCardsAutoUpdate from '../../hooks/useGiftCardAuto';
import { giftCardStatusUpdateSchema } from '../../schema/giftCards';
import { GiftCardsBody } from '../../types/giftCards';
import { actionTypes } from '../../utils/giftCards';

type DepartmentModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: GiftCardsBody;
    handleRefresh: () => void;
    vendorData: commonSelectType[];
};

const AutoUpdateModal = ({
    open,
    handleCancel,
    data,
    handleRefresh,
    vendorData,
}: DepartmentModalProps) => {
    const { isLoading, handleGiftCardsAutoUpdate, handleGiftCardsAutoUpdateStatus } =
        useGiftCardsAutoUpdate();
    const [isOtpSending, setIsOtpSending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [formValues, setFormValues] = useState<any>(null);
    const { fetchOtp } = useGetOtpApi();

    const handleOtpSubmit = async (otp: string) => {
        const res = await handleGiftCardsAutoUpdateStatus({
            ...formValues,
            otp,
            scope: Scope.EMAIL,
        });
        if (res) {
            handleCancel();
            handleRefresh();
        }
    };

    return (
        <>
            <CustomModalWithForm
                modalTitle="Gift Card Management"
                open={open}
                isLoading={isLoading}
                handleCancel={handleCancel}
                validationSchema={giftCardStatusUpdateSchema}
                handleFormSubmit={async values => {
                    let result;
                    if (values.status === 'update') {
                        result = await handleGiftCardsAutoUpdate(values);
                    } else {
                        setFormValues(values);
                        const resp = await fetchOtp();
                        if (resp) {
                            setIsOpen(true);
                        }
                    }

                    if (result) {
                        handleCancel();
                        handleRefresh();
                    }
                }}
                initialValues={{
                    serviceOperatorId: '',
                    status: 'update',
                }}
            >
                <Flex vertical className="w-full ">
                    <Form layout="vertical">
                        <CustomSelectSearch
                            name="serviceOperatorId"
                            label="Vendor"
                            placeholder="Select Vendor"
                            isRequired
                            classes="rounded-sm"
                            options={vendorData}
                        />

                        <CustomSelectSearch
                            name="status"
                            label="Action"
                            placeholder="Select Action"
                            isRequired
                            classes="rounded-sm"
                            options={actionTypes}
                        />
                    </Form>
                </Flex>
            </CustomModalWithForm>

            {/* OTP Modal */}
            <OtpModal
                isOpen={isOpen}
                isLoading={isLoading}
                handleCancel={() => setIsOpen(false)}
                isOtpSending={isOtpSending}
                onResend={async () => {
                    setIsOtpSending(true);
                    await fetchOtp();
                    setIsOtpSending(false);
                }}
                handleSubmit={otp => {
                    handleOtpSubmit(otp);
                }}
                title="OTP Confirmation"
            />
        </>
    );
};

export default AutoUpdateModal;
