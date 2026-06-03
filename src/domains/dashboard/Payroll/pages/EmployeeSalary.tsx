import { useEffect, useState } from 'react';

import { Button, Col, Flex, Row, Tabs, TabsProps, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';

import EmployeesSalaryListTab from '../components/EmployeeSalary/EmployeesSalaryListTab';
import PayrollHistoryTab from '../components/EmployeeSalary/PayrollHistoryTab';
import WpsTab from '../components/EmployeeSalary/WpsTab';
import DeductionModal from '../components/modals/DeductionModal';
import IncentivesModal from '../components/modals/IncentivesModal';
import OverTimeModal from '../components/modals/OverTimeModal';
import SalaryProcessingModal from '../components/modals/SalaryProcessingModal';
import { resetSalarySlice } from '../slices/payrollSalarySlice';

function EmployeesSalary() {
    const [reloadTable, setReloadTable] = useState(false);
    const initialMonth = new Date().getMonth() + 1;
    const initialYear = new Date().getFullYear();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [salaryCycle, setSalaryCycle] = useState<any>();
    const [salaryArray, setSalaryArray] = useState([]);

    const handleDateChange = (month: any, year: any) => {
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Employees',
            children: (
                <EmployeesSalaryListTab
                    reloadTable={reloadTable}
                    onDateChange={handleDateChange}
                    handleSalaryCycle={setSalaryCycle}
                    setSalaryArray={setSalaryArray}
                />
            ),
        },
        {
            key: '2',
            label: 'Payroll History',
            children: <PayrollHistoryTab />,
            disabled: true,
        },
        {
            key: '3',
            label: 'WPS',
            children: <WpsTab />,
            disabled: true,
        },
    ];

    const [openSalaryProcessingModal, setOpenSalaryProcessingModal] = useState(false);
    const [openIncentivesModal, setOpenIncentivesModal] = useState(false);
    const [openOvertimeModal, setOpenOvertimeModal] = useState(false);
    const [openDeductionModal, setOpenDeductionModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const [selectedYear, setSelectedYear] = useState(initialYear);

    const dipatch = useAppDispatch();
    const navigate = useNavigate();
    // const payrollPath = `${paths.payroll.index}/${paths.payroll.employeesSalary}/${paths.payroll.processSalary}`;

    useEffect(() => {
        dipatch(resetSalarySlice());
    }, [dipatch]);

    return (
        <Content>
            <Row className="mt-3">
                <Col md={24} xs={24}>
                    <Flex className="md:justify-between  md:flex-row xs:flex-col">
                        <Typography.Paragraph className=" text-neutral-700 md:text-xl font-medium xs:text-sm xs:text-center md:mt-3">
                            Employees Salary
                        </Typography.Paragraph>

                        <Flex
                            gap={10}
                            className="md:justify-end xs:flex-col md:flex-row sm:w-32 mt-3"
                        >
                            <Button
                                type="primary"
                                danger
                                onClick={() =>
                                    navigate('/payroll/employees-salary/process-salary', {
                                        state: {
                                            month: selectedMonth,
                                            year: selectedYear,
                                            salaryArray,
                                        },
                                    })
                                }
                            >
                                Run Payroll
                            </Button>
                            <Button danger onClick={() => setOpenOvertimeModal(true)}>
                                Add Overtime
                            </Button>

                            <Button danger onClick={() => setOpenIncentivesModal(true)}>
                                Add Incentives
                            </Button>
                            <Button danger onClick={() => setOpenDeductionModal(true)}>
                                Add Deduction
                            </Button>
                        </Flex>
                    </Flex>
                </Col>
            </Row>

            <Row>
                <Col xs={24} className="md:mt-10 mt-5">
                    <Tabs defaultActiveKey="1" items={items} />
                </Col>
            </Row>
            {openOvertimeModal && (
                <OverTimeModal
                    open={openOvertimeModal}
                    handleCancel={() => setOpenOvertimeModal(false)}
                    reloadTable={setReloadTable}
                    year={selectedYear}
                    month={Number(selectedMonth)}
                />
            )}
            {openIncentivesModal && (
                <IncentivesModal
                    open={openIncentivesModal}
                    handleCancel={() => setOpenIncentivesModal(false)}
                    reloadTable={setReloadTable}
                    year={selectedYear}
                    month={Number(selectedMonth)}
                />
            )}
            {openDeductionModal && (
                <DeductionModal
                    year={selectedYear}
                    month={Number(selectedMonth)}
                    open={openDeductionModal}
                    handleCancel={() => setOpenDeductionModal(false)}
                    reloadTable={setReloadTable}
                />
            )}
            <SalaryProcessingModal
                open={openSalaryProcessingModal}
                handleCancel={() => setOpenSalaryProcessingModal(false)}
            />
        </Content>
    );
}

export default EmployeesSalary;
