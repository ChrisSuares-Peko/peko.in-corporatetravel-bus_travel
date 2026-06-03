import React, { useState } from 'react';

import { Alert, Form } from 'antd';
import * as Yup from 'yup';

import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { USD_TO_AED } from '@src/config-global';

import useWccPayment from '../../hooks/useWccPayment';
import { Project } from '../../types/types';

interface BuyCreditModalProps {
    isVisible: boolean;
    project: Project | null;
    handleCancel: () => void;
}

const BuyCreditModal: React.FC<BuyCreditModalProps> = ({ isVisible, project, handleCancel }) => {
    const { handleSubmission } = useWccPayment();

    const [amount, setAmount] = useState<string>('');
    const [convertedAmount, setConvertedAmount] = useState<string>('0.00');

    const handleSubmit = async (values: { amount: string }) => {
        if (project) {
            await handleSubmission(values.amount, project.id);
        }
    };

    const validationSchema = Yup.object().shape({
        amount: Yup.number()
            .min(3.67, 'Amount must be at least 3.67')
            .required('Amount is required'),
    });

    const handleAmountChange = (value: string) => {
        // Use a regular expression to allow only numbers and decimal points
        const isValid = /^[0-9]*\.?[0-9]*$/.test(value);

        if (isValid) {
            setAmount(value);
            const amountInUsd = (+value / +USD_TO_AED).toFixed(2);
            setConvertedAmount(amountInUsd);
        }
    };

    return (
        <CustomModalWithForm
            open={isVisible}
            handleCancel={handleCancel}
            initialValues={{ amount: '' }}
            modalTitle={`Buy WCC Credit for ${project?.name}`}
            handleFormSubmit={handleSubmit}
            validationSchema={validationSchema}
            isLoading={false}
        >
            <Form layout="vertical">
                <TextInput
                    name="amount"
                    label="Amount in AED"
                    type="string"
                    placeholder="Enter amount"
                    isRequired
                    allowDecimalsOnly
                    classes="rounded-sm"
                    handleChange={handleAmountChange}
                />
            </Form>
            {amount ? (
                <Alert
                    message={
                        <>
                            <strong>Note:</strong> {amount} AED is approximately {convertedAmount}{' '}
                            USD (based on a conversion rate of 1 AED = {USD_TO_AED || 3.67} USD).
                        </>
                    }
                    type="success"
                />
            ) : (
                <Alert
                    message={
                        <>
                            <strong>Note:</strong> 1 AED = {USD_TO_AED || 3.67} USD.
                        </>
                    }
                    type="success"
                />
            )}
        </CustomModalWithForm>
    );
};

export default BuyCreditModal;
