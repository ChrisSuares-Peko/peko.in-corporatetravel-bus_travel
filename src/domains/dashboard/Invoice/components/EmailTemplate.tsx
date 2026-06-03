/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import { Button, Flex, Input, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { ErrorMessage, FormikValues, useFormikContext } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';

import TextAreaInvoices from './TextAteaInvoice';

const { TextArea } = Input;

interface modalProps {
    index: number;
    handleCancel: () => void;
    templateData: any[];
    onHandleTemplate: any;
}

const EmailTemplate = ({ index, handleCancel, templateData, onHandleTemplate }: modalProps) => {
    const { values, setFieldValue, setFieldError, errors } = useFormikContext<FormikValues>();
    const { Details, trackerData } = useAppSelector(state => state.reducer.invoices);

    const [template, setTemplate] = useState<number>(1);
    const customerEmail =
        Details?.recipientDetails?.customerEmail || trackerData?.recipientDetails?.customerEmail;

    const replaceSubject = (
        templateString: string,

        invoiceNo: any
    ) => templateString.replace('[Invoice Number]', invoiceNo);

    const replacePlaceholders = (
        templateString: string,
        recipientName: string,
        dueDate: string,
        amount: string,
        invoiceNo: any
    ) =>
        templateString
            .replace('[Customer Name]', recipientName)
            .replace('[Due Date]', dueDate)
            .replace('[Amount]', amount)
            .replace('[service/product]', 'invoice')
            .replace('[Invoice Number]', invoiceNo);

    const newTemplate = templateData
        .map(data => {
            if (data.type === 'email') {
                // Safely access Details properties
                const customerName = Details?.recipientDetails?.customerName || '';
                const dueDate = Details?.invoiceDetails?.dueDate || '';
                const amountDue = Details?.paymentDetails?.amountDue || '';
                const invoiceNo = Details?.invoiceDetails?.invoiceNo || '';
                // Replace placeholders in the body
                data.body = replacePlaceholders(
                    data.body,
                    customerName,
                    dueDate,
                    amountDue,
                    invoiceNo
                );
                data.subject = replaceSubject(data.subject, invoiceNo);
            }
            return data;
        })
        .filter(data => data.type === 'email');

    // const finalEmail = replacePlaceholders(
    //     templateData[0].body,
    //     Details.recipientDetails?.customerName,
    //     Details?.invoiceDetails?.dueDate,
    //     Details?.paymentDetails?.amountDue
    // );

    const handleTemplateSelect = (templateIndex: number, custom = false) => {
        setTemplate(templateIndex + 1);
        if (!custom) {
            setFieldValue(
                `data[${index}].templet.email.subject`,
                newTemplate[templateIndex].subject
            );
            setFieldValue(`data[${index}].templet.email.body`, newTemplate[templateIndex].body);
        } else {
            setFieldValue(`data[${index}].templet.email.subject`, '');
            setFieldValue(`data[${index}].templet.email.body`, '');
        }
    };
    useEffect(() => {
        setFieldValue(`data[${index}].templet.email.emailId`, customerEmail);
        setFieldValue(`data[${index}].templet.email.body`, newTemplate[template - 1].body);
        setFieldValue(`data[${index}].templet.email.subject`, newTemplate[template - 1].subject);
    }, []);

    // eslint-disable-next-line consistent-return
    const handleSubmit = () => {
        if (values.data[index].templet.email.subject === '') {
            console.log(errors);
            return setFieldError(`data[${index}].templet.email.subject`, 'Subject is required');
        }
        if (values.data[index].templet.email.body === '') {
            return setFieldError(`data[${index}].templet.email.body`, 'Email body is required');
        }
        if (
            values.data[index].templet.email.body !== '' &&
            values.data[index].templet.email.subject !== ''
        ) {
            setFieldValue(`data[${index}].templet.email.index`, template);
            if (!values.data[index].sms) {
                handleCancel();
            }
        }
        onHandleTemplate();

        //  handleCancel()
    };

    return (
        <Content>
            <Flex gap={5} vertical className="">
                <Typography.Text>Subject</Typography.Text>
                <TextInput
                    // label="Subject"
                    maxLength={50}
                    name={`data[${index}].templet.email.subject`}
                    placeholder="Enter Subject"
                    type="text"
                    isDisabled={template !== newTemplate.length + 1}
                />
                <ErrorMessage
                    name={`data[${index}].templet.email.subject`}
                    render={msg => (
                        <div className="error-message -mt-5  mb-0" style={{ color: '#FF3A3A' }}>
                            {msg}
                        </div>
                    )}
                />
            </Flex>
            {/* <TextInput label="Subject" name={`data[${index}].templet.email.emailId`} placeholder="Subject" type="text" classes='' /> */}
            <Flex gap={5} vertical className="">
                <Typography.Text>Body</Typography.Text>
                <TextAreaInvoices
                    name={`data[${index}].templet.email.body`}
                    placeholder="Enter email body"
                    // defaultValue={templates[template-1].email}
                    size="large"
                    // label="Body"
                    // style={{ height: 280, resize: 'none' }}
                    isDisabled={template !== newTemplate.length + 1}
                    maxLength={200}
                />
                <ErrorMessage
                    name={`data[${index}].templet.email.body`}
                    render={msg => (
                        <div className="error-message -mt-5  mb-0" style={{ color: '#FF3A3A' }}>
                            {msg}
                        </div>
                    )}
                />
            </Flex>
            <Flex className="mt-5" gap={10}>
                {newTemplate.map(
                    (temp, idx: number) =>
                        idx < newTemplate.length && (
                            <Button
                                key={idx}
                                type="default"
                                style={{ borderColor: template === idx + 1 ? '#ff3a3a' : '' }}
                                onClick={() => handleTemplateSelect(idx)}
                            >
                                Template {idx + 1}
                            </Button>
                        )
                )}

                <Button
                    type="default"
                    style={{ borderColor: template === newTemplate.length + 1 ? '#ff3a3a' : '' }}
                    onClick={() => handleTemplateSelect(newTemplate.length, true)}
                >
                    Custom
                </Button>
            </Flex>
            <Flex className="mt-5" gap={10}>
                <Button danger type="primary" className="px-5 my-3" onClick={handleSubmit}>
                    Submit
                </Button>
                <Button onClick={handleCancel} type="default" className="px-5 my-3">
                    Cancel
                </Button>
            </Flex>
        </Content>
    );
};

export default EmailTemplate;
