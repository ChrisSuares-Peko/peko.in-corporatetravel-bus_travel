import { useState } from 'react';

import { Button, Col, Flex, Pagination, Row, Select, Table, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';

import { useGetEmployeeOvertimeApi } from '../../hooks/employeeSalaryHooks/overtimeHooks/useGetEmployeeOvertimeListingApi';
import { useDeleteOvertimeApi } from '../../hooks/employeeSalaryHooks/overtimeHooks/useOvertimeDeleteApi';
import { filterState } from '../../types/salaryProfileTypes/employeeSalaryTable';
import { overtimeTable } from '../../types/salaryProfileTypes/overtimeTypes';
import useFilter from '../../utils/general/useFilter';
import { overtimeColumn } from '../../utils/salarySectionOthers/data';
import { monthsArray, yearsArray } from '../../utils/salaryTable/data';
import OverTimeModal from '../modals/OverTimeModal';

const Overtime = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<overtimeTable | null>(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
    const { deleteOvertimeData, isLoading } = useDeleteOvertimeApi({
        handleCancel: () => setOpenConfirmationModal(false),
    });
    const location = useLocation();
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
    const { tableDatas, orderCount, tableLoading } = useGetEmployeeOvertimeApi(
        eId,
        filter.page,
        filter.limit,
        filter.year,
        filter.month,
        reloadTable
    );
    const HandleDelete = (selectedRow: overtimeTable) => {
        setOpenConfirmationModal(true);
        setSelectedRowData(selectedRow);
    };
    const handleDeleteOvertime = async () => {
        await deleteOvertimeData(selectedRowData?.id!);
        setSelectedRowData(null);
        setReloadTable(p => !p);
    };
    const handleEdit = async (selectedRow: overtimeTable) => {
        setSelectedRowData(selectedRow);
        setOpenModal(true);
    };
    return (
        <Row>
            <Col span={24}>
                <Flex vertical>
                    <Flex justify="space-between" wrap="wrap">
                        <Typography.Text
                            className="font-normal text-fontSubHeader"
                            style={{ fontSize: '1.246rem' }}
                        >
                            Overtime
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
                            <Col className="p-0 m-0">
                                <Button
                                    danger
                                    className="md:w-32"
                                    onClick={() => {
                                        setSelectedRowData(null);
                                        setOpenModal(true);
                                    }}
                                >
                                    Add Overtime
                                </Button>
                            </Col>
                        </Row>
                    </Flex>
                    <Table
                        className="mt-4"
                        scroll={{ x: 568 }}
                        dataSource={tableDatas}
                        columns={overtimeColumn(HandleDelete, handleEdit)}
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
            {openModal && (
                <OverTimeModal
                    open={openModal}
                    handleCancel={() => setOpenModal(false)}
                    selectedRowData={selectedRowData}
                    reloadTable={setReloadTable}
                    employeeIdFromProfile={eId}
                    year={filter.year}
                    month={Number(filter.month)}
                />
            )}
            <ConfirmationModal
                isOpen={openConfirmationModal}
                handleCancel={() => setOpenConfirmationModal(false)}
                title="Are you sure you want to delete this overtime?"
                handleSubmit={handleDeleteOvertime}
                isLoading={isLoading}
            />
        </Row>
    );
};
export default Overtime;
