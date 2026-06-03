import React from 'react';

import { Form } from 'antd';
import dayjs from 'dayjs';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';

import { useUpdateOwnerDoc } from '../../hooks/ownerDocHooks/useUpdateOwnerDocApi';
import { ownerDocSchema } from '../../schema';

interface OwnerDocModalProps {
    open: boolean;
    handleCancel: () => void;
    selectedData?: any | null;
    reloadTable?: React.Dispatch<React.SetStateAction<boolean>>;
    owner?: any;
}

const OwnerDocModal = ({
    open,
    handleCancel,
    selectedData,
    reloadTable,
    owner,
}: OwnerDocModalProps) => {
    const capitalizeFirstLetter = (string: string) => {
        if (!string) return '';
        if (string === 'emiratesId') return 'Emirates ID';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    const { updateOwnerDoc, submitLoading } = useUpdateOwnerDoc(handleCancel);
    const handleFormSubmit = async (values: any) => {
        await updateOwnerDoc({ [selectedData.documentType]: { ...values } }, selectedData);
        handleCancel();
        if (reloadTable) reloadTable(p => !p);
    };
    return (
        <CustomModalWithForm
            modalTitle={
                selectedData
                    ? `Update ${capitalizeFirstLetter(selectedData?.documentType ?? 'document')}`
                    : 'Add Document Details'
            }
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={v => handleFormSubmit(v)}
            initialValues={{
                documentType: capitalizeFirstLetter(selectedData?.documentType ?? ''),
                issueDate: selectedData?.issueDate ?? '',
                expireDate: selectedData?.expireDate ?? '',
                documentNumber: selectedData?.documentNumber ?? '',
                document: selectedData?.document ?? '',
            }}
            validationSchema={ownerDocSchema}
            reinitialise
            isLoading={submitLoading}
        >
            {({ values, setFieldValue }) => (
                <Form layout="vertical">
                    <TextInput
                        name="documentType"
                        type="text"
                        placeholder="Enter document name"
                        label="Document Name"
                        isRequired
                        allowAlphabetsAndSpaceOnly
                        isDisabled
                        maxLength={50}
                    />
                    <DatePickerInput
                        name="issueDate"
                        label="Issue Date"
                        placeholder="Select issue date"
                        classes="w-full"
                        needConfirm={false}
                        isRequired
                        maxDate={values.expireDate && dayjs(values.expireDate)}
                    />
                    <DatePickerInput
                        name="expireDate"
                        label="Expiry Date"
                        placeholder="Select expiry date"
                        classes="w-full"
                        needConfirm={false}
                        isRequired
                        isDisabled={!values.issueDate}
                        minDate={values.issueDate && dayjs(values.issueDate)}
                    />
                    <TextInput
                        name="documentNumber"
                        type="text"
                        label="Document Number"
                        placeholder="Enter document number"
                        isRequired
                        allowAlphabetsAndNumbersOnly
                        maxLength={30}
                    />
                    <FileUploadInput
                        name="documentBase"
                        label="Upload Document Copy"
                        format="documentFormat"
                        showNotification
                        showFileName
                        allowedFileTypes={['application/pdf']}
                        maxFileSize={2048}
                    />
                </Form>
            )}
        </CustomModalWithForm>
    );
};

export default OwnerDocModal;
