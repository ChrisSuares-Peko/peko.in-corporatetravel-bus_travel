import { useState, useEffect } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Input, Row, Skeleton, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { Formik, Form } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import DatePickerInput from '@components/atomic/inputs/DatePickerInput';

import ProcessSalaryTable from '../components/EmployeeSalary/ProcessSalaryTable';
import SalaryStatusBadge from '../components/salaryStatusBadge';
import { useApproveSalaryApi } from '../hooks/employeeSalaryHooks/salaryTableHooks/useApproveSalaryApi';
import { useGetEmployeeSalaryApi } from '../hooks/employeeSalaryHooks/salaryTableHooks/useGetSalaryProcessDetailsApi';
import { processSalarySchema } from '../schema/processSalary/processSalarySchema';

function getMonthName(monthNumber: any) {
    const date = new Date(2020, monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
}
function formatDate(dateString: any) {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
}
function ProcessSalary() {
    const location = useLocation();
    const state = location.state || {};
    const { month, year } = state;

    const [checked, setChecked] = useState(true);
    const navigate = useNavigate();
    const { updateRecordSalary, isLoading } = useApproveSalaryApi();
    const {
        data: processSalaryData,
        getProcessSalaryList,
        isLoading: processSalaryLoading,
    } = useGetEmployeeSalaryApi();

    useEffect(() => {
        if (typeof month === 'undefined' || typeof year === 'undefined') {
            navigate('/payroll/employees-salary');
        } else {
            getProcessSalaryList(month, year);
        }
    }, [month, year, getProcessSalaryList, navigate]);

    const handleProcessSalary = async (values: any) => {
        const payload = {
            ...values,
            month,
            year,
        };
        const success = await updateRecordSalary(payload);

        if (success) {
            navigate('/payroll/employees-salary/process-salary/success', {
                state: { month, year },
            });
        }
    };

    const handleChange = (e: any) => {
        setChecked(e.target.checked);
    };
    let isDisabled = false;
    let toolTip = '';
    if (processSalaryData?.data?.paymentStatus === 'UPCOMING') {
        isDisabled = true;
        toolTip = 'You cannot approve upcoming months salaries.';
    } else if (processSalaryData?.data?.paymentStatus === 'PAID') {
        isDisabled = true;
        toolTip = 'Salary is already paid for this month';
    } else if (processSalaryData?.data?.paymentStatus === 'APPROVED') {
        isDisabled = true;
        toolTip = 'Salary is already approved for this month';
    } else if (processSalaryData?.data?.paymentStatus === 'N/A') {
        isDisabled = true;
        toolTip = 'Salary status is not available';
    }

    return (
        <>
            {processSalaryLoading ? (
                <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
                <Col xs={24}>
                    <Flex>
                        <Typography.Text className="font-medium">
                            Review Salary Details
                        </Typography.Text>
                    </Flex>

                    <Flex
                        className="mt-8 border border-gray-200 border-solid p-7 rounded-xl"
                        vertical
                    >
                        <Flex justify="space-around">
                            <Formik
                                initialValues={{
                                    payingDate: processSalaryData?.data?.payingDate || '',
                                    month,
                                    year,
                                    sendPayslip: processSalaryData?.data?.sendPayslip || true,
                                }}
                                validationSchema={processSalarySchema}
                                onSubmit={(values, { setSubmitting }) => {
                                    handleProcessSalary(values);
                                    setSubmitting(false);
                                }}
                            >
                                {({ handleSubmit }) => (
                                    <Form className="w-full">
                                        <Row gutter={7}>
                                            <Col md={3} xs={24} sm={24}>
                                                <DatePickerInput
                                                    name="payingDate"
                                                    label="Paying Date"
                                                    placeholder="Select Date"
                                                    classes="rounded-sm "
                                                    minDate={dayjs(new Date())}
                                                    isDisabled={isDisabled}
                                                    needConfirm={false}
                                                />
                                            </Col>

                                            <Col md={2} xs={24}>
                                                <Flex vertical className="mt-2">
                                                    <Typography.Text>Month</Typography.Text>
                                                    <Typography.Text className="mt-3">
                                                        {getMonthName(
                                                            processSalaryData?.data.month
                                                        )}
                                                    </Typography.Text>
                                                </Flex>
                                            </Col>
                                            <Col md={3} xs={24}>
                                                <Flex vertical className="mt-2" wrap="wrap">
                                                    <Typography.Text>Salary Cycle</Typography.Text>
                                                    <Typography.Text className="mt-3">
                                                        {formatDate(
                                                            processSalaryData?.data?.cycleStart.split(
                                                                'T'
                                                            )[0]
                                                        )}
                                                        -
                                                        {formatDate(
                                                            processSalaryData?.data?.cycleEnd.split(
                                                                'T'
                                                            )[0]
                                                        )}
                                                    </Typography.Text>
                                                </Flex>
                                            </Col>

                                            <Col md={3} xs={24}>
                                                <Flex
                                                    vertical
                                                    className="mt-2"
                                                    justify="flex-start"
                                                >
                                                    <Typography.Text>
                                                        No. of Working Days
                                                    </Typography.Text>
                                                    <Typography.Text className="mt-3">
                                                        {
                                                            processSalaryData?.data
                                                                .organizationWorkingDays
                                                        }
                                                    </Typography.Text>
                                                </Flex>
                                            </Col>
                                            <Col md={3} xs={24}>
                                                <Flex vertical className="mt-2">
                                                    <Typography.Text>
                                                        No. of Employees
                                                    </Typography.Text>
                                                    <Typography.Text className="mt-3">
                                                        {processSalaryData?.data.noOfEmployees}
                                                    </Typography.Text>
                                                </Flex>
                                            </Col>

                                            <Col md={3} xs={24}>
                                                <Flex vertical className="mt-2">
                                                    <Typography.Text>
                                                        Total Deduction
                                                    </Typography.Text>
                                                    <Typography.Text className="mt-3">
                                                        AED{' '}
                                                        {processSalaryData?.data.totalDeduction
                                                            .toFixed(2)
                                                            .toLocaleString()}
                                                    </Typography.Text>
                                                </Flex>
                                            </Col>
                                            <Col md={2} xs={24}>
                                                <Flex
                                                    vertical
                                                    className="mt-2"
                                                    justify="flex-start"
                                                >
                                                    <Typography.Text className="">
                                                        Total Payable
                                                    </Typography.Text>
                                                    <Typography.Text className="mt-3">
                                                        AED{' '}
                                                        {processSalaryData?.data.totalPayable.toLocaleString()}
                                                    </Typography.Text>
                                                </Flex>
                                            </Col>

                                            <Col md={4} xs={24}>
                                                <Flex gap={2} align="" vertical className="mt-2">
                                                    <SalaryStatusBadge
                                                        status={
                                                            processSalaryData?.data?.paymentStatus
                                                        }
                                                    />

                                                    <Tooltip title={toolTip}>
                                                        <Button
                                                            htmlType="submit"
                                                            className="mt-2 w-38"
                                                            // className=" mt-2 w-36"
                                                            type="primary"
                                                            danger
                                                            disabled={isDisabled}
                                                            loading={isLoading}
                                                        >
                                                            Approve and Record
                                                        </Button>
                                                    </Tooltip>
                                                </Flex>
                                            </Col>
                                        </Row>
                                        <CheckboxInput
                                            name="sendPayslip"
                                            checked={checked}
                                            onChange={handleChange}
                                        >
                                            <Typography.Text className="mt-6">
                                                Generate and send Payslip to all the employees
                                            </Typography.Text>
                                        </CheckboxInput>
                                    </Form>
                                )}
                            </Formik>
                        </Flex>
                    </Flex>
                </Col>
            )}

            <Col md={24}>
                <Input
                    className="mt-8"
                    placeholder="Search Employee by name, role or ID  "
                    suffix={<SearchOutlined />}
                    allowClear
                />
            </Col>
            <Col xs={24} className="mt-6">
                <ProcessSalaryTable month={month} year={year} />
            </Col>
        </>
    );
}

export default ProcessSalary;
