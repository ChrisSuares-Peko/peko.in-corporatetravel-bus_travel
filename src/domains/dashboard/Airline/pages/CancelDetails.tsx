import { useState } from 'react';

import { Button, Form, Col, Flex, Row, Skeleton } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import TextAreaInput from '@components/atomic/inputs/TextAreaInput';
import OtpModal from '@components/molecular/modals/OtpModal';
import { Scope } from '@src/enums/enums';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import { getotp } from '../api';
import CancellationPolicy from '../components/CancelDetails/CancellationPolicy';
import HeadDetails from '../components/CancelDetails/HeadDetails';
import useCancelTicket from '../hooks/useCancelBooking';
import { cancellationSchema } from '../schema/ReceiverDetailsSchema';

const CancelDetails = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id, role } = useAppSelector(state => state.reducer.auth);
    const { HandleCancelTicket, isLoading, cancellationCharges, cancelLoading } = useCancelTicket();
    const orderDetails = useAppSelector(state => state.reducer.airline.orderDetails);
    const [isOpen, setIsOpen] = useState(false);
    const [isOtpSending, setIsOtpSending] = useState(false);
    const [formValues, setFormValues] = useState<any>();

    const handleCancellation = async (otp: string) => {
        const { corporateTxnId, orderResponse } = orderDetails;
        const { meta, data } = orderResponse;
        const res = await HandleCancelTicket({
            conversationId: meta.conversationId,
            selectedCorporateTxnId: corporateTxnId,
            bookingReferenceId: data[0].bookingReferenceId,
            reasonForCancellation: formValues.reasonForCancellation,
            otp,
            scope: Scope.EMAIL,
        });
        if (res.status === false) {
            dispatch(showToast({ description: 'Ticket Cancellation Failed', variant: 'error' }));
        } else if (res.status === true) {
            dispatch(
                showToast({ description: 'Ticket Cancelled Successfully', variant: 'success' })
            );
            navigate(
                `${paths.dashboard.corporateTravel}/${paths.airline.index}/${paths.airline.manage}/${paths.airline.bookingDetails}/${paths.airline.cancelSuccess}`
            );
        }
    };

    const handleGetOtp = async (values: any) => {
        setIsOtpSending(true);
        setFormValues(values);
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
            // Handle error if OTP request fails
        }
    };
    return (
        <>
            <Row>
                <Col span={24}>
                    <Flex vertical gap={40}>
                        <HeadDetails title="Cancel Booking" />
                        {isLoading ? (
                            <Skeleton />
                        ) : (
                            <>
                                <CancellationPolicy cancellationCharges={cancellationCharges} />
                                <Formik
                                    initialValues={{ reasonForCancellation: '' }}
                                    onSubmit={values => handleGetOtp(values)}
                                    validationSchema={cancellationSchema}
                                >
                                    {({ handleSubmit }) => (
                                        <Form
                                            layout="vertical"
                                            onFinish={handleSubmit}
                                            className="my-8 w-full "
                                        >
                                            <TextAreaInput
                                                name="reasonForCancellation"
                                                placeholder="Enter reason for cancellation"
                                                label="Reason For Cancellation"
                                                maxLength={200}
                                            />

                                            <Flex gap={6} justify="end">
                                                <Button
                                                    type="default"
                                                    style={{
                                                        borderColor: '#FF4D4F',
                                                        color: '#FF4D4F',
                                                    }}
                                                    onClick={() =>
                                                        navigate(
                                                            `${paths.dashboard.corporateTravel}/${paths.airline.index}/${paths.airline.manage}/${paths.airline.bookingDetails}`
                                                        )
                                                    }
                                                >
                                                    Go back
                                                </Button>
                                                <Button
                                                    htmlType="submit"
                                                    type="primary"
                                                    danger
                                                    loading={isOtpSending}
                                                    style={{
                                                        backgroundColor: '#FF4D4F',
                                                        borderColor: '#FF4D4F',
                                                    }}
                                                    // onClick={() => handleCancellation()}
                                                >
                                                    Confirm Cancellation
                                                </Button>
                                            </Flex>
                                        </Form>
                                    )}
                                </Formik>
                            </>
                        )}
                    </Flex>
                </Col>
            </Row>
            <OtpModal
                isOpen={isOpen}
                isLoading={cancelLoading!}
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
                handleSubmit={handleCancellation}
                title="Confirmation"
            />
        </>
    );
};

export default CancelDetails;
