import React, { useState } from 'react';

import { Form } from 'antd';
import dayjs from 'dayjs';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';

import { useGetEmployee } from '../../hooks/dashboardHooks/useGetEmployeeApi';
import { DeductionFormType } from '../../types/salaryProfileTypes/deductionTypes';

interface deductionFormProps {
    selectedRecordData?: DeductionFormType | null;
    employeeIdFromProfile?: string;
    month: number;
    year: number;
}

const DeductionForm = ({
    selectedRecordData,
    employeeIdFromProfile,
    month,
    year,
}: deductionFormProps) => {
    const endOfMonth = dayjs(`${year}-${month}-01`).endOf('month');
    const startOfMonth = dayjs(`${year}-${month}-01`).startOf('month');

    const minDate =
        dayjs().month() + 1 === month && dayjs().year() === year ? dayjs(new Date()) : startOfMonth;

    const { data, generateEmployeesDropdown } = useGetEmployee(month, year);
    const { dateOfJoin } = useAppSelector(state => state.reducer.payrollSalary);
    const [dateOfJoined, setDateOfJoin] = useState<string | undefined>();

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
                label="Deduction Date"
                placeholder="Select deduction date"
                isRequired
                name="deductionDate"
                classes="w-full"
                needConfirm={false}
                // minDate={dayjs(dateOfJoined || dateOfJoin)}
                minDate={minDate}
                maxDate={endOfMonth}
            />
            <TextInput
                name="deductionType"
                label="Deduction Type"
                type="text"
                placeholder="Enter deduction type"
                classes=" rounded-sm "
                allowAlphabetsAndSpaceOnly
                maxLength={50}
                isRequired
            />
            <TextInput
                name="deductionAmount"
                label="Deduction Amount"
                type="text"
                placeholder="Enter deduction amount"
                classes=" rounded-sm "
                allowNumbersOnly
                maxLength={6}
                isRequired
            />
        </Form>
    );
};

export default DeductionForm;
