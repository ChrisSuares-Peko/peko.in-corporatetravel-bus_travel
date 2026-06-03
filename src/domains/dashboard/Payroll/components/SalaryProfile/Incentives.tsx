import { useState } from 'react';

import {
    Button,
    Col,
    ConfigProvider,
    Flex,
    Pagination,
    Row,
    Select,
    Table,
    Typography,
} from 'antd';
import { useLocation } from 'react-router-dom';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';

import { useGetEmployeeIncentiveApi } from '../../hooks/employeeSalaryHooks/incentivesHooks/useGetEmployeeIncentiveListingApi';
import { useDeleteIncentiveApi } from '../../hooks/employeeSalaryHooks/incentivesHooks/useIncentiveDeleteApi';
import { filterState } from '../../types/salaryProfileTypes/employeeSalaryTable';
import { incentiveTable } from '../../types/salaryProfileTypes/incentiveTypes';
import useFilter from '../../utils/general/useFilter';
import { incentiveColumn } from '../../utils/salarySectionOthers/data';
import { monthsArray, yearsArray } from '../../utils/salaryTable/data';
import IncentivesModal from '../modals/IncentivesModal';

const Incentives = () => {
    const [selectedRowData, setSelectedRowData] = useState<incentiveTable | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
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
    const { tableDatas, orderCount, tableLoading } = useGetEmployeeIncentiveApi(
        eId,
        filter.page,
        filter.limit,
        filter.year,
        filter.month,
        reloadTable
    );

    const { deleteIncentiveData, isLoading } = useDeleteIncentiveApi({
        handleCancel: () => setOpenConfirmationModal(false),
    });

    const HandleDelete = (selectedRow: incentiveTable) => {
        setSelectedRowData(selectedRow);
        setOpenConfirmationModal(true);
    };

    const handleDeleteIncentive = async () => {
        await deleteIncentiveData(selectedRowData?.id!);
        setSelectedRowData(null);
        setReloadTable(p => !p);
    };

    const handleEdit = async (selectedRow: incentiveTable) => {
        setSelectedRowData(selectedRow);
        setOpenModal(true);
    };
    const themeConfig = {
        components: {
            Table: {
                rowHoverBg: 'inherit',
                headerBg: '#F5F5F5',
            },
        },
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
                            Incentives
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
                                    Add Incentives
                                </Button>
                            </Col>
                        </Row>
                    </Flex>
                    <ConfigProvider theme={themeConfig}>
                        <Table
                            className="mt-6"
                            dataSource={tableDatas}
                            columns={incentiveColumn(HandleDelete, handleEdit)}
                            size="small"
                            scroll={{ x: 568 }}
                            pagination={false}
                            loading={tableLoading}
                        />
                    </ConfigProvider>
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
                <IncentivesModal
                    open={openModal}
                    handleCancel={() => setOpenModal(false)}
                    reloadTable={setReloadTable}
                    selectedRowData={selectedRowData}
                    employeeIdFromProfile={eId}
                    year={filter.year}
                    month={Number(filter.month)}
                />
            )}
            <ConfirmationModal
                isOpen={openConfirmationModal}
                handleCancel={() => setOpenConfirmationModal(false)}
                title="Are you sure you want to delete this incentive?"
                handleSubmit={handleDeleteIncentive}
                isLoading={isLoading}
            />
        </Row>
    );
};
export default Incentives;
