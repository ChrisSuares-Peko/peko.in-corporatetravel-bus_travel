import React from 'react';

import { Form } from 'antd';
import dayjs from 'dayjs';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';

import useCompanyDocCreate from '../../hooks/companyDocHooks/useCreateCompanyDocApi';
import { useUpdateCompanyDoc } from '../../hooks/companyDocHooks/useUpdateCompanyDocApi';
import { companyDocSchema } from '../../schema';

interface CompanyDocModalProps {
    open: boolean;
    handleCancel: () => void;
    selectedRecordData?: any | null;
    reloadTable?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CompanyDocModal = ({
    open,
    handleCancel,
    selectedRecordData,
    reloadTable,
}: CompanyDocModalProps) => {
    const { handleCompanyDocCreation, submitLoading: creationLoading } =
        useCompanyDocCreate(handleCancel);
    const { updateCompanyDocs, submitLoading: updationLoading } = useUpdateCompanyDoc(handleCancel);
    const handleFormSubmit = async (values: any) => {
        if (!values.expireDate) {
            values.expireDate = null;
        }
        if (selectedRecordData?.id) {
            await updateCompanyDocs({ ...values }, selectedRecordData?.id);
        } else {
            await handleCompanyDocCreation(values);
        }
        handleCancel();
        if (reloadTable) reloadTable(p => !p);
    };
    return (
        <CustomModalWithForm
            modalTitle={selectedRecordData ? 'Edit Document' : 'Add Document'}
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={v => handleFormSubmit(v)}
            initialValues={{
                documentName: selectedRecordData?.documentName ?? '',
                documentNumber: selectedRecordData?.documentNumber ?? '',
                documentType: selectedRecordData?.documentType,
                issueDate: selectedRecordData?.issueDate ?? '',
                expireDate: selectedRecordData?.expireDate,
                document: selectedRecordData?.document ?? '',
                documentBase: '',
            }}
            reinitialise
            validationSchema={companyDocSchema}
            isLoading={creationLoading || updationLoading}
        >
            {({ values, setFieldValue }) => (
                <Form layout="vertical">
                    <TextInput
                        name="documentName"
                        type="text"
                        placeholder="Enter document name"
                        label="Document Name"
                        isRequired
                        maxLength={50}
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
                    <TextInput
                        name="documentType"
                        type="text"
                        label="Document Type"
                        placeholder="Enter document type"
                        allowAlphabetsAndSpaceOnly
                        maxLength={20}
                    />
                    <DatePickerInput
                        name="issueDate"
                        label="Issue Date"
                        handleChange={() => setFieldValue('expireDate', '')}
                        placeholder="Enter issue date"
                        classes="w-full"
                        needConfirm={false}
                        isRequired
                    />
                    <DatePickerInput
                        name="expireDate"
                        label="Expiry Date"
                        placeholder="Enter expiry date"
                        classes="w-full"
                        needConfirm={false}
                        minDate={dayjs(values?.issueDate ? values.issueDate : new Date())}
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
export default CompanyDocModal;
