import React from 'react';

import { Form } from 'antd';
import dayjs from 'dayjs';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';

import { useGetEmployee } from '../../hooks/dashboardHooks/useGetEmployeeApi';
import { reimbursementTableType } from '../../types/salaryProfileTypes/ReimbursementTypes/index';

interface ReimbursementFormProps {
    selectedRecordData?: reimbursementTableType | null;
    employeeIdFromProfile?: string;
    dateOfJoin?: string;
    dateOfJoined?: string;
    setDateOfJoin: (value: any) => void;
    month?: number;
    year?: number;
}

const ReimbursementForm = ({
    selectedRecordData,
    employeeIdFromProfile,
    dateOfJoin,
    dateOfJoined,
    setDateOfJoin,
    month,
    year,
}: ReimbursementFormProps) => {
    const { data, generateEmployeesDropdown } = useGetEmployee(month, year);

    return (
        <Form layout="vertical">
            {!selectedRecordData && !employeeIdFromProfile ? (
                <SelectInputWithSearch
                    name="employeeId"
                    options={generateEmployeesDropdown(data) || []}
                    placeholder="Select employee"
                    label="Employee name"
                    isRequired
                    handleChange={eid => {
                        const employeeData = generateEmployeesDropdown(data).find(
                            emp => emp.value === eid
                        );
                        setDateOfJoin(employeeData?.dateOfJoin);
                    }}
                />
            ) : (
                ''
            )}
            <DatePickerInput
                label="Expense Date"
                placeholder="Enter expense date"
                isRequired
                name="expenseDate"
                classes="w-full"
                needConfirm={false}
                minDate={dateOfJoined || dateOfJoin ? dayjs(dateOfJoined || dateOfJoin) : undefined}
            />

            <TextInput
                name="managerEmail"
                label="Manager Email"
                type="text"
                placeholder="Enter manager email"
                isRequired
            />
            <TextInput
                name="expenseDetails"
                label="Expense Details"
                type="text"
                placeholder="Enter expense details"
                isRequired
                allowAlphabetsAndSpaceOnly
            />
            <TextInput
                name="totalPay"
                label="Total Pay"
                type="text"
                placeholder="Enter total pay"
                isRequired
                allowNumbersOnly
                maxLength={5}
            />
            <FileUploadInput
                label="Upload File (If any)"
                name="supportingDocs"
                format="supportingDocFormat"
                showNotification
                showFileName
            />
        </Form>
    );
};

export default ReimbursementForm;
