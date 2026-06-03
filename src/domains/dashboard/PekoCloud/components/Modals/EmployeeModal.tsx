import React from 'react';

import { Form } from 'antd';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';

import useEmployeeCreate from '../../hooks/employeeHooks/useCreateEmployeeApi';
import { useUpdateEmployee } from '../../hooks/employeeHooks/useUpdateEmployeeApi';
import { employeeSchema } from '../../schema/index';

interface FinancialModalProps {
    open: boolean;
    handleCancel: () => void;
    selectedRecordData?: any | null;
    reloadTable?: React.Dispatch<React.SetStateAction<boolean>>;
    reloadInfo?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmployeeModal = ({
    open,
    handleCancel,
    selectedRecordData,
    reloadTable,
    reloadInfo,
}: FinancialModalProps) => {
    const { handleEmployeeCreation, submitLoading: creationLoading } =
        useEmployeeCreate(handleCancel);
    const { updateEmployee, submitLoading: updationLoading } = useUpdateEmployee(handleCancel);
    const handleFormSubmit = async (values: any) => {
        if (selectedRecordData) {
            await updateEmployee({ ...values }, selectedRecordData?.id);
        } else {
            await handleEmployeeCreation(values);
        }
        handleCancel();
        if (reloadTable) reloadTable(p => !p);
        if (reloadInfo) reloadInfo(p => !p);
    };
    return (
        <CustomModalWithForm
            modalTitle={selectedRecordData ? 'Edit Employee' : 'Add Employee'}
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={v => handleFormSubmit(v)}
            initialValues={{
                employeeName: selectedRecordData?.employee,
                employeeID: selectedRecordData?.employeeId ?? '',
                employeeEmail: selectedRecordData?.employeeEmail ?? '',
                department: selectedRecordData?.department ?? '',
                joiningDate: selectedRecordData?.joiningDate ?? '',
                profilePicture: selectedRecordData?.profilePicture ?? '',
            }}
            reinitialise
            validationSchema={employeeSchema}
            isLoading={creationLoading || updationLoading}
        >
            {({ values, setFieldValue }) => (
                <Form layout="vertical">
                    <TextInput
                        name="employeeName"
                        type="text"
                        placeholder="Enter employee name"
                        label="Employee Name"
                        isRequired
                        allowAlphabetsAndSpaceOnly
                        maxLength={20}
                    />
                    <TextInput
                        name="employeeID"
                        type="text"
                        label="Employee ID"
                        placeholder="Enter employee id"
                        isRequired
                        maxLength={20}
                    />
                    <TextInput
                        name="employeeEmail"
                        type="text"
                        label="Employee Email"
                        placeholder="Enter employee email"
                        isRequired
                        maxLength={40}
                    />
                    <TextInput
                        name="department"
                        type="text"
                        label="Employee Department"
                        placeholder="Enter employee department"
                        isRequired
                        maxLength={20}
                    />
                    <DatePickerInput
                        name="joiningDate"
                        label="Date of Joining"
                        placeholder="Enter date of joining"
                        classes="w-full"
                        needConfirm={false}
                        isRequired
                    />

                    <FileUploadInput
                        name="profileImageBase"
                        label="Profile Picture"
                        format="profileImageFormat"
                        showNotification
                        showFileName
                        allowedFileTypes={['image/jpeg', 'image/png']}
                        maxFileSize={2048}
                    />
                </Form>
            )}
        </CustomModalWithForm>
    );
};
export default EmployeeModal;
