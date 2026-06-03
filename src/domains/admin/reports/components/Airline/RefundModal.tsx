import { Flex, Form } from 'antd';
import * as Yup from 'yup';

import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { Booking } from '../../types/airline';

type RefundModalModalProps = {
    open: boolean;
    handleCancel: () => void;
    handleRefresh: () => void;
    refundAmount: (payload: any) => Promise<boolean>;
    data: Booking;
    loading: boolean;
};

const RefundModal = ({
    open,
    data,
    loading,
    refundAmount,
    handleCancel,
    handleRefresh,
}: RefundModalModalProps) => {
    const dispatch = useAppDispatch();
    const totalFare = data?.order?.orderResponse?.data[0]?.fare?.totalFare || 0;
    return (
        <CustomModalWithForm
            modalTitle="Airline Refund"
            open={open}
            isLoading={loading}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                const result = await refundAmount({
                    amount: parseFloat(values.amount),
                    corporateTxnId: data?.corporateTxnId,
                });
                if (result) {
                    dispatch(
                        showToast({
                            description: 'Amount refunded successfully',
                            variant: 'success',
                        })
                    );
                    handleCancel();
                    handleRefresh();
                }
            }}
            initialValues={{
                amount: '',
            }}
            validationSchema={Yup.object().shape({
                amount: Yup.number()
                    .typeError('Amount must be a number')
                    .max(totalFare, `Refund amount cannot exceed total fare AED ${totalFare}`)
                    .test(
                        'is-decimal',
                        'Amount must be a valid number with up to 2 decimal places',
                        value => /^\d+(\.\d{1,2})?$/.test(value?.toString() || '')
                    )
                    .required('Refund amount is required'),
            })}
        >
            <Flex vertical className="w-full ">
                <Form layout="vertical">
                    <TextInput
                        name="amount"
                        label="Refund Amount"
                        type="text"
                        placeholder="Enter Refund Amount"
                        classes="rounded-sm"
                        allowTwoDecimalsOnly
                        maxLength={10}
                    />
                </Form>
            </Flex>
        </CustomModalWithForm>
    );
};

export default RefundModal;
