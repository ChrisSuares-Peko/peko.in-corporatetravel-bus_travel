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
import { useAppSelector } from '@src/hooks/store';

import { useGetEmployee } from '../../hooks/dashboardHooks/useGetEmployeeApi';
import { useAvailableLeaves } from '../../hooks/leaveHooks/useAvailableLeaveApi';
import { LeaveRequestFormType, LeaveTableRow } from '../../types/leaveSection';

interface LeaveFormProps {
    selectedRecordData?: LeaveTableRow | null;
    employeeIdFromProfile?: string;
    month?: number;
    year?: number;
}

const LeaveForm = ({ selectedRecordData, employeeIdFromProfile, month, year }: LeaveFormProps) => {
    const { data, generateEmployeesDropdown } = useGetEmployee(month, year);
    const [isEmployeeSelected, setIsEmployeeSelected] = useState<boolean>(!!employeeIdFromProfile);
    let initialDate;
    const { getLeave, leaves } = useAvailableLeaves();
    const { values, setFieldValue } = useFormikContext<LeaveRequestFormType>();
    const { dateOfJoin } = useAppSelector(state => state.reducer.payrollSalary);
    const [dateOfJoined, setDateOfJoin] = useState<string | undefined>();
    if (month && year) {
        initialDate = dayjs()
            .set('year', year)
            .set('month', month - 1)
            .startOf('month');
    }
    useEffect(() => {
        if (selectedRecordData) {
            getLeave(selectedRecordData.employeeId);
        }
        if (employeeIdFromProfile) {
            getLeave(employeeIdFromProfile);
            setIsEmployeeSelected(true);
        }
    }, [getLeave, selectedRecordData, employeeIdFromProfile]);
    return (
        <Form layout="vertical">
            {!selectedRecordData && !employeeIdFromProfile ? (
                <SelectInputWithSearch
                    name="employeeId"
                    options={generateEmployeesDropdown(data) || []}
                    placeholder="Select employee"
                    label="Employee name"
                    isRequired
                    disableDeselect
                    handleChange={e => {
                        getLeave(e);
                        setIsEmployeeSelected(true);
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
                placeholder="Select leave type"
                label="Type of Leave"
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
                // handleChange={e => {
                //     const endDate = dayjs(values.start).add(Number(e), 'day').format('YYYY-MM-DD');
                //     setFieldValue('end', endDate);
                // }}
                handleChange={e => {
                    const duration = Number(e);
                    if (duration > 0 && values.start) {
                        const endDate = dayjs(values.start)
                            .add(duration - 1, 'day')
                            .format('YYYY-MM-DD');
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
                minDate={initialDate}
                isDisabled={!isEmployeeSelected}
                handleChange={date => {
                    const dur = Number(values.leaveCount) - 1;
                    const endDate = dayjs(date.toString())
                        .add(Number(dur), 'day')
                        .format('YYYY-MM-DD');
                    setFieldValue('end', endDate);
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

export default LeaveForm;
