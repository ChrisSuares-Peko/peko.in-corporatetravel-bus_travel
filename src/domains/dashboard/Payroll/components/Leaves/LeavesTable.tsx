import React, { useState } from 'react';

import { DeleteOutlined, DownloadOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Flex,
    Input,
    Pagination,
    Row,
    Select,
    Space,
    Table,
    TableColumnsType,
} from 'antd';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import useDebounce from '@src/hooks/useDebounce';
import { formattedDateOnly } from '@utils/dateFormat';

import LeaveModal from './LeaveModal';
import useLeaveFilter from '../../hooks/dashboardHooks/useLeaveFilter';
import { useDeleteLeaveApi } from '../../hooks/leaveHooks/useLeaveDeleteApi';
import { formatLeaveTypeString, useListLeave } from '../../hooks/leaveHooks/useLeaveListApi';
import { LeaveTableRow } from '../../types/leaveSection';
import { filterStates } from '../../types/types';
import { monthsArray, yearsArray } from '../../utils/salaryTable/data';

interface LeavesTableProps {
    reloadTable: boolean;
    setReloadTable: React.Dispatch<React.SetStateAction<boolean>>;
    month: number;
    year: number;
    handleChangeMonths: (value: number) => void;
    handleChangeYears: (value: number) => void;
}

const LeavesTable = ({
    reloadTable,
    setReloadTable,
    month,
    year,
    handleChangeMonths,
    handleChangeYears,
}: LeavesTableProps) => {
    const initialMonth = new Date().getMonth() + 1;
    const initialYear = new Date().getFullYear();

    const [openLeaveApplicationModal, setOpenLeaveApplicationModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [selectedRecordData, setSelectedRecordData] = useState<LeaveTableRow | null>(null);

    const [filter, setFilter] = useState<filterStates>({
        search: '',
        start: 0,
        length: 10,
        year: initialYear,
        month: initialMonth,
    });
    const { handleSearch, handlePageChange, handleChangeMonth, handleChangeYear } = useLeaveFilter({
        setFilter,
    });
    const debouncedSearch = useDebounce(filter.search, 500);

    const { isLoading, data, count, employeeLeaves } = useListLeave(
        filter.start,
        filter.length,
        // filter.search,
        debouncedSearch,
        filter.year,
        filter.month,
        reloadTable
    );

    const { deleteLeaveData, isLoading: deleteLoader } = useDeleteLeaveApi({
        handleCancel: () => setOpenConfirmationModal(false),
    });

    const handleEdit = async (selectedRowData: LeaveTableRow) => {
        setSelectedRecordData(selectedRowData);
        setOpenLeaveApplicationModal(true);
    };

    const handleDelete = (selectedRowData: LeaveTableRow) => {
        setSelectedRecordData(selectedRowData);
        setOpenConfirmationModal(true);
    };

    const handleDeleteLeave = async () => {
        const res = await deleteLeaveData(selectedRecordData?.id!);
        if (res) {
            setSelectedRecordData(null);
            employeeLeaves();
        }
    };

    const employeeLeaveTable: TableColumnsType<any> = [
        {
            title: 'Employee',
            dataIndex: 'employeeName',
        },
        {
            title: 'Leave Type',
            dataIndex: 'leaveType',
            render: typeOfLeave => formatLeaveTypeString(typeOfLeave),
        },
        {
            title: 'Start date',
            dataIndex: 'from',
            render: (date: Date) => formattedDateOnly(new Date(date)),
        },
        {
            title: 'End date',
            dataIndex: 'to',
            render: (date: Date) => formattedDateOnly(new Date(date)),
        },
        {
            title: 'Total Days',
            dataIndex: 'totalDays',
            key: 'totalDays',
        },
        {
            title: 'file',
            dataIndex: 'file',
            key: 'file',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '5%',
            render: (text, record: LeaveTableRow) => (
                <Space size="middle">
                    <a
                        href={record.leaveSupportingDocs}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                    >
                        <Button className="border-0" disabled={record.file === 'NA'}>
                            <DownloadOutlined
                                className={`text-green-400 ${record.file === 'NA' ? 'opacity-50' : ''}`}
                            />
                        </Button>
                    </a>
                    <Button className="border-0" onClick={() => handleDelete(record)}>
                        <DeleteOutlined className="text-[#E30000]" />
                    </Button>
                    <Button className="border-0" onClick={() => handleEdit(record)}>
                        <EditOutlined className="text-[#E30000]" />
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Row>
            <Col span={24}>
                <Flex justify="space-between">
                    <Col md={18} className="mb-6">
                        <Input
                            placeholder="Search by name,leave type"
                            suffix={<SearchOutlined />}
                            allowClear
                            value={filter.search}
                            onChange={handleSearch}
                        />
                    </Col>
                    <Col>
                        <Select
                            options={monthsArray}
                            className="w-32"
                            // onChange={handleChangeMonth}
                            onChange={value => {
                                handleChangeMonth(value);
                                const val = Number(value);
                                handleChangeMonths(val);
                            }}
                            defaultValue={initialMonth.toString()}
                        />
                    </Col>
                    <Col>
                        <Select
                            options={yearsArray}
                            className="w-36"
                            // onChange={handleChangeYear}
                            onChange={value => {
                                handleChangeYear(value);
                                handleChangeYears(value);
                            }}
                            defaultValue={initialYear}
                        />
                    </Col>
                </Flex>
                <Table
                    columns={employeeLeaveTable}
                    dataSource={data}
                    loading={isLoading}
                    pagination={false}
                />
                <Pagination
                    current={filter.start}
                    onChange={handlePageChange}
                    size="default"
                    className="text-end pt-7"
                    total={count}
                />
                {openLeaveApplicationModal && (
                    <LeaveModal
                        open={openLeaveApplicationModal}
                        handleCancel={() => setOpenLeaveApplicationModal(false)}
                        selectedRecordData={selectedRecordData}
                        reloadTable={setReloadTable}
                        month={filter.month}
                        year={filter.year}
                    />
                )}
                <ConfirmationModal
                    isOpen={openConfirmationModal}
                    handleCancel={() => setOpenConfirmationModal(false)}
                    title="Are you sure you want to delete this Leave?"
                    handleSubmit={handleDeleteLeave}
                    isLoading={deleteLoader}
                />
            </Col>
        </Row>
    );
};

export default LeavesTable;
