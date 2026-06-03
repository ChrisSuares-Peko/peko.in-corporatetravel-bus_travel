import React, { useState } from 'react';

import { Button, Col, Flex, Tabs, TabsProps, Typography } from 'antd';

import AssetsTab from '../components/DocandAssets/AssetsTab';
import DocumentsTab from '../components/DocandAssets/DocumentsTab';
import AssetsModal from '../components/modals/AssetsModal';
import DocumentsModal from '../components/modals/DocumentsModal';
import { useGetEmployeeAssetsApi } from '../hooks/docAndAssetsHooks/useAssetListApi';
import { useGetEmployeeDocumentsApi } from '../hooks/docAndAssetsHooks/useDocListApi';
import { assetTable, documentTable } from '../types/docAndAssetsTypes';
import { filterState } from '../types/salaryProfileTypes/employeeSalaryTable';
import useFilter from '../utils/general/useFilter';

type Props = {};
const DocumentsAndAssets = (props: Props) => {
    const [openDocumentModal, setOpenDocumentmentModal] = useState(false);
    const [openAssetModal, setOpenAssetModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<documentTable | null>(null);
    const [selectedAssetRowData, setSelectedAssetRowData] = useState<assetTable | null>(null);

    const [assetType, setAssetType] = useState<string>('');
    const [assetStatus, setAssetStatus] = useState<string>('');
    const [employee, setEmployee] = useState<string>('');
    const [reloadTable, setReloadTable] = useState(false);
    const initialValues = {
        searchText: '',
        sort: 'ASC',
        page: 1,
        limit: 10,
        filter: '',
        year: 0,
        month: '',
    };
    const [filter, setFilter] = useState<filterState>(initialValues);

    const { handlePagination, handleSearch, handlePageChange } = useFilter({
        setFilter,
    });
    const { tableDatas, tableLoading, total } = useGetEmployeeDocumentsApi(
        filter.page,
        filter.limit,
        filter.year,
        filter.month,
        filter.searchText,
        employee,
        reloadTable
    );
    const { assetData, assetLoading, assetCount } = useGetEmployeeAssetsApi(
        filter.page,
        filter.limit,
        filter.year,
        filter.month,
        filter.searchText,
        assetStatus,
        assetType,
        reloadTable
    );

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Documents',
            children: (
                <DocumentsTab
                    documentsData={tableDatas}
                    page={filter.page}
                    setCurrentPage={handlePagination}
                    count={total}
                    isLoading={tableLoading}
                    setRefresh={setReloadTable}
                    Search={handleSearch}
                    setEmployee={setEmployee}
                    handleCancel={() => setOpenDocumentmentModal(false)}
                />
            ),
        },
        {
            key: '2',
            label: 'Assets',
            children: (
                <AssetsTab
                    assetData={assetData}
                    setCurrentPage={handlePageChange}
                    count={assetCount}
                    isLoading={assetLoading}
                    setRefresh={setReloadTable}
                    handleSearch={handleSearch}
                    setAssetStatus={setAssetStatus}
                    setAssetType={setAssetType}
                />
            ),
        },
    ];

    return (
        <Flex vertical className="">
            <Flex className="w-full" justify="space-between">
                <Typography.Paragraph className=" text-neutral-700 text-xl font-medium">
                    Documents And Assets{' '}
                </Typography.Paragraph>
                <Flex gap={8}>
                    <Button
                        type="default"
                        danger
                        onClick={() => {
                            setSelectedRowData(null);
                            setOpenDocumentmentModal(true);
                        }}
                    >
                        Add Document
                    </Button>
                    <Button
                        type="default"
                        danger
                        onClick={() => {
                            setSelectedAssetRowData(null);

                            setOpenAssetModal(true);
                        }}
                    >
                        Add Asset
                    </Button>
                </Flex>
            </Flex>
            {openDocumentModal && (
                <DocumentsModal
                    open={openDocumentModal}
                    handleCancel={() => setOpenDocumentmentModal(false)}
                    setRefresh={setReloadTable}
                    selectedRowData={selectedRowData}
                />
            )}
            {openAssetModal && (
                <AssetsModal
                    open={openAssetModal}
                    handleCancel={() => setOpenAssetModal(false)}
                    setRefresh={setReloadTable}
                    selectedRowData={selectedAssetRowData}
                />
            )}
            <Col xs={24} className="md:mt-10 mt-5">
                <Tabs defaultActiveKey="1" items={items} />
            </Col>
        </Flex>
    );
};

export default DocumentsAndAssets;
