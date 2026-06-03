import React, { useState } from 'react';

import { Flex, Pagination } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import useDebounce from '@src/hooks/useDebounce';

import { vendorColumns } from './vendorColumns';
import VendorHeader from './VendorHeader';
import VendorModal from './VendorModal';
import useFilter from '../../hooks/useFilters';
import useGetAllKybApi from '../../hooks/vendorPayout/useGetAllKybApi';
import useUpdateStatusApi from '../../hooks/vendorPayout/useUpdateStatusApi';
import { CorporateRecord } from '../../types/vendorPayout';

const VendorPayout = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        pageSize: 10,
        itemsPerPage: 10,
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<CorporateRecord>();

    const debounceSearchText = useDebounce(filters.searchText, 200);
    const { tableData, count, loading, setRefresh } = useGetAllKybApi({
        ...filters,
        searchText: debounceSearchText,
    });

    const { downloadReport } = useUpdateStatusApi();

    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });
    // const { isLoading, statusUpdate,setRefresh } = useUpdateCorporateTax();
    const handleEdit = (record: CorporateRecord) => {
        setModalData(record);
        setOpenModal(true);
    };
    const columns = vendorColumns(handleEdit);

    return (
        <Flex vertical gap={20}>
            <VendorHeader
                downloadReport={downloadReport}
                setRefresh={setRefresh}
                handleSearch={handleSearch}
            />
            <GenericTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={loading}
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
                <VendorModal
                    setRefresh={setRefresh}
                    data={modalData}
                    open={openModal}
                    handleCancel={() => setOpenModal(false)}
                />
            )}
        </Flex>
    );
};

export default VendorPayout;
