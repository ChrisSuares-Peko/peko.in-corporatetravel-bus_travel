import React, { useEffect, useState } from 'react';

import { Form, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import { useGetEmployee } from '@src/domains/dashboard/Payroll/hooks/dashboardHooks/useGetEmployeeApi';
import { useAvailableLeaves } from '@src/domains/dashboard/Payroll/hooks/leaveHooks/useAvailableLeaveApi';
import {
    LeaveRequestFormType,
    LeaveTableRow,
} from '@src/domains/dashboard/Payroll/types/leaveSection';
import { useAppSelector } from '@src/hooks/store';

interface EditFormlProps {
    selectedRecordData?: LeaveTableRow | null;
    employeeIdFromProfile?: string;
    month?: number;
    year?: number;
}

const EditForm = ({ selectedRecordData, employeeIdFromProfile, month, year }: EditFormlProps) => {
    console.log('month,year', month, year);
    const { data, generateEmployeesDropdown } = useGetEmployee(month, year);
    const { getLeave, leaves } = useAvailableLeaves();
    const { values, setFieldValue } = useFormikContext<LeaveRequestFormType>();
    const { dateOfJoin } = useAppSelector(state => state.reducer.payrollSalary);
    const [dateOfJoined, setDateOfJoin] = useState<string | undefined>();

    useEffect(() => {
        if (selectedRecordData) {
            getLeave(selectedRecordData.employeeId);
        }
        if (employeeIdFromProfile) {
            getLeave(employeeIdFromProfile);
        }
    }, [getLeave, selectedRecordData, employeeIdFromProfile]);
    return (
        <Form layout="vertical">
            {!selectedRecordData && !employeeIdFromProfile ? (
                <SelectInputWithSearch
                    name="employeeId"
                    options={generateEmployeesDropdown(data) || []}
                    placeholder="Select"
                    label="Beneficiary name"
                    isRequired
                    handleChange={e => {
                        getLeave(e);
                        const employeeData = generateEmployeesDropdown(data).find(
                            emp => emp.value === e
                        );
                        setDateOfJoin(employeeData?.dateOfJoin);
                    }}
                />
            ) : (
                ''
            )}
            <SelectInput
                name="typeOfLeave"
                options={leaves || []}
                placeholder="Select "
                label="Type"
                isRequired
            />
            {values?.typeOfLeave && values?.typeOfLeave !== 'UNPAID' && (
                <Content className="ml-1 " style={{ marginTop: '-15px' }}>
                    <Typography.Text type="secondary">
                        {leaves.find(item => item.value === values.typeOfLeave)?.count ===
                        'Exceeded'
                            ? `${leaves.find(item => item.value === values.typeOfLeave)?.label} Exceeded`
                            : `Paid leaves left: ${leaves.find(item => item.value === values.typeOfLeave)?.count || 0} days`}
                    </Typography.Text>
                </Content>
            )}
            <TextInput
                name="leaveCount"
                label="Duration"
                type="text"
                placeholder="Enter duration"
                maxLength={3}
                allowNumbersOnly
                isRequired
                handleChange={e => {
                    const duration = Number(e);
                    if (duration > 0 && values.start) {
                        const endDate = dayjs(values.start)
                            .add(duration - 1, 'day')
                            .format('YYYY-MM-DD');
                        console.log('end date', endDate);
                        setFieldValue('end', endDate);
                    }
                }}
            />
            <DatePickerInput
                label="Start Date"
                placeholder="Enter start date"
                isRequired
                name="start"
                classes="w-full"
                needConfirm={false}
                minDate={dayjs(dateOfJoined || dateOfJoin)}
                handleChange={date => {
                    const dur = Number(values.leaveCount) - 1;
                    const endDate = dayjs(date.toString())
                        .add(Number(dur), 'day')
                        .format('YYYY-MM-DD');
                    setFieldValue('end', endDate);
                    console.log('end date from start date', endDate);
                }}
            />
            {values?.start && values?.leaveCount && (
                <DatePickerInput
                    label="End Date"
                    placeholder="Select end Date"
                    isRequired
                    name="end"
                    classes="w-full"
                    minDate={dayjs(values.start)}
                    needConfirm={false}
                />
            )}
            <FileUploadInput
                label="Upload File (If any)"
                name="leaveSupportingDocs"
                format="supportingDocFormat"
                showNotification
                showFileName
                allowedFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />
        </Form>
    );
};

export default EditForm;
