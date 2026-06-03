import React from 'react';

import { Row, Col, Card, Form, Typography, Select } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { accessKeys } from '@utils/accessKeys';

import useAncillariesSearch from '../hooks/useAncillariesSearch';
import useProvBooking from '../hooks/useProvisonalBooking';
import { ReceiverDetailsSchema } from '../schema/ReceiverDetailsSchema';
import {
    addCustomerInfo,
    setAncillariesConversationId,
    setAncillariesOfferId,
} from '../slices/airlineSlice';
import { ProvBookingSuccess } from '../types/provBooking';

type Props = {
    formRef: React.MutableRefObject<any>;
    passengerCount: number;
    setIsLcc: any;
    setSpinner: any;
    phoneCodes: any[];
    handleSubmission: (values: any, bookingDetails: any) => void;
};

const ReceiverDetails = ({
    formRef,
    passengerCount,
    setIsLcc,
    setSpinner,
    phoneCodes,
    handleSubmission,
}: Props) => {
    const { handleProvBooking } = useProvBooking();
    const { handleAncillariesSearch } = useAncillariesSearch();

    const selectedAirlineData = useAppSelector(state => state.reducer.airline.selectedAirline);
    const bookingData = useAppSelector(state => state.reducer.airline.bookingData);

    const dispatch = useAppDispatch();

    const handleBooking = (provBookingData: ProvBookingSuccess) => {
        const requestBody = {
            offerId: provBookingData.data[0].offerId,
            conversationId: provBookingData.conversationId,
            fare: provBookingData.data[0].fare.totalFare,
            totalAncillaryPrice: 0,
            ancillaryDetails: [],
            passengers: bookingData.passengers,
            isLcc: provBookingData.data[0].detail.lcc,
            customerInfo: {
                emailAddress: bookingData.customerInfo.emailAddress,
            },
            amount: provBookingData.data[0].fare.totalFare,
            currencyCode: 'AED',
            accessKey: accessKeys.airline,
            currentUrl: window.location.href,
        };
        const bookingDetails = {
            amount: provBookingData.data[0].fare.totalFare,
            tax: provBookingData.data[0].fare.totalTax,
        };
        handleSubmission(requestBody, bookingDetails);
    };
    const defaultPassenger = bookingData.passengers.find(
        (passenger: { isDefault: any }) => passenger.isDefault
    );

    return (
        <Row className="mt-10">
            <Col span={24}>
                <Card size="small" className="p-4 border rounded-md">
                    <Typography.Paragraph className="mb-6 text-xl font-medium leading-7">
                        Booking details will be sent to
                    </Typography.Paragraph>
                    <Row>
                        <Formik
                            initialValues={{
                                phone:
                                    defaultPassenger?.contact?.contactsProvided[0]?.phone[0]
                                        .phoneNumber || '',
                                phoneCode:
                                    defaultPassenger?.contact?.contactsProvided[0]?.phone[0]
                                        .areaCode || '',
                                email:
                                    defaultPassenger?.contact?.contactsProvided[0]
                                        ?.emailAddress[0] || '',
                            }}
                            enableReinitialize
                            innerRef={formRef}
                            validationSchema={ReceiverDetailsSchema}
                            onSubmit={async values => {
                                dispatch(addCustomerInfo(values));
                                if (
                                    bookingData.passengers.length === passengerCount &&
                                    bookingData.customerInfo.emailAddress !== ''
                                ) {
                                    setSpinner(true);
                                    const res: ProvBookingSuccess =
                                        (await handleProvBooking()) as ProvBookingSuccess;
                                    setSpinner(false);
                                    if (res.meta.success) {
                                        setSpinner(true);
                                        if (selectedAirlineData.lcc === true) {
                                            const postData = {
                                                offerId: res.data[0].offerId,
                                                conversationId: res.conversationId,
                                                supplierLocator:
                                                    res.data[0].detail.supplierLocator || null,
                                                isLcc: true,
                                            };
                                            await handleAncillariesSearch(postData);
                                            dispatch(
                                                setAncillariesConversationId(res.conversationId)
                                            );
                                            dispatch(setAncillariesOfferId(res.data[0].offerId));
                                            setIsLcc(true);
                                            setSpinner(false);
                                        }
                                        if (selectedAirlineData.lcc === false) {
                                            setSpinner(false);
                                            handleBooking(res);
                                        }
                                    }
                                    setSpinner(false);
                                }
                                if (
                                    bookingData.passengers.length === passengerCount &&
                                    bookingData.customerInfo.emailAddress === ''
                                ) {
                                    dispatch(
                                        showToast({
                                            description: 'Please fill all the details',
                                            variant: 'error',
                                        })
                                    );
                                }
                            }}
                        >
                            {({ handleSubmit, handleChange, errors, values }) => (
                                <Form
                                    onFinish={handleSubmit}
                                    layout="vertical"
                                    autoComplete="off"
                                    className="w-full mt-5 "
                                >
                                    <Row justify="start">
                                        <Col className="mr-10" md={10}>
                                            <Typography.Text>
                                                <Typography.Text className="text-red-500 me-1">
                                                    *
                                                </Typography.Text>
                                                Mobile Number
                                            </Typography.Text>
                                            <Row className="mt-2">
                                                <Col
                                                    md={8}
                                                    onBlur={() => dispatch(addCustomerInfo(values))}
                                                >
                                                    <Select
                                                        showSearch
                                                        options={phoneCodes ?? []}
                                                        placeholder="Country Code"
                                                        defaultValue="+971"
                                                        onChange={e => handleChange('phoneCode')(e)}
                                                        className="w-11/12"
                                                        filterOption={(input: string, option) =>
                                                            (
                                                                (option &&
                                                                    // @ts-ignore
                                                                    option?.label.toLowerCase()) ??
                                                                ''
                                                            ).includes(input.toLowerCase())
                                                        }
                                                    />
                                                    <Typography.Text className="text-red-500">
                                                        {typeof errors.phoneCode === 'string'
                                                            ? errors.phoneCode
                                                            : ''}
                                                    </Typography.Text>
                                                </Col>
                                                <Col
                                                    md={16}
                                                    onBlur={() => dispatch(addCustomerInfo(values))}
                                                >
                                                    <TextInput
                                                        type="text"
                                                        placeholder="Enter Mobile Number"
                                                        name="phone"
                                                        allowNumbersOnly
                                                        maxLength={10}
                                                        isRequired
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col
                                            onBlur={() => dispatch(addCustomerInfo(values))}
                                            className="mr-10"
                                            md={10}
                                        >
                                            <TextInput
                                                label="Email ID"
                                                name="email"
                                                isRequired
                                                placeholder="Enter Email ID"
                                                type="text"
                                                allowLowerCaseOnly
                                            />
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Formik>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default ReceiverDetails;
