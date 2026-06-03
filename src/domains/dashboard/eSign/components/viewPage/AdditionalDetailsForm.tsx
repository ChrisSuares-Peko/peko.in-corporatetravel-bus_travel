import { useEffect, useState } from 'react';

import { Flex, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import dayjs from 'dayjs';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import TextAreaInput from '@components/atomic/inputs/TextAreaInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';

const AdditionalDetailsForm = () => {
    const currentTime = dayjs();
    const { isDisabled, reminder } = useAppSelector(state => state.reducer.eSignDoc);
    const [showReminder, setShowReminder] = useState(false);
    const handleReminder = (e: CheckboxChangeEvent) => {
        setShowReminder(e.target.checked);
    };
    useEffect(() => {
        if (reminder) {
            setShowReminder(true);
        } else {
            setShowReminder(false);
        }
    }, [reminder]);

    return (
        <Flex vertical className="mt-10" gap={16}>
            <Typography.Text className="text-lg font-medium">Additional Details:</Typography.Text>
            <Flex className=" md:w-5/12" vertical>
                <TextInput
                    classes="w-full "
                    label="Initiator Email"
                    name="initiator_email"
                    placeholder="Enter initiator email"
                    type="text"
                    isRequired
                    isDisabled={isDisabled}
                    maxLength={50}
                    allowEmailsOnly
                />
                <DatePickerInput
                    classes="w-full"
                    placeholder="Select last date to sign"
                    name="expiry_date"
                    label="Last Date To Sign"
                    tooltipText="Document will be available for eSign till 90 days."
                    showToolTip
                    minDate={currentTime.add(1, 'day')}
                    maxDate={currentTime.add(90, 'day')}
                    isDisabled={isDisabled}
                />
                <TextAreaInput
                    name="docket_description"
                    placeholder="Enter notes"
                    label="Note To All Recipients"
                    isDisabled={isDisabled}
                    maxLength={200}
                />
                {/* <SwitchInput
                    name='reminder'
                    label='Enable Automatic reminders'
                    isDisabled={isDisabled}
                /> */}
                <CheckboxInput name="reminder" disabled={isDisabled} onChange={handleReminder}>
                    {' '}
                    Enable Automatic reminders
                </CheckboxInput>
                {showReminder && (
                    <TextInput
                        name="reminder_interval"
                        placeholder="Enter days"
                        label="Send a Reminder Every"
                        type="text"
                        allowNumbersOnly
                        suffix="days"
                        isDisabled={isDisabled}
                    />
                )}
            </Flex>
        </Flex>
    );
};

export default AdditionalDetailsForm;
