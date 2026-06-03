import React from 'react';

import { Col, Flex, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useFormikContext } from 'formik';

import InputTextArea from '@components/atomic/inputs/InputTextArea';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import useServiceAccess from '@src/hooks/useSubscriptionCheck';
import { accessKeys } from '@utils/accessKeys';

import { useGetEmployee } from '../hooks/useGetEmployeeApi';
import { setUpdateQuantity } from '../slices/checkoutSlice';
import { GiftCardOrderTypes } from '../types/employee';

interface SelectedEmployee {
    receiverFirstName: string;
    receiverEmail: string;
}
type Props = {
    setSelectedEmployees: React.Dispatch<React.SetStateAction<SelectedEmployee[]>>;
    setSelectAllChecked: React.Dispatch<React.SetStateAction<boolean>>;
    selectAllChecked: boolean;
};
const CheckoutForm = ({ setSelectedEmployees, setSelectAllChecked, selectAllChecked }: Props) => {
    const { formDetails } = useAppSelector(state => state.reducer.giftcardCheckout);
    const isPurchasedPayroll = useServiceAccess(accessKeys.payroll);
    const { data, generateEmployeesDropdown } = useGetEmployee(isPurchasedPayroll);
    const { setFieldValue } = useFormikContext();
    const dispatch = useAppDispatch();
    const [selectedEmployeeIds, setSelectedEmployeeIds] = React.useState<string[]>([]);
    const employeesOptions = generateEmployeesDropdown(data) || [];

    const handleSelectChange = async (selectedIds: string | string[]) => {
        let ids = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
        // Limit to a maximum of 10 selections
        if (ids.length > 10) {
            ids = ids.slice(0, 10);
        }

        setSelectedEmployeeIds(ids);
        const selectedEmployees = ids.map(employeeId => {
            const employeeData = employeesOptions.find(emp => emp.value === employeeId);
            return {
                receiverFirstName: employeeData?.fullName ?? '',
                receiverEmail: employeeData?.personalEmail ?? '',
            };
        });

        setSelectedEmployees(selectedEmployees);
        dispatch(setUpdateQuantity({ quantity: selectedEmployees.length.toString() }));
        setFieldValue('receiverFirstName', '');
        setFieldValue('receiverEmail', '');

        if (ids.length < 10) {
            if (ids.length === employeesOptions.length) {
                setSelectAllChecked(true);
            } else {
                setSelectAllChecked(false);
            }
        }
    };

    // Handler for Select All Checkbox
    const handleSelectAllChange = (e: CheckboxChangeEvent) => {
        const { checked } = e.target;
        setSelectAllChecked(checked);

        const allEmployeeIds = employeesOptions.map(emp => emp.value);
        if (checked) {
            if (employeesOptions.length > 0) {
                handleSelectChange(allEmployeeIds);
            } else {
                setSelectAllChecked(false); // Uncheck if there are no employees
                handleSelectChange([]); // Clear selection if no employees
            }
        } else {
            handleSelectChange([]);
        }
    };
    return (
        <>
            <Flex className="my-5">
                <Typography.Text className="text-sm font-medium sm:text-xl">
                    Receiver & Sender Details
                </Typography.Text>
            </Flex>
            {formDetails.orderType === GiftCardOrderTypes.BUYFOREMPLOYEE ? (
                <>
                    <SelectInputWithSearch
                        mode="multiple"
                        name="employee"
                        options={employeesOptions}
                        placeholder="Select employees"
                        isRequired // ={!selectAllChecked} // Condition for isRequired
                        label="Select Employees"
                        handleChange={handleSelectChange}
                        maxCount={10}
                    />
                    {/* <Checkbox
                        onChange={handleSelectAllChange}
                        checked={selectAllChecked}
                        className="mb-5"
                    >
                        Select all employees
                    </Checkbox> */}
                </>
            ) : (
                <Flex className="flex-col md:flex-row">
                    <Col xs={24} md={12} className="md:pr-2">
                        <TextInput
                            name="receiverFirstName"
                            label="Receiver Name"
                            placeholder="Receiver Name"
                            type="text"
                            isRequired
                            maxLength={50}
                            allowAlphabetsAndSpaceOnly
                        />
                    </Col>
                    <Col xs={24} md={12} className="md:pl-2">
                        <TextInput
                            name="receiverEmail"
                            label="Receiver Email Address"
                            placeholder="Receiver Email Address"
                            type="text"
                            maxLength={50}
                            allowLowerCaseOnly
                            isRequired
                        />
                    </Col>
                </Flex>
            )}
            <Flex className="flex-col md:flex-row">
                <Col xs={24} md={12} className="md:pr-2">
                    <TextInput
                        name="senderName"
                        label="Sender Name"
                        placeholder="Sender Name"
                        type="text"
                        isRequired
                        maxLength={50}
                        allowAlphabetsAndSpaceOnly
                    />
                </Col>
            </Flex>
            <Col xs={24}>
                <InputTextArea
                    name="message"
                    maxLength={200}
                    placeholder="Message"
                    label="Your Message"
                />
            </Col>
            {formDetails.orderType === GiftCardOrderTypes.BUYFOREMPLOYEE ? (
                <Typography.Text className="text-base font-normal sm:text-lg">
                    Upon successful completion of the purchase, the gift card details will be sent
                    to the employees via email
                </Typography.Text>
            ) : null}
        </>
    );
};

export default CheckoutForm;
