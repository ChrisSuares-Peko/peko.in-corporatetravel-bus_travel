import React, { useState } from 'react';

import { Button, Col, Flex, Form, Grid, Input, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { ErrorMessage, FormikValues, useFormikContext } from 'formik';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import { useAppSelector } from '@src/hooks/store';

import GuidelineModal from './GuidelineModal';
// import { Row, Row } from '../types/guidelineTypes';

const { useBreakpoint } = Grid;
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
    templateData: any[];
}
const AddGuideline = ({ index, templateData }: WishListFormProps) => {
    const screens = useBreakpoint();
    const { values, setFieldValue, errors, touched } = useFormikContext<FormikValues>();
    const { Details } = useAppSelector(state => state.reducer.invoices);
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => {
        setOpen(true);
    };

    return (
        // <Flex className="w-fit mt-6" justify='space-between'>
        <>
            <Row className="w-full mt-6 border-b xxl:mb-0 mb-5" gutter={10}>
                <Col xl={8} xs={24}>
                    <Flex gap={8} className="w-full">
                        <Typography.Text className="mt-2">
                            If customer did not pay in
                        </Typography.Text>
                        <Form.Item>
                            <Input
                                name={`data[${index}].days`}
                                placeholder="Eg:10 days"
                                // label="If customer did not pay in"
                                type="text"
                                onChange={e => {
                                    const { value } = e.target;
                                    let filteredValue = value;
                                    filteredValue = value.replace(/[^\d]/g, '');
                                    const days = Number(filteredValue);
                                    const newActionDate = dayjs(Details.invoiceDetails.dueDate)
                                        .add(days, 'day')
                                        .format('YYYY-MM-DD');
                                    setFieldValue(`data[${index}].days`, e.target.value);
                                    setFieldValue(`data[${index}].actionDate`, newActionDate);
                                }}
                                maxLength={2}
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
                <Col xl={4} xs={24} className="mt-2">
                    <Typography.Text>Send reminder via</Typography.Text>
                </Col>
                <Col xl={8} xs={24}>
                    <Flex gap={200} className="">
                        <CheckboxInput name={`data[${index}].sms`}>SMS</CheckboxInput>

                        <CheckboxInput name={`data[${index}].email`}>Email</CheckboxInput>

                        {/* <CheckboxInput classes='' name={`data[${index}].notification`}>
                    In Peko Notification
                </CheckboxInput> */}
                    </Flex>
                </Col>
                <Col xxl={4} xs={24} className="mb-4 xxl:mb-0">
                    <Flex justify={screens.xxl ? 'end' : 'start'} align="end">
                        <Button
                            type="default"
                            danger
                            onClick={handleOpen}
                            disabled={
                                values.data[index].email === false &&
                                values.data[index].sms === false
                            }
                            // size={screens.sm ? 'middle' : 'small'}
                            // onClick={() => {
                            //     navigate(paths.accounting.TaxHistory);
                            // }}
                        >
                            Setup Template
                        </Button>
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

export default AddGuideline;
