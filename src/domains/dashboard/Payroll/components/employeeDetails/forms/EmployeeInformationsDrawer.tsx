import React from 'react';

import { Button, Drawer, Flex, Form, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { Field, FieldProps, Formik } from 'formik';
import moment from 'moment';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppDispatch } from '@src/hooks/store';

import { useGetDepartmentList } from '../../../hooks/employeeHooks/useGetDepartment';
import GetEmployeeDetails from '../../../hooks/employeeHooks/useReportingStaffApi';
import { useUpdateEmployeeApiNew } from '../../../hooks/employeeHooks/useUpdateEmployeeApiNew';
import { editEmployeeSchema } from '../../../schema/employeeProfile';
import { probationOptions } from '../../../utils/employeeDetails/utils';
import SelectInput from '../../EmployeeProfile/SelectInput';

type Props = {
    open: boolean;
    isLoading: boolean;
    handleCancel: () => void;
    setRefState: (num: number) => void;
    initialValues: {
        id: string;
        joinDate: string;
        department: string;
        workingDays?: number;
        workingHours: number;
        employeeType: string;
        reportingStaff: string;
        employeeId: string;
        designation: string;
        timeSchedule: string | undefined;
        probation: string;
    };
    officialEmail: string;
};

const EmployeeInformationsDrawer = ({
    handleCancel,
    open,
    initialValues,
    setRefState,
    officialEmail,
    isLoading,
}: Props) => {
    const { tableData } = useGetDepartmentList();
    const { data } = GetEmployeeDetails('');

    const { updateEmployeeInfo, isLoading: updateLoading } = useUpdateEmployeeApiNew();

    const formatText = (text: string | number) => {
        if (!text) return '';
        const stringText = String(text); // Convert any input to a string
        return stringText.charAt(0).toUpperCase() + stringText.slice(1).toLowerCase();
    };
    const dispatch = useAppDispatch();
    const timeRange = initialValues?.timeSchedule || '';

    const parseSchedule = (schedule: any) => {
        if (!schedule) return [null, null]; // Handle the case where no schedule is provided

        const times = schedule.split(' - ');
        if (times.length === 2) {
            const [startTime, endTime] = times;
            const startMoment = moment(startTime, 'h:mm A');
            const endMoment = moment(endTime, 'h:mm A');

            if (startMoment.isValid() && endMoment.isValid()) {
                return [startMoment, endMoment];
            }
        } else {
            console.error('Schedule does not follow expected format:', schedule);
        }
        return [null, null]; // Return nulls for any parsing failures
    };
    const [initialStart, initialEnd] = parseSchedule(timeRange);

    const initialStartDayjs = initialStart ? dayjs(initialStart.format()) : undefined;
    const initialEndDayjs = initialEnd ? dayjs(initialEnd.format()) : undefined;
    function formatTimeRange(timeR: any) {
        const times = timeRange.split(' - ');
        const formattedTimes = times.map(time => {
            // Trim any extra whitespace and find if it contains minutes or just hours
            time = time.trim();
            const parts = time.match(/(\d+)(?::(\d+))?\s*(AM|PM)?/i);

            if (!parts) return ''; // Return empty string if the time is not valid

            const hours = parts[1];
            const minutes = parts[2] || '00';
            let period = parts[3] || ''; // Defaults to empty if AM/PM isn't defined

            // Ensures the period is in upper case
            period = period.toUpperCase();

            return `${hours}:${minutes} ${period}`;
        });

        return formattedTimes.join(' - ');
    }

    return (
        <Formik
            initialValues={{
                dateOfJoin: initialValues?.joinDate ?? '',
                department: initialValues?.department ?? '',
                // workingDays: initialValues?.workingDays ?? '',
                workingHours: initialValues?.workingHours ?? '',
                jobType: initialValues?.employeeType ?? '',
                reportingStaff: initialValues?.reportingStaff ?? null,
                employeeId: initialValues?.employeeId ?? '',
                designation: initialValues?.designation ?? '',
                schedule: formatTimeRange(initialValues?.timeSchedule) ?? '',

                probation: initialValues?.probation ?? '',
            }}
            onSubmit={async values => {
                const employeeInformation = {
                    id: initialValues.id,
                    employeeInformation: {
                        dateOfJoin: values.dateOfJoin,
                        employeeId: values.employeeId,
                        designation: values?.designation,
                        department: values?.department,
                        reportingStaff: values.reportingStaff,
                        // workingDays: values.workingDays,
                        jobType: values?.jobType,
                        workingHours: values?.workingHours,
                        schedule: values?.schedule,
                        probation: values?.probation,
                    },
                };
                // @ts-ignore
                const res = await updateEmployeeInfo(employeeInformation);
                if (res) setRefState(new Date().valueOf());
                handleCancel();
            }}
            validationSchema={editEmployeeSchema}
            enableReinitialize
        >
            {({ handleSubmit, resetForm, setFieldValue }) => (
                <Drawer
                    title="Employee Information"
                    open={open}
                    onClose={handleCancel}
                    closeIcon={null}
                    destroyOnClose
                    width={470}
                    styles={{
                        body: { paddingInline: 20, paddingBlock: 16 },
                        header: { paddingInline: 20 },
                    }}
                    zIndex={20}
                >
                    <Form onFinish={handleSubmit} layout="vertical">
                        <DatePickerInput
                            name="dateOfJoin"
                            label="Join Date"
                            placeholder="Select Join Date"
                            classes="rounded-sm"
                            isRequired
                        />
                        <SelectInput
                            name="department"
                            label="Department"
                            placeholder="Select Department"
                            classes="rounded-sm"
                            options={tableData ?? []}
                            isRequired
                        />
                        {/* <TextInput
                            name="workingDays"
                            label="Working Days"
                            type="text"
                            placeholder="Enter Working Days"
                            classes="rounded-sm"
                            allowNumbersOnly
                            maxLength={2}
                            isRequired
                        /> */}

                        <SelectInputWithSearch
                            name="jobType"
                            label="Job Type"
                            placeholder="Enter Job Type"
                            classes="rounded-sm"
                            options={[
                                {
                                    value: 'FULL TIME',
                                    label: 'Full-Time',
                                },
                                {
                                    value: 'PART TIME',
                                    label: 'Part-Time',
                                },
                            ]}
                            isRequired
                        />
                        <SelectInput
                            name="reportingStaff"
                            label="Reporting Staff"
                            placeholder="Enter Reporting Staff"
                            classes="rounded-sm"
                            options={data ?? []}
                            allowClear
                            onChange={value => setFieldValue('reportingStaff', value || null)}
                        />
                        <TextInput
                            name="employeeId"
                            label="Employee ID"
                            type="text"
                            placeholder="Enter Employee ID"
                            classes="rounded-sm"
                            allowAlphabetsAndNumbersOnly
                            isRequired
                        />
                        <TextInput
                            name="designation"
                            label="Designation"
                            type="text"
                            placeholder="Enter Designation"
                            classes="rounded-sm"
                            allowAlphabetsAndSpaceOnly
                            isRequired
                        />

                        <SelectInput
                            isRequired
                            label="Probation Period"
                            name="probation"
                            placeholder="Probation Period"
                            classes=" rounded-sm "
                            options={probationOptions}
                        />
                        <Field name="schedule">
                            {({ field, form: { touched, errors } }: FieldProps) => (
                                <Form.Item
                                    name="schedule"
                                    validateStatus={
                                        touched.schedule && errors.schedule ? 'error' : ''
                                    }
                                    help={
                                        touched.schedule && errors.schedule
                                            ? (errors.schedule as React.ReactNode)
                                            : undefined
                                    }
                                    required
                                    label="Time Schedule"
                                >
                                    <TimePicker.RangePicker
                                        format="h:mm A"
                                        use12Hours
                                        minuteStep={30}
                                        className="w-full"
                                        placeholder={['Start Time', 'End Time']}
                                        defaultValue={
                                            initialStartDayjs && initialEndDayjs
                                                ? [initialStartDayjs, initialEndDayjs]
                                                : undefined
                                        }
                                        onChange={range => {
                                            if (range) {
                                                const [start, end] = range;
                                                const formattedRange = `${start?.format('h:mm A')} - ${end?.format('h:mm A')}`;
                                                setFieldValue('schedule', formattedRange);
                                                // Calculate and set working hours based on start and end times
                                                const duration = moment.duration(end?.diff(start));
                                                const hours = duration.asHours();
                                                setFieldValue('workingHours', hours);
                                            } else {
                                                // Handle the case where no time is selected
                                                setFieldValue('schedule', '');
                                            }
                                        }}
                                    />
                                </Form.Item>
                            )}
                        </Field>
                        <Flex className="w-full " justify="flex-end" gap={10} key="">
                            <Button
                                key="submit"
                                type="primary"
                                danger
                                onClick={() => {
                                    handleSubmit();
                                }}
                                className="px-5"
                            >
                                Submit
                            </Button>
                            <Button
                                key="back"
                                onClick={() => {
                                    handleCancel();
                                    resetForm();
                                }}
                                className="px-5"
                            >
                                Cancel
                            </Button>
                        </Flex>
                    </Form>
                </Drawer>
            )}
        </Formik>
    );
};

export default EmployeeInformationsDrawer;
