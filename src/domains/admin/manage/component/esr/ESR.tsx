import React, { useState } from 'react';

import { Flex, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';

import GenericTable from '@components/atomic/GenericTable';

import { esrColumns } from './esrColumns';
import ESRHeader from './ESRHeader';
import UpdateModal from './Modal';
import useFilter from '../../hooks/useFilters';
import useGetESR from '../../hooks/useGetESR';
import { ESRModalData, EsrRecord } from '../../types/ESR';

const ESR = () => {
    const navigate = useNavigate();
    const initialValues = {
        page: 1,
        pageSize: 10,
        itemsPerPage: 10,
        sort: 'DESC',
        searchText: '',
    };
    const [filters, setFilters] = useState(initialValues);
    const [modalData, setModalData] = useState<ESRModalData | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [from, setFrom] = useState('2023-01-01');
    const [to, setTo] = useState('2023-12-31');

    const { isLoading, tableData, count, setRefresh, updateESR } = useGetESR(filters);
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });

    const handleEdit = (record: EsrRecord) => {
        setModalData({
            certificate: record.certificate,
            remarks: record.remarks,
            stageId: record.registrationId,
            status: record.status,
            stageNo: record.stageNo,
        });
        setOpenModal(true);
    };

    const columns = esrColumns(handleEdit, navigate);
    const downloadReport = (type: string) => {
        // console.log(`Download report as ${type}`);
    };
    const handleFromChange = (dates: any, dateStrings: any) => {
        setFrom(dateStrings);
    };

    const handleToChange = (dates: any, dateStrings: any) => {
        setTo(dateStrings);
    };

    const handleDateChange = (dates: any, dateStrings: any) => {
        setFrom(dateStrings[0]);
        setTo(dateStrings[1]);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
        setModalData(null);
    };

    return (
        <Flex vertical gap={20}>
            <ESRHeader
                searchText=""
                downloadReport={downloadReport}
                setRefresh={setRefresh}
                handleSearch={handleSearch}
                handleFromChange={handleFromChange}
                handleToChange={handleToChange}
                handleDateChange={handleDateChange}
                from={from}
                to={to}
            />
            <GenericTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={isLoading}
                onChange={handleTableChange}
            />
            <Pagination
                current={filters.page}
                size="default"
                className="text-end pt-7"
                onChange={handlePageChange}
                total={count}
                showSizeChanger={false}
            />
            {openModal && (
                <UpdateModal
                    data={modalData!}
                    isLoading={isLoading}
                    open={openModal}
                    handleCancel={handleCloseModal}
                    updateESR={updateESR}
                />
            )}
        </Flex>
    );
};

export default ESR;
