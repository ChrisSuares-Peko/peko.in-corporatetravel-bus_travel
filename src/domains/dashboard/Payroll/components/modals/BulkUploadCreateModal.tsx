import { useState } from 'react';

import { Flex, Form, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { Field, FieldProps } from 'formik';
import moment from 'moment';

import TextInput from '@components/atomic/inputs/TextInput';
import { genderOptions } from '@src/domains/dashboard/GiftCards/utils/data';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import CustomModalWithForm from './CustomModalWithForm';
import { useBulkValidateApi } from '../../hooks/employeeHooks/useBulkValidateApi';
import useGeneralApi from '../../hooks/employeeHooks/useGetCountry';
import useReportingStaffApi from '../../hooks/employeeHooks/useReportingStaffApi';
import { bulkUploadSchema } from '../../schema/bulkUploadSchema';
import { updateEmployeeDetails } from '../../slices/jsonSlice';
import DatePickerInput from '../EmployeeProfile/DatePickerInput';
import SelectInput from '../EmployeeProfile/SelectInput';
import SelectInputCustom from '../EmployeeProfile/SelectInputCustom';

type InitialStateDataType = {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    mobileNo: string;
    emergencyNo: any;
    personalEmail: string;
    emergencyContactName: any;
    emergencyContactRelation: any;
    isGccNationality: boolean;
    nationality: string;
    personalAddress?: string;
    dateOfJoin: string;
    employeeId: number;
    designation: string;
    department: string;
    jobType: string;
    reportingStaff: string;
    workingDays: string;
    workingHours: string;
    workLocation: string;
    schedule: string;
    // status: string;
    basicPay: string;
    travelAllowances: string;
    homeAllowances: string;
    medicalAllowances: string;
    otherAllowances: string;
    other: string;
    accountName: string;
    accountNumber: string;
    swiftCode: string;
    bankName: string;
    bankBranch: string;
    ibanNumber: string;
    accountType: string;
    beneficiaryName: string;
    routingCode: string;
    validated: boolean;
    errors: string[];
    corporateUser?: string;
};
type EmployeeModalProps = {
    open: boolean;
    handleCancel: () => void;
    employeeData: InitialStateDataType | undefined;
    employeeIndex: number | undefined;
};

const EmployeeModal = ({ open, handleCancel, employeeData, employeeIndex }: EmployeeModalProps) => {
    const [fullName, setFullName] = useState<string>(employeeData?.fullName || '');

    // const birthDateString = employeeData?.dateOfBirth
    //     ? employeeData?.dateOfBirth.substring(0, 10)
    //     : '';

    function formatBirthDate(dateOfBirth: any) {
        if (dateOfBirth instanceof Date) {
            return dateOfBirth.toISOString().substring(0, 10);
        }
        if (typeof dateOfBirth === 'string') {
            return dateOfBirth.substring(0, 10);
        }
        return ''; // Return empty string if none of the conditions match
    }

    const birthDateString = formatBirthDate(employeeData?.dateOfBirth);

    const initialSchedule = employeeData?.schedule || ''; // "1 AM - 2 AM"

    const timeRange = employeeData?.schedule;

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

    const [workTime, setWorkTime] = useState<number>(0);
    const { bulkValidate, isLoading } = useBulkValidateApi();
    const activeOptions = [
        { key: 1, id: 1, value: 'ACTIVE', label: 'Active', name: 'ACTIVE' },
        { key: 2, id: 2, value: 'LEAVE', label: 'Leave', name: 'LEAVE' },
        { key: 3, id: 3, value: 'RESIGNED', label: 'Resigned', name: 'RESIGNED' },
        { key: 4, id: 4, value: 'SUSPENDED', label: 'Suspended', name: 'SUSPENDED' },
    ];

    const [searchText, setSearchText] = useState<string>(''); // State to hold the search text

    const { countriesList } = useGeneralApi();
    const { data } = useReportingStaffApi('');

    const transformedData = data.map(item => ({
        ...item,
        value: item.label,
    }));

    const dispatch = useAppDispatch();
    const jsonData = useAppSelector(state => state.reducer.BulkUpload);

    const handleTimeChange = (value: any, dateString: any) => {
        const start = moment(dateString[0], 'h:mm A');
        const end = moment(dateString[1], 'h:mm A');
        const duration = moment.duration(end.diff(start));

        const time = `${duration.hours()}.${duration.minutes()}`;
        setWorkTime(parseFloat(time));
    };
    const handleUpdateEmployee = (values: any) => {
        dispatch(updateEmployeeDetails({ index: employeeIndex!, data: values }));
        handleCancel();
    };
    const jobTypeOptions = [
        { key: 1, id: 1, value: 'PART TIME', label: 'Part-Time', name: 'PART TIME' },
        { key: 2, id: 2, value: 'FULL TIME', label: 'Full-Time', name: 'FULL-TIME' },
    ];

    const allEmployees = useAppSelector(state => state.reducer.BulkUpload);

    // Filter out the employee at the given index
    const otherEmployees = allEmployees.filter((_, index) => index !== employeeIndex);

    return (
        <CustomModalWithForm
            modalTitle="Employee"
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={values => {
                const submissionValues = { ...values };

                if (!submissionValues.reportingStaff) {
                    delete submissionValues.reportingStaff;
                }
                if (!submissionValues.emergencyContactName) {
                    delete submissionValues.emergencyContactName;
                }
                if (!submissionValues.emergencyContactRelation) {
                    delete submissionValues.emergencyContactRelation;
                }
                if (!submissionValues.emergencyNo) {
                    delete submissionValues.emergencyNo;
                }
                if (!submissionValues.otherAllowances) {
                    delete submissionValues.otherAllowances;
                }
                if (!submissionValues.others) {
                    delete submissionValues.others;
                }
                if (!submissionValues.swiftCode) {
                    delete submissionValues.swiftCode;
                }
                if (!submissionValues.routingCode) {
                    delete submissionValues.routingCode;
                }

                handleUpdateEmployee(submissionValues);
                const allEmployeesData = [...allEmployees];

                if (employeeIndex !== undefined) {
                    allEmployeesData.splice(employeeIndex, 1, submissionValues);
                }
                const payload = {
                    jsonData: allEmployeesData,
                };

                bulkValidate(payload); // Assuming bulkValidate takes an array of objects
                handleCancel();
            }}
            initialValues={{
                fullName: employeeData?.fullName || '',

                dateOfBirth: birthDateString || '',
                gender: employeeData?.gender || '',
                mobileNo: employeeData?.mobileNo || '',
                personalEmail: employeeData?.personalEmail || '', // Initial value for email field
                emergencyNo: employeeData?.emergencyNo || null, // Initial value for emergency contact number
                emergencyContactName: employeeData?.emergencyContactName || null, // Initial value for emergency contact Name
                emergencyContactRelation: employeeData?.emergencyContactRelation || null,

                nationality: employeeData?.nationality || null,

                dateOfJoin: employeeData?.dateOfJoin
                    ? moment(employeeData?.dateOfJoin).format('YYYY-MM-DD')
                    : dayjs().format('YYYY-MM-DD'),
                designation: employeeData?.designation || '',
                employeeId: employeeData?.employeeId || '',
                reportingStaff: employeeData?.reportingStaff || null,
                department: employeeData?.department || '',
                // workingDays: employeeData?.workingDays || 0,
                workingHours: employeeData?.workingHours || 0,
                // status: employeeData?.status || '',
                schedule: employeeData?.schedule || undefined,
                jobType: employeeData?.jobType || '',

                basicPay: employeeData?.basicPay || 0,
                homeAllowances: employeeData?.homeAllowances || 0,
                travelAllowances: employeeData?.travelAllowances || 0,
                medicalAllowances: employeeData?.medicalAllowances || 0,
                otherAllowances: employeeData?.otherAllowances || null,
                other: employeeData?.other || null,
                beneficiaryName: employeeData?.beneficiaryName || '',
                accountNumber: employeeData?.accountNumber || '',
                bankName: employeeData?.bankName || '',
                swiftCode: employeeData?.swiftCode || null,
                ibanNumber: employeeData?.ibanNumber || '',
                routingCode: employeeData?.routingCode || null,
            }}
            validationSchema={bulkUploadSchema}
        >
            <Form layout="vertical" onFinish={handleUpdateEmployee}>
                <TextInput
                    label="Full name"
                    isRequired
                    name="fullName"
                    placeholder={undefined}
                    type="text"
                    allowAlphabetsAndSpaceOnly
                />
                <DatePickerInput
                    label="Date of birth"
                    isRequired
                    name="dateOfBirth"
                    placeholder="Select Date"
                    classes=" rounded-sm w-full"
                    maxDate={dayjs().subtract(18, 'year')}
                    value={employeeData?.dateOfBirth ? dayjs(employeeData.dateOfBirth) : undefined} // Set initial value here
                />

                <TextInput
                    label="Mobile number"
                    name="mobileNo"
                    allowNumbersOnly
                    maxLength={10}
                    placeholder="Enter mobile number"
                    type="text"
                    isRequired
                />

                <TextInput
                    label="Email"
                    name="personalEmail"
                    type="text"
                    placeholder="Enter email address"
                    isRequired
                />

                <SelectInput
                    isRequired
                    label="Gender"
                    name="gender"
                    placeholder="Enter gender"
                    classes=" rounded-sm "
                    options={genderOptions}
                />

                <TextInput
                    label="Emergency Contact Number"
                    name="emergencyNo"
                    type="text"
                    placeholder="Enter emergency contact number"
                    maxLength={10}
                    allowNumbersOnly
                />
                <TextInput
                    label="Emergency Contact Name"
                    name="emergencyContactName"
                    type="text"
                    placeholder="Enter emergency contact name"
                    allowAlphabetsAndSpaceOnly
                />
                <TextInput
                    label="Emergency Contact Relation"
                    name="emergencyContactRelation"
                    type="text"
                    placeholder="Enter emergency contact name"
                    allowAlphabetsAndSpaceOnly
                />

                <SelectInputCustom
                    isRequired
                    label="Nationality"
                    name="nationality"
                    options={countriesList ?? []}
                    placeholder="Nationality"
                    classes="rounded-sm"
                    onSearch={setSearchText}
                />
                <DatePickerInput
                    label="Join Date"
                    isRequired
                    name="dateOfJoin"
                    placeholder="Select Date"
                    classes=" rounded-sm w-full"
                    maxDate={dayjs(new Date())}
                />
                <TextInput
                    label="Employee ID"
                    isRequired
                    name="employeeId"
                    placeholder="Employee ID"
                    type="text"
                    maxLength={12}
                />
                <TextInput
                    isRequired
                    label="Department"
                    name="department"
                    type="text"
                    maxLength={40}
                    placeholder="Select department"
                    allowAlphabetsSpaceAndNumbersOnly
                />
                <SelectInput
                    isRequired
                    label="Job Type"
                    name="jobType"
                    placeholder="Job Type"
                    classes=" rounded-sm "
                    options={jobTypeOptions}
                />
                {/* <SelectInput
                    isRequired
                    label="Status"
                    name="status"
                    placeholder="Select status"
                    classes=" rounded-sm "
                    options={activeOptions}
                /> */}

                <SelectInput
                    label="Reporting Staff"
                    name="reportingStaff"
                    placeholder="Select Reporting Staff"
                    options={transformedData}
                    allowClear
                />

                <Flex vertical gap={8}>
                    <Field name="schedule">
                        {({ field, form: { touched, errors, setFieldValue } }: FieldProps) => (
                            <Form.Item
                                name="schedule"
                                validateStatus={touched.schedule && errors.schedule ? 'error' : ''}
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
                </Flex>

                <TextInput
                    isRequired
                    label="Designation"
                    name="designation"
                    placeholder="Designation"
                    classes=" rounded-sm "
                    type="string"
                />

                <TextInput
                    isRequired
                    label="Monthly Basic"
                    name="basicPay"
                    placeholder="Basic Salary"
                    type="text"
                    allowNumbersOnly
                    maxLength={5}
                />

                <TextInput
                    label="House Rent Allowance"
                    name="homeAllowances"
                    placeholder="House Rent Allowance:"
                    type="text"
                    allowNumbersOnly
                    maxLength={5}
                    isRequired
                />

                <TextInput
                    label="Travel  Allowances"
                    name="travelAllowances"
                    placeholder="Travel  Allowances"
                    type="text"
                    allowNumbersOnly
                    maxLength={5}
                    isRequired
                />
                <TextInput
                    label="Medical  Allowances"
                    name="medicalAllowances"
                    placeholder="Enter Medical  Allowances"
                    type="text"
                    isRequired
                    allowNumbersOnly
                    maxLength={5}
                />

                <TextInput
                    label="Other Allowances"
                    name="otherAllowances"
                    placeholder="Enter Other Allowances"
                    type="text"
                    maxLength={5}
                />

                <TextInput label="Other" name="other" placeholder="Enter Others" type="text" />

                <TextInput
                    label="Beneficiary Name"
                    name="beneficiaryName"
                    placeholder="Beneficiary Name"
                    type="text"
                    maxLength={20}
                />

                <TextInput
                    label="Account Number"
                    name="accountNumber"
                    placeholder="Account Number"
                    type="text"
                    allowNumbersOnly
                    maxLength={16}
                />
                <TextInput
                    label="Bank Name"
                    name="bankName"
                    placeholder="Bank Name"
                    type="text"
                    maxLength={20}
                />
                <TextInput
                    label="Swift Code"
                    name="swiftCode"
                    placeholder="Swift Code"
                    type="text"
                    maxLength={6}
                />
                <TextInput
                    label="IBAN Number"
                    name="ibanNumber"
                    placeholder="AEXXXXXXXXXXXXXXXXXX"
                    type="text"
                    maxLength={23}
                    tooltipText="23 character code starting with 'AE'"
                    showToolTip
                />
                <TextInput
                    label="Routing Code"
                    name="routingCode"
                    placeholder="Routing Code"
                    type="text"
                    maxLength={10}
                    allowNumbersOnly
                />
            </Form>
        </CustomModalWithForm>
    );
};

export default EmployeeModal;
