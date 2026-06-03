import { useState } from 'react';

import { CloseCircleOutlined } from '@ant-design/icons';
import { Modal, Button, Input, Typography } from 'antd';

import { schema } from '../../Reports/schema/schemas';
import useSendMail from '../hooks/useSendMail';
import useSentEmail from '../hooks/useSentEmail';

interface ModalProps {
    open: boolean;
    handleCancel: () => void;
    invoiceId?: any;
    invoiceOnly?: boolean;
    amount?: string;
    link?: string;
}
export const SendEmailModal = ({
    open,
    handleCancel,
    invoiceId,
    invoiceOnly,
    amount,
    link,
}: ModalProps) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { sendEmail, loader } = useSentEmail();
    const { sendMail, loading } = useSendMail();
    const emailLoader = loader || loading;

    const handleOnClose = () => {
        handleCancel();
        setEmail('');
    };
    const handleFormSubmit = async () => {
        const emailPayload = {
            invoiceId,
            email,
            invoiceOnly,
        };
        const paymentLinkPayload = {
            email,
            amount,
            link,
        };
        const valid = await validateEmail();
        if (valid) {
            if (invoiceOnly) {
                await sendEmail(emailPayload);
                handleCancel();
                setEmail('');
            } else {
                await sendMail(paymentLinkPayload);
                handleCancel();
                setEmail('');
            }
        }
    };
    const validateEmail = () => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // First, check the email against the regex pattern
        if (!emailPattern.test(email)) {
            setError('Invalid email format');
            setTimeout(() => {
                setError('');
            }, 3000);
            return false;
        }
        const valid = schema
            .validate({ email })
            .then(() => {
                // Validation succeeded, do something
                setError('');
                return true;
            })
            .catch(validationError => {
                // Validation failed, display error message
                setError(validationError.errors[0]);
                setTimeout(() => {
                    setError('');
                }, 3000);
                return false;
            });

        return valid;
    };

    return (
        <Modal
            title="Send Email"
            open={open}
            onCancel={handleOnClose}
            footer={[
                <Button key="submit" danger onClick={handleFormSubmit} loading={emailLoader}>
                    OK
                </Button>,
                <Button key="cancel" onClick={handleOnClose}>
                    Cancel
                </Button>,
            ]}
        >
            <Input
                value={email}
                onBlur={validateEmail}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter Email Address"
            />
            {error && (
                <Typography.Text className="text-xs" type="danger">
                    <CloseCircleOutlined /> {error}
                </Typography.Text>
            )}
        </Modal>
    );
};
