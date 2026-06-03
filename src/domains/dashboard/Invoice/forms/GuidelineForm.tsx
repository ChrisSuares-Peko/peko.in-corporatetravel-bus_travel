import React from 'react';

import { Col, Row } from 'antd';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import GuidelineDetails from './GuidelineDetails';
import useGuidelines from '../hooks/useGuidelines';
import { DaysSchema } from '../schema';
import { getpaymentlinkPayload } from '../types/paymentlinkType';

const GuidelineForm = () => {
    const { Details, invoiceResponse } = useAppSelector(state => state.reducer.invoices);
    const { guidelineAdd, data, isLoading } = useGuidelines();
    const dispatch = useDispatch();

    const formDetails = JSON.parse(invoiceResponse.recipientDetails);

    const due = JSON.parse(invoiceResponse.invoiceDetails);

    const dateValue = new Date(due.dueDate);
    const date = dateValue.toISOString().slice(0, 19);

    const formPayload: getpaymentlinkPayload = {
        full_name: formDetails.customerName,
        email: formDetails.customerEmail,
        phone_number: `+971${formDetails.customerPhone}`,
        amount: invoiceResponse.amount,
        expires_at: date,
        payment_link_image: '',
        notification: 'EML',
    };
    const initialItems = [
        {
            days: '',
            sms: false,
            email: false,
            notification: false,
            actionDate: '',
            templet: {
                email: {
                    emailId: '',
                    subject: '',
                    body: '',
                    index: '',
                },
                sms: {
                    mobileNo: '',
                    body: '',
                    index: '',
                },
            },

            invoiceId: Details?.id,
        },
    ];
    const validateTemplates = (values: any) => {
        const isInvalid = values.data.some(
            (item: any) =>
                !item.templet.email.emailId &&
                !item.templet.email.subject &&
                !item.templet.email.body &&
                !item.templet.sms.mobileNo &&
                !item.templet.sms.body
        );
        return isInvalid;
    };

    const isValidate = (values: any) => {
        const isvalid = values.data.some((item: any) => !item.sms && !item.email);
        return isvalid;
    };

    return (
        <Formik
            initialValues={{
                data: initialItems,
                invoiceId: Details?.id,
            }}
            onSubmit={values => {
                const isValid = isValidate(values);
                if (isValid) {
                    dispatch(
                        showToast({
                            description: 'Please select sms or email.',
                            variant: 'error',
                        })
                    );
                } else if (validateTemplates(values)) {
                    dispatch(
                        showToast({
                            description:
                                'Please fill in at least one template(SMS or Email) for each item',
                            variant: 'error',
                        })
                    );
                } else {
                    guidelineAdd({ ...values, ...formPayload });
                }
            }}
            validationSchema={DaysSchema}
        >
            {({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                    <Row>
                        <Col span={24} className="mt-7">
                            <GuidelineDetails
                                isLoading={isLoading}
                                values={values.data}
                                data={data}
                            />
                        </Col>
                    </Row>
                </form>
            )}
        </Formik>
    );
};

export default GuidelineForm;
