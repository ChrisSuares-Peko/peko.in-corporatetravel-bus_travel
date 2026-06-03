import { useState } from 'react';

import { Button, Col, Flex, Form, Row, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { Field, FieldProps, Formik } from 'formik';
import moment from 'moment';

import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import DatePickerInput from './DatePickerInput';
import SelectInput from './SelectInput';
import { useGetDepartmentList } from '../../hooks/employeeHooks/useGetDepartment';
import { useValidateEmployeeApi } from '../../hooks/employeeHooks/useGetValidateEmployeeInfoApi';
import useReportingStaffApi from '../../hooks/employeeHooks/useReportingStaffApi';
import { employeeSchema } from '../../schema/employeeProfile';
import { setEmployeeData } from '../../slices/employeeSlices';
import { probationOptions } from '../../utils/employeeDetails/utils';

type Props = {
    nextTab: (key: string) => void;
};

const EmployeeInfo = ({ nextTab }: Props) => {
    const { tableData } = useGetDepartmentList();
    const { validateEmployee } = useValidateEmployeeApi();

    const { data } = useReportingStaffApi('');

    const dispatch = useAppDispatch();

    const handleReportingStaffClick = () => {
        // Check if data length is zero
        if (data.length === 0) {
            dispatch(
                showToast({
                    variant: 'warning',
                    description: 'No employees have been added to show as reporting staff.',
                })
            );
        }
    };
    const { employeeInformation } = useAppSelector(state => state.reducer.employeeDetails);

    const [workTime, setWorkTime] = useState<number>(0);

    const jobTypeOptions = [
        { key: 1, id: 1, value: 'PART TIME', label: 'Part-Time', name: 'PART TIME' },
        { key: 2, id: 2, value: 'FULL TIME', label: 'Full-Time', name: 'FULL-TIME' },
    ];

    const handleEmployeeInfoSubmit = async (values: any) => {
        const validationPayload = { employeeId: values.employeeId, dateOfJoin: values.dateOfJoin };
        const result = await validateEmployee(validationPayload);

        if (result?.data?.status) {
            dispatch(setEmployeeData(values));
            nextTab('3');
        }
    };

    return (
        <Flex vertical className=" my-8">
            <Formik
                initialValues={{
                    dateOfJoin: employeeInformation.dateOfJoin
                        ? moment(employeeInformation.dateOfJoin).format('YYYY-MM-DD')
                        : dayjs().format('YYYY-MM-DD'),
                    employeeId: employeeInformation.employeeId || '',
                    reportingStaff: employeeInformation.reportingStaff || null,
                    department: employeeInformation.department.id || '',

                    workingHours: employeeInformation.workingHours || 0,

                    probation: '',
                    jobType: employeeInformation.jobType || '',
                    designation: employeeInformation.designation || '',
                    schedule: '',
                }}
                onSubmit={values => {
                    values.workingHours = workTime;

                    handleEmployeeInfoSubmit(values);
                }}
                validationSchema={employeeSchema}
            >
                {({ handleSubmit }) => (
                    <Form layout="vertical" onFinish={handleSubmit} className="w-full">
                        <Flex justify="center">
                            <Col span={16}>
                                <Row>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <DatePickerInput
                                            label="Join Date"
                                            isRequired
                                            name="dateOfJoin"
                                            placeholder="Select Date"
                                            classes=" rounded-sm w-full"
                                            maxDate={dayjs(new Date())}
                                            defaultValue={dayjs()}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label="Employee ID"
                                            isRequired
                                            name="employeeId"
                                            placeholder="Employee ID"
                                            type="text"
                                            maxLength={11}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <SelectInputWithSearch
                                            isRequired
                                            label="Department"
                                            name="department"
                                            placeholder="Select Department"
                                            // defaultValue={employeeInformation.department.departmentName||""}
                                            options={tableData}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <SelectInput
                                            label="Reporting Staff"
                                            name="reportingStaff"
                                            placeholder={
                                                data.length > 0
                                                    ? 'Select Reporting Staff'
                                                    : 'No data available'
                                            }
                                            options={data}
                                            onClick={handleReportingStaffClick}
                                            allowClear
                                        />
                                    </Col>
                                    {/* <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label=" No. of working days in a month"
                                            name="workingDays"
                                            placeholder=" Working Days"
                                            isRequired
                                            type="text"
                                            maxLength={2}
                                            allowNumbersOnly
                                        />
                                    </Col> */}
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <Flex vertical gap={8}>
                                            <Field name="schedule">
                                                {({
                                                    field,
                                                    form: { touched, errors, setFieldValue },
                                                }: FieldProps) => (
                                                    <Form.Item
                                                        name="schedule"
                                                        validateStatus={
                                                            touched.schedule && errors.schedule
                                                                ? 'error'
                                                                : ''
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
                                                            onChange={range => {
                                                                if (range) {
                                                                    const [start, end] = range;
                                                                    const formattedRange =
                                                                        start && end
                                                                            ? `${start.format('h:mm A')} - ${end.format('h:mm A')}`
                                                                            : '';
                                                                    setFieldValue(
                                                                        'schedule',
                                                                        formattedRange
                                                                    );
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
                                    </Col>

                                    <Col xs={24} sm={10} className="mx-auto">
                                        <SelectInput
                                            isRequired
                                            label="Probation Period"
                                            name="probation"
                                            placeholder="Probation Period"
                                            classes=" rounded-sm "
                                            options={probationOptions}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            isRequired
                                            label="Designation"
                                            name="designation"
                                            placeholder="Designation"
                                            classes=" rounded-sm "
                                            type="string"
                                            maxLength={50}
                                            // allowAlphabetsAndSpaceOnly //allowing all as per User feedback
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <SelectInput
                                            isRequired
                                            label="Job Type"
                                            name="jobType"
                                            placeholder="Job Type"
                                            classes=" rounded-sm "
                                            options={jobTypeOptions}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="hidden md:block mx-auto" />
                                </Row>
                                <Flex justify="space-between" className=" mt-4 mx-8 ">
                                    <Button
                                        onClick={() => nextTab('1')}
                                        type="default"
                                        danger
                                        className=" font-semibold w-[8rem] "
                                    >
                                        Back
                                    </Button>

                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        danger
                                        className=" font-semibold w-[8rem] "
                                    >
                                        Next
                                    </Button>
                                </Flex>
                            </Col>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};

export default EmployeeInfo;
