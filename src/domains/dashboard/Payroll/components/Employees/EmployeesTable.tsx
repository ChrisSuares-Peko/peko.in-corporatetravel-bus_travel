import { lazy, useState, useEffect } from 'react';

import { InfoCircleFilled } from '@ant-design/icons';
import type { TableColumnsType, TableProps } from 'antd';
import { Col, Flex, Row, Typography, Table, Avatar, Pagination, Checkbox, Tooltip } from 'antd';
import '../../assets/styles.css';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import useDebounce from '@src/hooks/useDebounce';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import EmptyEmployeeTable from './EmptyEmployeeTable';
import { useDeleteEmployeeApi } from '../../hooks/employeeHooks/useDeleteEmployeeApi';
import { useEmployeeListApi } from '../../hooks/employeeHooks/useEmployeeListApi';
import { EmployeeTableData } from '../../types/types';
import { formatDate } from '../Dashboard/UpcomingActivityCard';
import ViewMore from '../ViewMore';

const ConfirmationModal = lazy(() => import('@components/molecular/modals/ConfirmationModal'));

interface EmployeeProps {
    searchText: string;
    employeeStatus: 'active' | 'past';
    onSelectedChange: (selectedIds: string[]) => void;
    offboardReload: boolean;
}

const EmployeesTable = ({
    searchText,
    employeeStatus,
    onSelectedChange,
    offboardReload,
}: EmployeeProps) => {
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const dispatch = useAppDispatch();
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(); // State variable to store the
    const navigate = useNavigate();
    const [sortField, setSortField] = useState<string>('dateOfJoin');
    const [sortOrder, setSortOrder] = useState<string>('desc');
    const debouncedSearch = useDebounce(searchText, 500);

    const {
        data,
        isLoading: employeeLoader,
        currentPage,
        setCurrentPage,
        count,
        refetch,
        setLimit,
    } = useEmployeeListApi({
        employeeStatus,
        offboardReload,
        sortField,
        sortOrder,
        debouncedSearch,
    });

    const { deleteUser, isLoading: isDeleting } = useDeleteEmployeeApi({
        handleCancel: () => setOpenConfirmationModal(false),
    });

    function getInitials(name: string): string {
        const words = name.split(' ');
        const initials = words
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 3)
            .toUpperCase();
        return initials;
    }

    const handleDelete = async (employeeId: string) => {
        try {
            // Call the deleteUser function from the hook with the employeeId
            setSelectedEmployeeId(employeeId);
            setOpenConfirmationModal(true);

            await deleteUser(employeeId);
            refetch();
            dispatch(
                showToast({ variant: 'success', description: 'Employee deleted successsfully' })
            );
        } catch (error) {
            dispatch(
                showToast({
                    variant: 'error',
                    description: 'Failed to delete the employee. Please try again later.',
                })
            );
        }
    };
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleCheckboxChange = (event: CheckboxChangeEvent, record: EmployeeTableData) => {
        const { checked } = event.target;

        const newSelectedIds = checked
            ? [...selectedIds, record.employeeId]
            : selectedIds.filter(id => id !== record.employeeId);

        setSelectedIds(newSelectedIds);
    };

    useEffect(() => {
        onSelectedChange(selectedIds);
    }, [selectedIds, onSelectedChange]);

    const handleSelectAllChange = (event: CheckboxChangeEvent) => {
        if (event.target.checked) {
            const allEmployeeIds = data.map(emp => emp.employeeId);
            setSelectedIds(allEmployeeIds);
        } else {
            setSelectedIds([]);
        }
    };

    const columns: TableColumnsType<EmployeeTableData> = [
        {
            title: (
                <Checkbox
                    checked={selectedIds.length === data.length && data.length > 0}
                    onChange={handleSelectAllChange}
                    disabled={data.length === 0}
                />
            ),
            dataIndex: 'select',
            key: 'select',
            width: '3%',
            render: (_, record) => (
                <Checkbox
                    onChange={e => handleCheckboxChange(e, record)}
                    checked={selectedIds.includes(record.employeeId)}
                />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            width: '25%',
            render: (text: string, record: EmployeeTableData) => (
                <Flex gap={10}>
                    <Flex
                        align="center"
                        onClick={() => {
                            navigate(`${paths.payroll.employeeProfile}`, {
                                state: {
                                    employeeId: record.id,
                                },
                            });
                            // window.location.href = `/${paths.payroll.index}/${paths.payroll.employeeDetails}/${record.id}`;
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        {record.image ? (
                            <Avatar
                                src={record.image}
                                style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
                            />
                        ) : (
                            <Avatar style={{ backgroundColor: '#fde3cf', color: 'red' }}>
                                {getInitials(text)}
                            </Avatar>
                        )}
                    </Flex>
                    <Flex
                        vertical
                        justify="center"
                        onClick={() => {
                            navigate(`${paths.payroll.employeeProfile}`, {
                                state: {
                                    employeeId: record.id,
                                },
                            });
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Typography.Text className="   font-normal">
                            {text}
                            {record.lastWorkingDay ? (
                                <Tooltip
                                    title={`This employee is under notice period. Last working day: ${formatDate(
                                        record.lastWorkingDay
                                    )}`}
                                >
                                    <InfoCircleFilled
                                        style={{
                                            marginLeft: '8px',
                                            color: '#1890ff',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </Tooltip>
                            ) : null}
                        </Typography.Text>
                        <Typography.Text className="  font-normal">
                            {record.employeeMail}
                        </Typography.Text>
                    </Flex>
                </Flex>
            ),
        },
        {
            title: 'Employee ID',
            dataIndex: 'employeeId',
            sorter: true,

            width: '13%',

            render: (text: string, record: EmployeeTableData) => (
                <Typography.Text className="  text-gray-900 font-normal">{text}</Typography.Text>
            ),
        },
        {
            title: 'Designation',
            dataIndex: 'role',
            width: '20%',
            render: (text: string, record: EmployeeTableData) => (
                <Flex gap={10}>
                    <Flex vertical justify="center">
                        <Typography.Text className="text-gray-900  font-normal">
                            {record.designation}
                        </Typography.Text>
                    </Flex>
                </Flex>
            ),
        },
        {
            title: 'Join Date',
            sorter: true,
            dataIndex: 'joinDate',
            width: '13%',
            render: (text: string) => moment(text).format('YYYY-MM-DD'),
        },

        {
            title: employeeStatus === 'past' ? 'Last Working Day' : null,
            dataIndex: 'lastWorkingDay',
            key: 'lastWorkingDay',
            width: '13%',
            render: (text: string) =>
                employeeStatus === 'past' ? moment(text).format('YYYY-MM-DD') : null,
        },

        {
            title: 'Mobile Number',
            dataIndex: 'phone',
            width: '15%',
        },

        {
            title: '',

            dataIndex: 'id',
            width: '10%',
            render: (text: number, record: EmployeeTableData) => {
                const list = [
                    {
                        label: 'View Profile',
                        path: paths.payroll.employeeProfile,
                        id: record.id,
                    },
                    {
                        label: 'Remove Profile',
                        action: () => {
                            setSelectedEmployeeId(record.id); // Set selected employee ID
                            setOpenConfirmationModal(true); // Open confirmation modal to confirm deletion
                        },
                    },
                ];
                return <ViewMore list={list} />;
            },
        },
    ];

    const handleTableChange: TableProps<EmployeeTableData>['onChange'] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        if (!Array.isArray(sorter) && sorter.order) {
            setSortField(sorter.field as string);

            setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
        }
    };

    const handlePageChange = (page: number, Limit: number) => {
        setCurrentPage(page);
        setLimit(Limit);
    };

    return (
        <Row className="mt-4" gutter={[0, 20]}>
            <Col span={24}>
                <Table
                    rowKey={record => record.employeeId}
                    columns={columns}
                    scroll={{ x: 992 }}
                    dataSource={data}
                    onChange={handleTableChange}
                    pagination={false}
                    style={{ overflow: 'auto' }}
                    locale={{ emptyText: <EmptyEmployeeTable /> }}
                    loading={employeeLoader}
                />
            </Col>
            <Col span={24}>
                {data.length > 0 && (
                    <Pagination
                        current={currentPage}
                        size="default"
                        className="md:text-end pt-7 xs:text-center"
                        total={count}
                        onChange={handlePageChange}
                        defaultPageSize={10}
                    />
                )}
            </Col>

            <ConfirmationModal
                isOpen={openConfirmationModal}
                handleCancel={() => setOpenConfirmationModal(false)}
                title="Are you sure you want to delete this employee?This action is irreversible and will permanently remove all associated data"
                handleSubmit={() => handleDelete(selectedEmployeeId!)}
                isLoading={isDeleting}
            />
        </Row>
    );
};

export default EmployeesTable;
