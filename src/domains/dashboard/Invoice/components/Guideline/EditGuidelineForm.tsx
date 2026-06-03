import React, { useState } from 'react';

import { Button, Col, Flex, Form, Input, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { ErrorMessage, FormikValues, useFormikContext } from 'formik';
import { ReactSVG } from 'react-svg';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import pending from '@domains/dashboard/Invoice/assets/iconPending.svg';
import success from '@domains/dashboard/Invoice/assets/SuccessIcon.svg';
import { useAppSelector } from '@src/hooks/store';

import { Rows } from '../../types/guidelineTypes';
import GuidelineModal from '../GuidelineModal';

interface Template {
    email: {
        emailId: string;
        subject: string;
        body: string;
    };
    sms: {
        mobileNo: string;
        body: string;
    };
}

interface NotificationDetails {
    day: string;
    sms: string;
    email: string;
    notification: string;
    actionDate: string;
    templet: Template;
    invoiceId: string;
}

interface WishListFormProps {
    index: number;
    templateData: Rows[];
}
const EditGuidelineForm = ({ index, templateData }: WishListFormProps) => {
    const { values, setFieldValue } = useFormikContext<FormikValues>();
    const { Details } = useAppSelector(state => state.reducer.invoices);
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <>
            <Row className="w-full mt-6 border-b xl:mb-0 mb-5" gutter={10}>
                <Col xl={8} xs={24}>
                    <Flex gap={8} className="w-full">
                        <Typography.Text className="mt-2">
                            If customer did not pay in
                        </Typography.Text>
                        <Form.Item>
                            <Input
                                name={`data[${index}].days`}
                                placeholder="10 days"
                                defaultValue={values.data[index].days}
                                type="text"
                                onChange={e => {
                                    const { value } = e.target;

                                    let filteredValue = value;
                                    filteredValue = value.replace(/[^\d]/g, '');
                                    const days = Number(filteredValue);

                                    const newActionDate = dayjs(values.data[0].actionDate)
                                        .add(days, 'day')
                                        .format('YYYY-MM-DD');

                                    setFieldValue(`data[${index}].days`, e.target.value);
                                    setFieldValue(`data[${index}].actionDate`, newActionDate);
                                }}
                            />
                            <ErrorMessage name={`data[${index}].days`}>
                                {msg => (
                                    <div className="mt-2" style={{ color: 'red' }}>
                                        {msg}
                                    </div>
                                )}
                            </ErrorMessage>
                        </Form.Item>
                    </Flex>
                </Col>
                <Col xl={3} xs={24} className="mt-2">
                    <Typography.Text>Send reminder via</Typography.Text>
                </Col>
                <Col xl={6} xs={24}>
                    <Flex gap={150} className="">
                        <CheckboxInput name={`data[${index}].sms`}>SMS</CheckboxInput>

                        <CheckboxInput name={`data[${index}].email`}>Email</CheckboxInput>

                        {/* <CheckboxInput classes='' name={`data[${index}].notification`}>
                    In Peko Notification
                </CheckboxInput> */}
                    </Flex>
                </Col>
                <Col xxl={4} xs={12} className="mb-4 xxl:mb-0">
                    <Flex>
                        <Button type="default" danger onClick={handleOpen}>
                            Change Template
                        </Button>
                    </Flex>
                </Col>
                <Col xxl={3} xs={12} className="mb-4 xxl:mb-0  xl:ml-0 mt-1">
                    <Flex justify="end" align="end">
                        {values.data[index].status === 'COMPLETED' ? (
                            <ReactSVG src={success} />
                        ) : (
                            <ReactSVG src={pending} />
                        )}
                    </Flex>
                </Col>
            </Row>
            {open && (
                <GuidelineModal
                    index={index}
                    handleCancel={() => setOpen(false)}
                    open={open}
                    templateData={templateData}
                />
            )}
        </>
    );
};

export default EditGuidelineForm;
