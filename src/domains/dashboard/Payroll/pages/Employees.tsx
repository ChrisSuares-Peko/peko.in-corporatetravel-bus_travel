import { useEffect, useState } from 'react';

import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row, Tabs, TabsProps, Typography, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import useDebounce from '@src/hooks/useDebounce';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import DepartmentTab from '../components/Employees/DepartmentTab';
import EmployeesListTab from '../components/Employees/EmployeesListTab';
import LeaveModal from '../components/Leaves/LeaveModal';
import DepartmentModal from '../components/modals/AddDepartmentModal';
import BulkUploadModal from '../components/modals/BulkUploadModal';
import OffBoardEmployeeModal from '../components/modals/OffBoardEmployeeModal';
import SelectEmployeeModal from '../components/modals/SelectEmployeeModal';
import { useGetEmployee } from '../hooks/dashboardHooks/useGetEmployeeApi';
import { useGetDepartmentList } from '../hooks/departmentHooks/useGetDepartmentList';

function Employees() {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const [departmentCount, setDepartmentCount] = useState<number>(0);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>('');
    const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
    const [offboardReload, setOffboardReload] = useState<boolean>(false);
    const debouncedSearch = useDebounce(searchText, 500);

    const {
        tableData,
        count,
        isLoading,
        refetch,
        departmentCount: dCount,
        setRefresh,
    } = useGetDepartmentList(debouncedSearch, page, limit);

    useEffect(() => {
        setDepartmentCount(dCount);
        setLoadingInitial(false);
    }, [dCount]);

    const handleNewEmployeeClick = () => {
        if (loadingInitial) {
            return;
        }
        if (departmentCount === 0) {
            dispatch(
                showToast({
                    variant: 'warning',
                    description: 'Department selection required for new employee entry ',
                })
            );
        } else {
            navigate(paths.payroll.addEmployee);
        }
    };

    const [openAddDepartmentModal, setOpenAddDepartmentModal] = useState(false);
    const [openOffBoardEmployeeModal, setOpenOffBoardEmployeeModal] = useState(false);
    const [openSelectEmployeeModal, setOpenSelectEmployeeModal] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <span style={{ color: '#667085' }}>Active Employees</span>,
            children: (
                <EmployeesListTab
                    updateDepartmentCount={setDepartmentCount}
                    employeeStatus="active"
                    offboardReload={offboardReload}
                />
            ),
        },
        {
            key: '2',
            label: <span style={{ color: '#667085' }}>Departments</span>,
            children: (
                <DepartmentTab
                    updateDepartmentCount={setDepartmentCount}
                    tableData={tableData}
                    count={count}
                    isLoading={isLoading}
                    page={page}
                    searchText={searchText}
                    setPage={setPage}
                    setRefresh={setRefresh}
                    setSearchText={setSearchText}
                />
            ),
        },
        {
            key: '3',
            label: <span style={{ color: '#667085' }}>Past Employees</span>,
            children: (
                <EmployeesListTab
                    updateDepartmentCount={setDepartmentCount}
                    employeeStatus="past"
                    offboardReload={offboardReload}
                />
            ),
        },
    ];

    const navigate = useNavigate();
    const { data, generateEmployeesDropdown } = useGetEmployee();
    const handleEmployeeSelected = (employeeData: any) => {
        setSelectedEmployee(employeeData);

        setOpenSelectEmployeeModal(false); // Close the SelectEmployeeModal
        setOpenOffBoardEmployeeModal(true); // Open the OffBoardEmployeeModal
    };

    const handleCreate = () => {
        refetch();
    };
    const [openLeaveApplicationModal, setOpenLeaveApplicationModal] = useState(false);
    const [openBulkUploadModal, setOpenBulkUploadModal] = useState(false);
    const [activeTab, setActiveTab] = useState<number | string>(1);
    return (
        <Content>
            <Row className="mt-2">
                <Col span={24}>
                    <Flex className="md:justify-between  md:flex-row xs:flex-col">
                        {Number(activeTab) === 1 || Number(activeTab) === 3 ? (
                            <Typography.Paragraph className="text-neutral-700 text-xl font-medium xs:font-normal text-center md:mt-4">
                                Employees
                            </Typography.Paragraph>
                        ) : (
                            <Typography.Paragraph className="text-neutral-700 text-xl font-medium">
                                Departments
                            </Typography.Paragraph>
                        )}

                        <Flex
                            gap={8}
                            className="md:justify-end xs:mt-1 xs:flex-col md:flex-row sm:w-32"
                        >
                            <Button
                                type="primary"
                                danger
                                style={{
                                    backgroundColor: colorPrimary,
                                    color: 'white',
                                }}
                                onClick={handleNewEmployeeClick}
                                icon={<PlusCircleOutlined />}
                                className="md:w-36"
                            >
                                New Employee
                            </Button>
                            <Button danger onClick={() => setOpenBulkUploadModal(true)}>
                                Import Employees
                            </Button>
                            <Button danger onClick={() => setOpenAddDepartmentModal(true)}>
                                Add Department
                            </Button>
                            <Button danger onClick={() => setOpenLeaveApplicationModal(true)}>
                                Add Leave
                            </Button>
                            <Button danger onClick={() => setOpenSelectEmployeeModal(true)}>
                                Offboard Employee
                            </Button>
                        </Flex>
                    </Flex>
                </Col>
            </Row>
            <Row>
                <Col xs={24} className="md:mt-10 mt-5">
                    <Tabs defaultActiveKey="1" onChange={e => setActiveTab(e)} items={items} />
                </Col>
            </Row>
            <LeaveModal
                open={openLeaveApplicationModal}
                handleCancel={() => setOpenLeaveApplicationModal(false)}
            />
            {openAddDepartmentModal && (
                <DepartmentModal
                    setRefresh={setRefresh}
                    open={openAddDepartmentModal}
                    handleCancel={() => setOpenAddDepartmentModal(false)}
                    handleCreate={handleCreate}
                />
            )}

            {openBulkUploadModal && (
                <BulkUploadModal
                    open={openBulkUploadModal}
                    handleCancel={() => setOpenBulkUploadModal(false)}
                />
            )}

            {openSelectEmployeeModal && (
                <SelectEmployeeModal
                    onEmployeeSelect={handleEmployeeSelected}
                    open={openSelectEmployeeModal}
                    handleCancel={() => setOpenSelectEmployeeModal(false)}
                />
            )}
            {openOffBoardEmployeeModal && (
                <OffBoardEmployeeModal
                    open={openOffBoardEmployeeModal}
                    handleCancel={() => setOpenOffBoardEmployeeModal(false)}
                    handleCreate={handleCreate}
                    setRefresh={setRefresh}
                    employeeData={selectedEmployee}
                    setOffboardReload={setOffboardReload}
                />
            )}
        </Content>
    );
}

export default Employees;
