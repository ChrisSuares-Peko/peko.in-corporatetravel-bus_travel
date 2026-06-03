import React, { useState } from 'react';

import { Form } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppSelector } from '@src/hooks/store';

import { useGetEmployee } from '../../hooks/dashboardHooks/useGetEmployeeApi';
import useBonusCreate from '../../hooks/employeeSalaryHooks/bonusHooks/useAddBonusApi';
import GetBonusAmount from '../../hooks/employeeSalaryHooks/bonusHooks/useGetEmployeeBonusAmountApi';
import { useUpdateBonus } from '../../hooks/employeeSalaryHooks/bonusHooks/useUpdateBonusApi';
import { payrollBonusSchema } from '../../schema/EmployeeSalary';
import { bonusTable } from '../../types/salaryProfileTypes/bonustypes';

interface BonusModalProps {
    open: boolean;
    handleCancel: () => void;
    selectedRecordData?: bonusTable | null;
    reloadTable?: React.Dispatch<React.SetStateAction<boolean>>;
    employeeIdFromProfile?: string;
    year: number;
    month: number;
}

const BonusModal = ({
    open,
    handleCancel,
    selectedRecordData,
    reloadTable,
    employeeIdFromProfile,
    year,
    month,
}: BonusModalProps) => {
    const { data, generateEmployeesDropdown } = useGetEmployee();
    const { handleBonusCreation } = useBonusCreate(handleCancel);
    const { updateBonusById } = useUpdateBonus(handleCancel);
    const { getBonusDetails } = GetBonusAmount();
    const { dateOfJoin } = useAppSelector(state => state.reducer.payrollSalary);
    const [dateOfJoined, setDateOfJoin] = useState<string | undefined>();
    const startOfMonth = dayjs(`${year}-${month}-01`).startOf('month');
    const endOfMonth = dayjs(`${year}-${month}-01`).endOf('month');

    const minDate =
        dayjs().month() + 1 === month && dayjs().year() === year ? dayjs(new Date()) : startOfMonth;

    const debouncedGetBonusDetails = debounce(
        async (employeeId, bonusAmount, bonusPercentage, type, setFieldValue) => {
            if (type === 'percentage') {
                const bonusAmountData = await getBonusDetails(employeeId, type, bonusPercentage);
                if (bonusAmountData) {
                    setFieldValue('bonusAmount', bonusAmountData.bonusAmount);
                }
            }
            if (type === 'flat') {
                const bonusAmountData = await getBonusDetails(employeeId, type, bonusAmount);
                if (bonusAmountData) {
                    setFieldValue('bonusPercentage', bonusAmountData.bonusPercentage);
                }
            }
        },
        300
    );
    const handleFormSubmit = async (values: any) => {
        if (selectedRecordData) {
            await updateBonusById(values, selectedRecordData.id);
        } else {
            await handleBonusCreation(values);
        }
        handleCancel();
        if (reloadTable) reloadTable(p => !p);
    };

    const bonusType = [
        { label: 'Percentage', value: 'percentage' },
        { label: 'Flat', value: 'flat' },
    ];
    return (
        <CustomModalWithForm
            modalTitle={selectedRecordData ? 'Edit Bonus' : 'Add Bonus'}
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={v => handleFormSubmit(v)}
            initialValues={{
                employeeId: selectedRecordData?.employeeId || employeeIdFromProfile || '',
                bonusDate: selectedRecordData?.salaryMonth,
                type: selectedRecordData?.type,
                bonusPercentage: selectedRecordData?.bonusPercentage,
                bonusAmount: selectedRecordData?.bonusAmount,
                id: selectedRecordData?.id,
            }}
            validationSchema={payrollBonusSchema}
            reinitialise
        >
            {({ values, setFieldValue }) => (
                <Form layout="vertical">
                    {!selectedRecordData && !employeeIdFromProfile ? (
                        <SelectInput
                            name="employeeId"
                            options={generateEmployeesDropdown(data) || []}
                            placeholder="Select employee"
                            label="Employee name"
                            isRequired
                            handleChange={eid => {
                                // First function call
                                debouncedGetBonusDetails(
                                    eid,
                                    values.type,
                                    values.bonusAmount,
                                    values.bonusPercentage,
                                    setFieldValue
                                );

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
                        label="Bonus Date"
                        placeholder="Select bonus date"
                        isRequired
                        name="bonusDate"
                        classes="w-full"
                        needConfirm={false}
                        minDate={minDate}
                        maxDate={endOfMonth}
                    />
                    <SelectInput
                        name="type"
                        options={bonusType || []}
                        placeholder="Select transfer method"
                        label="Transfer Method"
                        isRequired
                    />
                    <TextInput
                        name="bonusPercentage"
                        type="text"
                        label="Bonus Percentage"
                        placeholder="Enter bonus percentage"
                        isRequired
                        allowNumbersOnly
                        isDisabled={!(values.type === 'percentage')}
                        handleChange={async bonusPercentage => {
                            debouncedGetBonusDetails(
                                employeeIdFromProfile || values.employeeId,
                                values.bonusAmount,
                                bonusPercentage,
                                values.type,
                                setFieldValue
                            );
                        }}
                    />
                    <TextInput
                        name="bonusAmount"
                        type="text"
                        label="Bonus Amount"
                        placeholder="Enter bonus amount"
                        isRequired
                        allowNumbersOnly
                        isDisabled={!(values.type === 'flat')}
                        handleChange={async bonusAmount => {
                            debouncedGetBonusDetails(
                                employeeIdFromProfile || values.employeeId,
                                bonusAmount,
                                values.bonusPercentage,
                                values.type,
                                setFieldValue
                            );
                        }}
                    />
                </Form>
            )}
        </CustomModalWithForm>
    );
};
export default BonusModal;
