import React, { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Flex, Input, Pagination, Row, Select, Skeleton } from 'antd';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import useDebounce from '@src/hooks/useDebounce';

import ReimbursementCard from './ReimbursementCard';
import { useGetAllReimbursementApi } from '../../hooks/employeeSalaryHooks/ReimbursementHooks/useAllReimbursementListApi';
import { useDeleteReimbursementApi } from '../../hooks/employeeSalaryHooks/ReimbursementHooks/useReimbursementDeleteApi';
import { filterState } from '../../types/salaryProfileTypes/employeeSalaryTable';
import { reimbursementTableType } from '../../types/salaryProfileTypes/ReimbursementTypes';
import useFilter from '../../utils/general/useFilter';
import { monthsArray, yearsArray } from '../../utils/salaryTable/data';
import ReimbursementModal from '../modals/ReimbursementModal';

interface ReimbursementTableProps {
    reloadTable: boolean;
    setReloadTable: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReimbursementTable = ({ reloadTable, setReloadTable }: ReimbursementTableProps) => {
    const [openReimbursementModal, setOpenReimbursementModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [selectedRecordData, setSelectedRecordData] = useState<reimbursementTableType | null>(
        null
    );
    const initialMonth = new Date().getMonth() + 1;
    const initialYear = new Date().getFullYear();

    const initialValues = {
        searchText: '',
        sort: 'ASC',
        page: 1,
        limit: 10,
        filter: '',
        year: 0,
        month: 0,
    };
    const [filter, setFilter] = useState<filterState>(initialValues);
    const { handleSearch, handlePageChange, handleChangeMonth, handleChangeYear } = useFilter({
        setFilter,
    });
    const debouncedSearch = useDebounce(filter.searchText, 500);

    const { tableDatas, orderCount, tableLoading } = useGetAllReimbursementApi(
        filter.page,
        filter.limit,
        debouncedSearch,
        filter.year,
        filter.month,
        reloadTable
    );
    const renderSkeleton = () => <Skeleton active paragraph={{ rows: 4 }} />;

    let tableContent;

    if (tableLoading) {
        tableContent = Array.from({ length: 10 }).map((_, index) => (
            <Card size="small" className="h-40 p-2 mt-4 border-none bg-slate-50" key={index}>
                <Flex className="w-full" gap={5} vertical>
                    {renderSkeleton()}
                </Flex>
            </Card>
        ));
    } else if (tableDatas.length === 0) {
        tableContent = <Empty description="No data available" />;
    } else {
        tableContent = tableDatas.map((item, index) => (
            <ReimbursementCard
                key={item.id}
                {...item}
                handleEdit={() => handleEdit(item)}
                handleDelete={() => openDeleteModal(item)}
            />
        ));
    }

    const { deleteReimbursementData, isLoading: deleteLoader } = useDeleteReimbursementApi({
        handleCancel: () => setOpenConfirmationModal(false),
    });

    const handleEdit = async (selectedRowData: reimbursementTableType) => {
        setSelectedRecordData(selectedRowData);
        setOpenReimbursementModal(true);
    };

    const openDeleteModal = (selectedRowData: reimbursementTableType) => {
        setSelectedRecordData(selectedRowData);
        setOpenConfirmationModal(true);
    };
    const handleDeleteReimbursement = async () => {
        await deleteReimbursementData(selectedRecordData?.id!);
        setSelectedRecordData(null);
        setReloadTable(p => !p);
    };

    return (
        <Row>
            <Col span={24}>
                <Col md={24} className="mb-6">
                    {/* <Flex justify="space-between"> */}
                    <Row gutter={[16, 16]}>
                        <Col md={18} xs={24} className="mb-1">
                            <Input
                                placeholder="Search employee by name, expense date, expense details, amount or status"
                                suffix={<SearchOutlined />}
                                allowClear
                                onChange={handleSearch}
                            />
                        </Col>
                        <Col>
                            <Select
                                options={monthsArray}
                                className="w-32"
                                onChange={handleChangeMonth}
                                defaultValue={initialMonth.toString()}
                            />
                        </Col>
                        <Col md={3}>
                            <Select
                                options={yearsArray}
                                className="w-36"
                                onChange={handleChangeYear}
                                defaultValue={initialYear}
                            />
                        </Col>
                    </Row>
                    {/* </Flex> */}
                </Col>
                <Col span={24}>{tableContent}</Col>

                <Pagination
                    current={filter.page}
                    onChange={handlePageChange}
                    size="default"
                    className="text-end pt-7"
                    total={orderCount}
                    pageSize={filter.limit}
                />
                {openReimbursementModal && (
                    <ReimbursementModal
                        open={openReimbursementModal}
                        handleCancel={() => setOpenReimbursementModal(false)}
                        selectedRecordData={selectedRecordData}
                        reloadTable={setReloadTable}
                    />
                )}
                <ConfirmationModal
                    isOpen={openConfirmationModal}
                    handleCancel={() => setOpenConfirmationModal(false)}
                    title="Are you sure you want to delete this reimbursement?"
                    handleSubmit={handleDeleteReimbursement}
                    isLoading={deleteLoader}
                />
            </Col>
        </Row>
    );
};

export default ReimbursementTable;
