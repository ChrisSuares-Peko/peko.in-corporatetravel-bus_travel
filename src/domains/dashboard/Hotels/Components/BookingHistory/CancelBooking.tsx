import { useState } from 'react';

import { Button, Divider, Flex, Modal, Spin, Typography, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';

import OtpModal from '@components/molecular/modals/OtpModal';
import { Scope } from '@src/enums/enums';
import { useAppSelector } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { getotp } from '../../Api';
import useBookingCancelApi from '../../hooks/useBookingCancelApi';
import { CancellationData } from '../../types/cancellationTypes';

interface modalProps {
    cId: string;
    BookingId: string;
    isModalOpen: boolean;
    handleCancel: () => void;
    charges: CancellationData;
    baseAmt: number;
    refetch?: any;
    isLoading?: boolean;
}

const CancelBooking = ({
    BookingId,
    cId,
    isModalOpen,
    handleCancel,
    charges,
    baseAmt,
    refetch,
    isLoading,
}: modalProps) => {
    const { id, role } = useAppSelector(state => state.reducer.auth);
    const [isOpen, setIsOpen] = useState(false);

    const amount = parseInt(baseAmt.toString(), 10).toFixed(2);
    const [isOtpSending, setIsOtpSending] = useState(false);

    const refundAmount =
        baseAmt - (charges[0]?.cancellationCharge[0]?.totalCancellationCharges ?? baseAmt);
    const { cancelBooked, loader } = useBookingCancelApi();
    const handleCancelBooked = async () => {
        setIsOtpSending(true);

        // await cancelBooked(BookingId, cId);
        // handleCancel();
        // refetch();
        // setIsOtpSending(true);
        const resp = await getotp({
            userId: id,
            userType: role,
            scope: Scope.EMAIL,
        });
        if (resp) {
            setIsOtpSending(false);
            setIsOpen(true);
        } else {
            setIsOtpSending(false);
        }
    };

    const {
        token: { colorPrimary },
    } = theme.useToken();
    return (
        <>
            <Modal
                title="Confirm Cancellation"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Divider />
                <Spin className="w-full" spinning={isLoading}>
                    <Content className="px-4">
                        <Typography.Text className="font-medium text-lg">
                            Cancellation Charges
                        </Typography.Text>
                        <Typography.Paragraph className="mt-5">
                            Are you sure you want to cancel this booking? This action cannot be
                            undone.
                        </Typography.Paragraph>
                        <Flex justify="space-between" className="mt-5 px-3">
                            <Typography.Text>Total Amount you paid</Typography.Text>
                            <Typography.Text>
                                AED {formatNumberWithLocalString(amount)}
                            </Typography.Text>
                        </Flex>
                        <Flex justify="space-between" className="mt-5 px-3">
                            <Typography.Text>Supplier Cancellation Charges</Typography.Text>
                            <Typography.Text data-testid="supplier">
                                AED{' '}
                                {formatNumberWithLocalString(
                                    charges[0]?.cancellationCharge[0]?.supplierCancellationCharge
                                )}
                            </Typography.Text>
                        </Flex>
                        <Flex justify="space-between" className="mt-5 px-3">
                            <Typography.Text>Admin Cancellation Charges</Typography.Text>
                            <Typography.Text data-testid="admin">
                                AED{' '}
                                {formatNumberWithLocalString(
                                    charges[0]?.cancellationCharge[0]?.adminCancellationCharge || 0
                                )}
                            </Typography.Text>
                        </Flex>
                        <Flex justify="space-between" className="mt-5 px-3">
                            <Typography.Text>Total Cancellation Charges</Typography.Text>
                            <Typography.Text data-testid="total">
                                AED{' '}
                                {formatNumberWithLocalString(
                                    charges[0]?.cancellationCharge[0]?.totalCancellationCharges
                                )}
                            </Typography.Text>
                        </Flex>
                        <Divider />
                        <Flex justify="space-between" className="mt-5 px-3">
                            <Typography.Text className="font-medium">
                                Amount will be refunded
                            </Typography.Text>
                            <Typography.Text data-testid="amount" className="font-medium">
                                AED {formatNumberWithLocalString(refundAmount)}
                            </Typography.Text>
                        </Flex>
                        <Flex className="py-3">
                            <Typography.Text>
                                Note: Your money will be credited within 7-10 business days
                            </Typography.Text>
                        </Flex>
                        <Flex justify="end">
                            <Button
                                size="middle"
                                className="px-5 w-36 rounded-md mt-3"
                                onClick={handleCancelBooked}
                                style={{ backgroundColor: colorPrimary, color: 'white' }}
                                loading={isOtpSending}
                            >
                                Cancel Booking
                            </Button>
                        </Flex>
                    </Content>
                </Spin>
            </Modal>
            <OtpModal
                isOpen={isOpen}
                isLoading={loader!}
                handleCancel={() => setIsOpen(false)}
                isOtpSending={isOtpSending}
                onResend={async () => {
                    setIsOtpSending(true);
                    const res = await getotp({
                        userId: id,
                        userType: role,
                        scope: Scope.EMAIL,
                    });
                    setIsOtpSending(false);
                }}
                handleSubmit={async otp => {
                    const scope = Scope.EMAIL;

                    const result = await cancelBooked(BookingId, cId, otp, scope);
                    if (result) {
                        setIsOpen(false);

                        handleCancel();
                        refetch();
                    }
                }}
                title="Confirmation"
            />
        </>
    );
};

export default CancelBooking;
