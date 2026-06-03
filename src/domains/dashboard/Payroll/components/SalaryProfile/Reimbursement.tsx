import { useState } from 'react';

import { Button, Col, Flex, Pagination, Row, Select, Table, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';

import { useGetEmployeeReimbursementApi } from '../../hooks/employeeSalaryHooks/ReimbursementHooks/useGetEmployeeReimbursementDetailsApi';
import { useDeleteReimbursementApi } from '../../hooks/employeeSalaryHooks/ReimbursementHooks/useReimbursementDeleteApi';
import { filterState } from '../../types/salaryProfileTypes/employeeSalaryTable';
import { reimbursementTableType } from '../../types/salaryProfileTypes/ReimbursementTypes/index';
import useFilter from '../../utils/general/useFilter';
import { reimbursementColumn } from '../../utils/salarySectionOthers/data';
import { monthsArray, yearsArray } from '../../utils/salaryTable/data';
import ReimbursementModal from '../modals/ReimbursementModal';

const Reimbursement = () => {
    const location = useLocation();
    const [openReimbursementModal, setOpenReimbursementModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [selectedRecordData, setSelectedRecordData] = useState<reimbursementTableType | null>(
        null
    );
    const [reloadTable, setReloadTable] = useState(false);
    const { eId, month, year } = location.state;
    const initialYear = year;
    const initialMonth = month;
    const initialValues = {
        searchText: '',
        sort: 'ASC',
        page: 1,
        limit: 5,
        filter: '',
        year: initialYear,
        month: initialMonth,
    };
    const [filter, setFilter] = useState<filterState>(initialValues);
    const { handlePageChange, handleChangeMonth, handleChangeYear } = useFilter({
        setFilter,
    });

    const { tableDatas, orderCount, tableLoading } = useGetEmployeeReimbursementApi(
        eId,
        filter.page,
        filter.limit,
        filter.year,
        filter.month,

        reloadTable
    );

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
                <Flex vertical className="mt-6">
                    <Flex justify="space-between" wrap="wrap">
                        <Typography.Text
                            className="font-normal text-fontSubHeader"
                            style={{ fontSize: '1.246rem' }}
                        >
                            Reimbursement
                        </Typography.Text>

                        <Row gutter={16} className="justify-between xs:mt-10 md:mt-0">
                            <Col className="md:w-40">
                                <Select
                                    options={monthsArray}
                                    className="w-full"
                                    onChange={handleChangeMonth}
                                    defaultValue={initialMonth.toString()}
                                />
                            </Col>
                            <Col className="md:w-40">
                                <Select
                                    options={yearsArray}
                                    className="w-full"
                                    onChange={handleChangeYear}
                                    defaultValue={initialYear}
                                />
                            </Col>

                            <Button
                                onClick={() => {
                                    setSelectedRecordData(null);
                                    setOpenReimbursementModal(true);
                                }}
                                danger
                                className="ms-2"
                            >
                                Add Reimbursement
                            </Button>
                        </Row>
                    </Flex>
                    <Table
                        className="mt-7"
                        scroll={{ x: 568 }}
                        dataSource={tableDatas}
                        columns={reimbursementColumn(openDeleteModal, handleEdit)}
                        size="small"
                        pagination={false}
                        loading={tableLoading}
                    />
                    {orderCount! > 0 && (
                        <Pagination
                            current={filter.page}
                            size="default"
                            className="text-end pt-7"
                            total={orderCount}
                            onChange={handlePageChange}
                            pageSize={filter.limit}
                        />
                    )}
                </Flex>
            </Col>
            {openReimbursementModal && (
                <ReimbursementModal
                    open={openReimbursementModal}
                    handleCancel={() => setOpenReimbursementModal(false)}
                    selectedRecordData={selectedRecordData}
                    reloadTable={setReloadTable}
                    employeeIdFromProfile={eId}
                    month={Number(filter.month)}
                    year={filter.year}
                />
            )}
            <ConfirmationModal
                isOpen={openConfirmationModal}
                handleCancel={() => setOpenConfirmationModal(false)}
                title="Are you sure you want to delete this reimbursement?"
                handleSubmit={handleDeleteReimbursement}
                isLoading={deleteLoader}
            />
        </Row>
    );
};
export default Reimbursement;
