import React, { useState } from 'react';

import { Form } from 'antd';
import dayjs from 'dayjs';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppSelector } from '@src/hooks/store';

import { useGetEmployee } from '../../hooks/dashboardHooks/useGetEmployeeApi';
import useIncentivesCreate from '../../hooks/employeeSalaryHooks/incentivesHooks/useAddIncentiveApi';
import { useUpdateIncentive } from '../../hooks/employeeSalaryHooks/incentivesHooks/useUpdateIncentiveApi';
import { payrollIncentivesSchema } from '../../schema/EmployeeSalary';
import { incentiveTable } from '../../types/salaryProfileTypes/incentiveTypes';

interface IncentivesModalProps {
    open: boolean;
    handleCancel: () => void;
    selectedRowData?: incentiveTable | null;
    reloadTable?: React.Dispatch<React.SetStateAction<boolean>>;
    employeeIdFromProfile?: string;
    month: number;
    year: number;
}

const IncentivesModal = ({
    open,
    handleCancel,
    selectedRowData,
    reloadTable,
    employeeIdFromProfile,
    month,
    year,
}: IncentivesModalProps) => {
    const { data, generateEmployeesDropdown } = useGetEmployee(month, year);
    const { handleIncentivesCreation } = useIncentivesCreate();
    const { updateIncentiveId } = useUpdateIncentive();
    const { dateOfJoin } = useAppSelector(state => state.reducer.payrollSalary);
    const [dateOfJoined, setDateOfJoin] = useState<string | undefined>();

    const startOfMonth = dayjs(`${year}-${month}-01`).startOf('month');
    const endOfMonth = dayjs(`${year}-${month}-01`).endOf('month');

    const minDate =
        dayjs().month() + 1 === month && dayjs().year() === year ? dayjs(new Date()) : startOfMonth;

    const handleFormSubmit = async (values: any) => {
        if (selectedRowData) {
            await updateIncentiveId({ id: selectedRowData.id, ...values });
        } else {
            await handleIncentivesCreation(values);
        }
        handleCancel();
        if (reloadTable) reloadTable(p => !p);
    };
    const { salaryMonth, monthlyTarget, achievedTarget, percentageOfSales, incentiveAmount } =
        selectedRowData || {};

    const calculateAchievedSalePercent = (
        monthTarget: string,
        achievTarget: string,
        setFieldValue: any
    ) => {
        if (monthTarget && achievTarget) {
            const achivedPercentage = (Number(achievTarget) / Number(monthTarget)) * 100;
            setFieldValue('achievedSaleInPercent', achivedPercentage.toFixed(2));
        }
    };
    return (
        <CustomModalWithForm
            modalTitle={selectedRowData ? 'Edit incentive' : 'Add incentives'}
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={v => handleFormSubmit(v)}
            initialValues={{
                employeeId: employeeIdFromProfile || '',
                incentiveDate: salaryMonth || '',
                monthlyTarget: monthlyTarget || '',
                achievedTarget: achievedTarget || '',
                achievedSaleInPercent: percentageOfSales || '',
                amount: incentiveAmount || '',
            }}
            validationSchema={payrollIncentivesSchema}
            reinitialise
        >
            {({ values, setFieldValue }) => (
                <Form layout="vertical">
                    {!selectedRowData && !employeeIdFromProfile ? (
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
                        name="incentiveDate"
                        label="Incentive Date"
                        placeholder="Enter incentive date"
                        classes="w-full"
                        needConfirm={false}
                        isRequired
                        minDate={minDate}
                        maxDate={endOfMonth}
                    />
                    <TextInput
                        name="monthlyTarget"
                        type="text"
                        placeholder="Enter monthly target"
                        label="Monthly Target"
                        isRequired
                        allowNumbersOnly
                        handleChange={e =>
                            calculateAchievedSalePercent(e, values.achievedTarget, setFieldValue)
                        }
                        maxLength={6}
                    />
                    <TextInput
                        name="achievedTarget"
                        type="text"
                        label="Achieved Target"
                        placeholder="Enter achieved target"
                        isRequired
                        allowNumbersOnly
                        handleChange={e =>
                            calculateAchievedSalePercent(values.monthlyTarget, e, setFieldValue)
                        }
                        maxLength={6}
                    />
                    <TextInput
                        name="achievedSaleInPercent"
                        type="text"
                        label="Percentage Of Achieved Sales"
                        placeholder="0"
                        isRequired
                        allowNumbersOnly
                        isDisabled
                    />
                    <TextInput
                        name="amount"
                        type="text"
                        label="Incentives Amount"
                        placeholder="Enter incentives amount"
                        isRequired
                        allowNumbersOnly
                        maxLength={6}
                    />
                </Form>
            )}
        </CustomModalWithForm>
    );
};
export default IncentivesModal;
