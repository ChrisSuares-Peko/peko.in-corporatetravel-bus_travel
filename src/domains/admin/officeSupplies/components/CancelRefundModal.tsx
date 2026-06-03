import { useState } from 'react';

import { Flex, Form, Typography } from 'antd';

import CustomSelectSearch from '@components/atomic/inputs/CustomSelectSearch';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import OtpModal from '@components/molecular/modals/OtpModal';
import GetProducts from '@src/domains/systemUser/ecom_manager/home/utils/GetProducts';
import { Scope } from '@src/enums/enums';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { formattedDateTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';
import formatString from '@utils/wordFormat';

import { getOtpEcommerce } from '../api/order';
import useCancelRefundUpdate from '../hooks/useCancelRefundUpdate';
import { UpdateOrderRequestPayload } from '../types/types';
import {
    allowedCancellationStatus,
    CancellationStatusOptions,
    PaymentStatusOptions,
} from '../utils/data';

type DepartmentModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: any;
    handleRefresh: () => void;
};

const CancelRefundModal = ({ open, handleCancel, data, handleRefresh }: DepartmentModalProps) => {
    const { id, role } = useAppSelector(state => state.reducer.auth);
    const orderData = JSON.parse(data.orderResponse);
    const [formValues, setFormValues] = useState<UpdateOrderRequestPayload>();
    const [isOpen, setIsOpen] = useState(false);
    const [isOtpSending, setIsOtpSending] = useState(false);
    const [resetOtp, setResetOtp] = useState(false);
    const dispatch = useAppDispatch();

    const { isLoading, handleUpdateOrder } = useCancelRefundUpdate({
        handleCancel,
        handleOtpClose: () => setIsOpen(false),
        handleResetOtp: () => setResetOtp(!resetOtp),
    });
    const refunded = data.status === 'REFUNDED';

    return (
        <>
            <CustomModalWithForm
                modalTitle="Order Cancel Management"
                open={open}
                isLoading={isLoading}
                handleCancel={handleCancel}
                handleFormSubmit={async values => {
                    setFormValues(values);
                    if (!allowedCancellationStatus.includes(values?.workspaceOrderStatus)) {
                        dispatch(
                            showToast({
                                variant: 'error',
                                description:
                                    "Cancellation status must be 'Cancel rejected' or 'Cancel approved'.",
                            })
                        );
                        return;
                    }
                    const resp = await getOtpEcommerce({
                        userId: id,
                        userType: role,
                    });
                    if (resp) {
                        setIsOpen(true);
                    }
                }}
                initialValues={{
                    corporateTxnId: data?.corporateTxnId || '',
                    paymentStatus: data?.status || '',
                    workspaceOrderStatus: refunded
                        ? 'Cancel Approved'
                        : data?.workspaceOrderStatus || '',
                }}
            >
                <Flex vertical className="w-full ">
                    <Flex vertical className="mb-3">
                        <Typography.Text className="pb-1 text-base font-medium">
                            Products :
                        </Typography.Text>
                        <GetProducts orderResponse={data.orderResponse} />
                    </Flex>
                    <Flex vertical className="mb-3">
                        <Typography.Text className="pb-1 text-base font-medium">
                            Customer Name :
                        </Typography.Text>
                        <Typography.Text>{data?.credential?.name}</Typography.Text>
                    </Flex>
                    <Flex vertical className="mb-3">
                        <Typography.Text className="pb-1 text-base font-medium">
                            Order Date :
                        </Typography.Text>
                        <Typography.Text>
                            {formattedDateTime(new Date(data?.transactionDate))}
                        </Typography.Text>
                    </Flex>
                    <Flex vertical className="mb-3">
                        <Typography.Text className="pb-1 text-base font-medium">
                            Amount :
                        </Typography.Text>
                        <Typography.Text>
                            {formatNumberWithLocalString(data?.amountInAed)}
                        </Typography.Text>
                    </Flex>
                    <Flex vertical className="mb-3">
                        8
                        <Typography.Text className="pb-1 text-base font-medium">
                            Payment Method :
                        </Typography.Text>
                        <Typography.Text>{formatString(data?.paymentMode)}</Typography.Text>
                    </Flex>
                    <Flex vertical className="mb-3">
                        <Typography.Text className="pb-1 text-base font-medium">
                            Reason for Cancellation :
                        </Typography.Text>
                        <Typography.Text>{orderData?.cancelReason}</Typography.Text>
                    </Flex>
                    <Flex vertical className="mb-3">
                        <Typography.Text className="pb-1 text-base font-medium">
                            Cancellation Details :
                        </Typography.Text>
                        <Typography.Text>{orderData?.cancelDescription}</Typography.Text>
                    </Flex>
                    <Flex vertical className="mb-3">
                        <Typography.Text className="pb-1 text-base font-medium">
                            Delivery Status :
                        </Typography.Text>
                        <Typography.Text>{formatString(data?.ecomOrderStatus)}</Typography.Text>
                    </Flex>
                    <Form layout="vertical">
                        <CustomSelectSearch
                            name="workspaceOrderStatus"
                            label="Cancellation Status"
                            placeholder="Select Cancellation Status"
                            isRequired
                            options={CancellationStatusOptions}
                            classes="rounded-sm"
                            showSearch={false}
                            isDisabled={data.status === 'REFUNDED'}
                        />
                        <CustomSelectSearch
                            name="paymentStatus"
                            label="Payment Status"
                            placeholder="Select Payment Status"
                            isRequired
                            options={PaymentStatusOptions}
                            classes="rounded-sm"
                            showSearch={false}
                            isDisabled={data.status === 'REFUNDED'}
                        />
                    </Form>
                </Flex>
            </CustomModalWithForm>
            <OtpModal
                isOpen={isOpen}
                isLoading={isLoading!}
                handleCancel={() => setIsOpen(false)}
                isOtpSending={isOtpSending}
                onResend={async () => {
                    setIsOtpSending(true);
                    const res = await getOtpEcommerce({
                        userId: id,
                        userType: role,
                    });
                    if (res) setIsOtpSending(false);
                    else setIsOtpSending(false);
                }}
                handleSubmit={otp => {
                    handleUpdateOrder({
                        ...formValues!,
                        otp,
                        scope: Scope.EMAIL,
                        userId: id,
                        userType: role,
                    }).then(res => {
                        if (res) {
                            setIsOpen(false);
                            setResetOtp(!resetOtp);
                            handleRefresh();
                        }
                    });
                }}
                title="Confirmation"
                resetOtp={resetOtp}
            />
        </>
    );
};

export default CancelRefundModal;
