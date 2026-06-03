import React, { useState } from 'react';

import { Form } from 'antd';
import dayjs from 'dayjs';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';

import { useGetEmployee } from '../../hooks/dashboardHooks/useGetEmployeeApi';
import useDocumentCreate from '../../hooks/docAndAssetsHooks/useAddDocApi';
import useDocumentUpdate from '../../hooks/docAndAssetsHooks/useUpdateDocumentApi';
import { docSchema } from '../../schema/docAndAssets';
import { documentTable } from '../../types/docAndAssetsTypes';
import { documentOptions } from '../../utils/employeeDetails/utils';

interface DocumentModalProps {
    open: boolean;
    handleCancel: () => void;
    setRefresh: (value: any) => void;
    selectedRowData: documentTable | null;
    reloadTable?: React.Dispatch<React.SetStateAction<boolean>>;
    employeeIdFromProfile?: string;
}

const DocumentsModal = ({
    open,
    handleCancel,
    setRefresh,
    selectedRowData,
    reloadTable,
    employeeIdFromProfile,
}: DocumentModalProps) => {
    const { data, generateEmployeesDropdown } = useGetEmployee();
    const { handleDocumentCreation } = useDocumentCreate(handleCancel);
    const { handleDocumentUpdate, isLoading } = useDocumentUpdate(handleCancel);
    const [dateOfJoined, setDateOfJoin] = useState<string | undefined>();

    const handleFormSubmit = async (values: any) => {
        if (selectedRowData) {
            await handleDocumentUpdate(
                selectedRowData?.docuementId,
                selectedRowData.employeeId,
                values
            );
        } else {
            await handleDocumentCreation(values);
        }

        handleCancel();
        setRefresh((p: any) => !p);
    };

    return (
        <CustomModalWithForm
            modalTitle={selectedRowData ? 'Edit Document' : 'Add Document'}
            open={open}
            // isLoading={isLoading}
            handleCancel={handleCancel}
            handleFormSubmit={v => handleFormSubmit(v)}
            initialValues={{
                name: selectedRowData?.documentName || '',
                employee: selectedRowData?.employeeName || '',
                expiryDate: selectedRowData?.expiryDate || '',
                // holderName: selectedRowData?.holderName || '',
                url: selectedRowData?.url || '',
            }}
            validationSchema={docSchema}
            reinitialise
        >
            {({ values, setFieldValue }) => (
                <Form layout="vertical">
                    <SelectInputWithSearch
                        isRequired
                        label="Document Name"
                        name="name"
                        placeholder="Document Name"
                        classes=" rounded-sm "
                        options={documentOptions}
                    />
                    <SelectInputWithSearch
                        name="employee"
                        options={generateEmployeesDropdown(data) || []}
                        placeholder="Select employee"
                        label="Employee"
                        isRequired
                        handleChange={eid => {
                            const employeeData = generateEmployeesDropdown(data).find(
                                emp => emp.value === eid
                            );
                            setDateOfJoin(employeeData?.dateOfJoin);
                        }}
                    />

                    <DatePickerInput
                        name="expiryDate"
                        label="Expiry Date"
                        placeholder="Select expiry date"
                        classes="w-full"
                        needConfirm={false}
                        isRequired
                        minDate={dayjs(new Date())}
                    />

                    <FileUploadInput
                        name="url"
                        label="Document"
                        format="attachmentFormat"
                        showNotification
                        showFileName
                        allowedFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
                        isRequired
                        maxFileSize={2048}
                    />
                </Form>
            )}
        </CustomModalWithForm>
    );
};
export default DocumentsModal;
