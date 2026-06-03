import React, { useEffect, useRef, useState } from 'react';

import { Form } from 'antd';
import { FormikProps } from 'formik';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';

import { useGetEmployee } from '../../hooks/employeeHooks/useGetEmployeeApi';
import useSubscriptionCreate from '../../hooks/subscriptionHooks/useCreateSubscriptionApi';
import { useGetSoftwaresList } from '../../hooks/subscriptionHooks/useGetSoftwaresListApi';
import { useUpdateSubscription } from '../../hooks/subscriptionHooks/useUpdateSubscriptionApi';
import { subscriptionDocSchema } from '../../schema';
import { amountRecurrings, subscriptionStatus } from '../../utils/enumValues';

interface SubscriptionModalProps {
    open: boolean;
    handleCancel: () => void;
    selectedRecordData?: any | null;
    reloadTable?: React.Dispatch<React.SetStateAction<boolean>>;
    reloadInfo?: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubscriptionModal = ({
    open,
    handleCancel,
    selectedRecordData,
    reloadTable,
    reloadInfo,
}: SubscriptionModalProps) => {
    const subscriptionForm = useRef<FormikProps<any>>(null);
    const { data, generateEmployeesDropdown } = useGetEmployee();
    const getEmployeesList = () => {
        const employees = generateEmployeesDropdown(data) || [];
        const assignedList = subscriptionForm.current?.values?.assignTo;
        if (assignedList && assignedList.length > 0) {
            return employees.filter(
                employee => !assignedList.find((assign: any) => assign === employee.label)
            );
        }
        return employees;
    };

    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [employeeOptions, setEmployeeOptions] = useState(getEmployeesList() || []);
    useEffect(() => {
        setEmployeeOptions(getEmployeesList() || []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    // eslint-disable-next-line arrow-body-style
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    const { handleCreateSubscription, submitLoading: creationLoading } =
        useSubscriptionCreate(handleCancel);
    const { handleUpdateSubscription, submitLoading: updationLoading } =
        useUpdateSubscription(handleCancel);
    const { softwaresData, generateSoftwaresDropdown } = useGetSoftwaresList();

    const handleFormSubmit = async (values: any) => {
        const selectedEmployees = values.assignTo.map((id: number | string) => {
            const employessList = generateEmployeesDropdown(data);
            if (typeof id === 'number') {
                const employee = employessList.find(emp => emp.value === id);
                return { employeeName: employee?.label ?? '', id };
            }
            const employee = employessList.find(emp => emp.label === id);
            return { employeeName: employee?.label ?? '', id: employee?.value };
        });

        const payload = {
            ...values,
            assignTo: selectedEmployees,
        };

        if (selectedRecordData) {
            await handleUpdateSubscription(payload, selectedRecordData?.id);
        } else {
            await handleCreateSubscription(payload).then(res => {
                if (res) {
                    handleCancel();
                }
            });
        }
        if (reloadTable) reloadTable(p => !p);
        if (reloadInfo) reloadInfo(p => !p);
    };

    const excludedStatuses = ['Inactive', 'Pending', 'Cancelled', 'Suspended', 'Failed'];

    return (
        <CustomModalWithForm
            modalTitle={selectedRecordData ? 'Edit Subscription' : 'Add Subscription'}
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={handleFormSubmit}
            initialValues={{
                cloudSoftwareId: selectedRecordData?.cloudSoftwareId,
                subscriptionName: selectedRecordData?.subscriptionName ?? '',
                planDetails: selectedRecordData?.planDetails ?? '',
                billingStartDate: selectedRecordData?.billingStartDate ?? '',
                billingCycle: selectedRecordData?.billingCycle ?? '',
                assignTo: Array.isArray(selectedRecordData?.assignTo)
                    ? selectedRecordData?.assignTo.map((emp: any) => `${emp.employeeName}`)
                    : [],
                numberOfDevices: selectedRecordData?.numberOfDevices
                    ? `${selectedRecordData?.numberOfDevices}`
                    : '0',
                amount: selectedRecordData?.amount ? `${selectedRecordData?.amount}` : '0',
                status: selectedRecordData?.status ?? '',
            }}
            formRefName={subscriptionForm}
            validationSchema={subscriptionDocSchema}
            reinitialise
            isLoading={creationLoading || updationLoading}
        >
            {({ values, setFieldValue }) => (
                <Form layout="vertical">
                    <SelectInputWithSearch
                        name="cloudSoftwareId"
                        options={generateSoftwaresDropdown(softwaresData) || []}
                        placeholder="Select subscription software"
                        label="Subscription"
                        handleChange={value => {
                            // eslint-disable-next-line eqeqeq
                            const software = softwaresData.find(book => book.id == value);
                            subscriptionForm.current?.setFieldValue(
                                'subscriptionName',
                                software?.name
                            );
                        }}
                    />
                    <TextInput
                        name="subscriptionName"
                        type="text"
                        placeholder="Enter subscription name"
                        label="Subscription Name"
                        isRequired
                        isDisabled={subscriptionForm.current?.values?.cloudSoftwareId}
                        allowAlphabetsSpaceAndNumbersOnly
                        maxLength={50}
                    />
                    <TextInput
                        name="planDetails"
                        type="text"
                        placeholder="Enter plan details"
                        label="Plan Details"
                        isRequired
                        allowAlphabetsSpaceAndNumbersOnly
                        maxLength={50}
                    />
                    <SelectInput
                        name="billingCycle"
                        placeholder="Select billing cycle"
                        label="Billing Cycle"
                        isRequired
                        options={amountRecurrings}
                    />
                    <DatePickerInput
                        name="billingStartDate"
                        label="Billing Start Date"
                        placeholder="Select billing start date"
                        classes="w-full"
                        needConfirm={false}
                        isRequired
                    />
                    <SelectInputWithSearch
                        name="assignTo"
                        options={employeeOptions}
                        placeholder="Select employees"
                        label="Employee name"
                        mode="multiple"
                        isDisabled={values?.status && excludedStatuses.includes(values?.status)}
                        handleChange={() => {
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                            }
                            const id = setTimeout(() => {
                                setEmployeeOptions(getEmployeesList() || []);
                            }, 1000);
                            setTimeoutId(id);
                        }}
                    />
                    <TextInput
                        name="numberOfDevices"
                        type="text"
                        label="No. of Devices"
                        placeholder="Enter number of devices"
                        isRequired
                        allowNumbersOnly
                        maxLength={6}
                    />
                    <SelectInput
                        name="status"
                        placeholder="Select status"
                        label="Status"
                        isRequired
                        options={
                            values?.assignTo?.length
                                ? subscriptionStatus.filter(
                                      status => !excludedStatuses.includes(status.value)
                                  )
                                : subscriptionStatus
                        }
                    />
                    <TextInput
                        name="amount"
                        type="text"
                        label="Amount"
                        placeholder="Enter amount"
                        isRequired
                        allowDecimalsOnly
                        maxLength={6}
                    />
                </Form>
            )}
        </CustomModalWithForm>
    );
};

export default SubscriptionModal;
