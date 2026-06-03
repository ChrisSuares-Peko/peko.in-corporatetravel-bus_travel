import { useState } from 'react';

import { Button, Col, Flex, Pagination, Row, Select, Table, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';

import { useDeleteBonusApi } from '../../hooks/employeeSalaryHooks/bonusHooks/useBonusDeleteApi';
import { useGetEmployeeBonusApi } from '../../hooks/employeeSalaryHooks/bonusHooks/useGetEmployeeBonusListingApi';
import { bonusTable } from '../../types/salaryProfileTypes/bonustypes';
import { filterState } from '../../types/salaryProfileTypes/employeeSalaryTable';
import useFilter from '../../utils/general/useFilter';
import { bonusColumn } from '../../utils/salarySectionOthers/data';
import { monthsArray, yearsArray } from '../../utils/salaryTable/data';
import BonusModal from '../modals/BonusModal';

const Bonus = () => {
    const location = useLocation();
    const [openBonusModal, setOpenBonusModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [selectedRecordData, setSelectedRecordData] = useState<bonusTable | null>(null);
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
    const { tableDatas, orderCount, tableLoading } = useGetEmployeeBonusApi(
        eId,
        filter.page,
        filter.limit,
        filter.year,
        filter.month,
        reloadTable
    );

    const { deleteBonusData, isLoading: deleteLoader } = useDeleteBonusApi({
        handleCancel: () => setOpenConfirmationModal(false),
    });
    const handleEdit = async (selectedRowData: bonusTable) => {
        setSelectedRecordData(selectedRowData);
        setOpenBonusModal(true);
    };
    const openDeleteModal = (selectedRowData: bonusTable) => {
        setSelectedRecordData(selectedRowData);
        setOpenConfirmationModal(true);
    };
    const handleDeleteBonus = async () => {
        await deleteBonusData(selectedRecordData?.id!);
        setSelectedRecordData(null);
        setReloadTable(p => !p);
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
                            Bonus
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
                                        setSelectedRecordData(null);
                                        setOpenBonusModal(true);
                                    }}
                                >
                                    Add Bonus
                                </Button>
                            </Col>
                        </Row>
                    </Flex>
                    <Table
                        className="mt-4"
                        scroll={{ x: 568 }}
                        dataSource={tableDatas}
                        columns={bonusColumn(openDeleteModal, handleEdit)}
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
            {openBonusModal && (
                <BonusModal
                    open={openBonusModal}
                    handleCancel={() => setOpenBonusModal(false)}
                    employeeIdFromProfile={eId}
                    selectedRecordData={selectedRecordData}
                    reloadTable={setReloadTable}
                    year={filter.year}
                    month={Number(filter.month)}
                />
            )}

            <ConfirmationModal
                isOpen={openConfirmationModal}
                handleCancel={() => setOpenConfirmationModal(false)}
                title="Are you sure you want to delete this bonus?"
                handleSubmit={handleDeleteBonus}
                isLoading={deleteLoader}
            />
        </Row>
    );
};
export default Bonus;
