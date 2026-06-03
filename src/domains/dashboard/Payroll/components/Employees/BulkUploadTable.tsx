import { useEffect, useState } from 'react';

import { Col, Row, Typography, Table, Button } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import moment from 'moment';
import '../../assets/styles.css';

import { useAppSelector } from '@src/hooks/store';

import { EmployeeDisplayType } from '../../utils/data';
import BulkUploadCreateModal from '../modals/BulkUploadCreateModal';

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
    jobType: string;
    schedule: string;
    designation: string;
    department: string;
    reportingStaff: string;
    workingDays: string;
    workingHours: string;
    workLocation: string;
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
const BulkEmployeesTable = ({ onCountChange }: any) => {
    const jsonData = useAppSelector(state => state.reducer.BulkUpload);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const errorCount = jsonData.filter(item => item.errors.length > 0).length;

        const successCount = jsonData.filter(item => item.errors.length === 0).length;
        onCountChange(jsonData.length, errorCount, successCount);
    }, [jsonData, onCountChange]);

    const employeeTypeData: EmployeeDisplayType[] = jsonData.map(item => ({
        id: item.employeeId,
        fullName: item.fullName,
        errors: item.errors,
        status: item.validated,
        joinDate: item.dateOfJoin,
        role: item.designation,
    }));

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<InitialStateDataType | undefined>(
        undefined
    );
    const [selectedEmployeeInfo, setSelectedEmployeeInfo] = useState<{
        data: InitialStateDataType | undefined;
        index: number;
    }>();
    const handleClick = (id: any) => {
        const index = jsonData.findIndex(item => item.employeeId === id);
        const employee = jsonData[index];
        if (employee) {
            setIsModalVisible(true);
            setSelectedEmployee(employee);
            setSelectedEmployeeInfo({ data: employee, index });
            // You can do something with the employee data here
        }
        setIsModalVisible(true);
    };

    const columns: TableColumnsType<EmployeeDisplayType> = [
        {
            title: '#',
            key: 'serial',
            render: (text, record, index) => (current - 1) * pageSize + index + 1,
        },
        {
            title: <Typography.Text style={{ color: '#42526D' }}>Full Name</Typography.Text>,
            dataIndex: 'fullName',

            render: (fullName: string) => <Typography.Text>{fullName}</Typography.Text>,
        },
        {
            title: <Typography.Text style={{ color: '#42526D' }}>Designation</Typography.Text>,
            dataIndex: 'role',
            render: (role: string) => <Typography.Text>{role}</Typography.Text>,
        },
        {
            title: <Typography.Text style={{ color: '#42526D' }}>Date Of Join</Typography.Text>,
            dataIndex: 'joinDate',
            render: (joinDate: string) => (
                <Typography.Text>{moment(joinDate).format('MMMM DD, YYYY')}</Typography.Text>
            ),
        },
        {
            title: <Typography.Text style={{ color: '#42526D' }}>Status</Typography.Text>,
            dataIndex: 'errors',
            render: (errors: string[]) => (
                <Typography.Text style={{ color: errors.length === 0 ? 'green' : 'red' }}>
                    {errors.length === 0 ? 'Success' : `Error (${errors.length})`}
                </Typography.Text>
            ),
        },
        {
            title: <Typography.Text style={{ color: '#42526D' }}>Message</Typography.Text>,
            dataIndex: 'errors',
            render: (errors: string[]) => (
                <ul style={{ color: 'red' }}>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            ),
        },

        {
            title: '',
            dataIndex: 'id',
            width: '10%',
            render: (id: number) => (
                <Button type="link" onClick={() => handleClick(id)} style={{ color: 'red' }}>
                    View and Edit
                </Button>
            ),
        },
    ];

    const handleTableChange: TableProps<EmployeeDisplayType>['onChange'] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        if (pagination.current) setCurrent(pagination.current);
        if (pagination.pageSize) setPageSize(pagination.pageSize);
    };
    const titleStyle = {
        backgroundColor: '#42526D',
        color: 'white',
    };

    return (
        <>
            <Row className="mt-4" gutter={[0, 20]}>
                <Col span={24}>
                    <Table
                        rowKey={record => record.id}
                        columns={columns}
                        scroll={{ x: 992 }}
                        dataSource={employeeTypeData}
                        onChange={handleTableChange}
                        pagination={{ current, pageSize, total: jsonData.length }}
                    />
                </Col>
            </Row>
            {isModalVisible && (
                <BulkUploadCreateModal
                    open={isModalVisible}
                    handleCancel={() => setIsModalVisible(false)}
                    // employeeData={selectedEmployee} // Pass the selected employee data as a prop
                    employeeData={selectedEmployeeInfo?.data}
                    employeeIndex={selectedEmployeeInfo?.index}
                />
            )}
        </>
    );
};

export default BulkEmployeesTable;
