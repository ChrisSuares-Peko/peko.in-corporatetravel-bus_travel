import { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Table, Pagination, Flex, Col, Input, Row, Select } from 'antd';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';

import { useDeleteAssetApi } from '../../hooks/docAndAssetsHooks/useAssetDeleteApi';
import { useGetAssetListingType } from '../../hooks/docAndAssetsHooks/useGetAssetTypesApi';
import { assetTable } from '../../types/docAndAssetsTypes';
import { Assetcolumns } from '../../utils/docAndAssets/data';
import AssetsModal from '../modals/AssetsModal';

type Props = {
    assetData: any;
    setCurrentPage: (page: number, pageSize: number) => void;
    count?: number;
    isLoading: boolean;
    setRefresh: (value: any) => void;
    handleSearch: (value: any) => void;
    setAssetStatus: (value: any) => void;
    setAssetType: (value: any) => void;
};

const AssetsTab = ({
    assetData,
    setCurrentPage,
    count,
    isLoading,
    setRefresh,
    handleSearch,
    setAssetStatus,
    setAssetType,
}: Props) => {
    const [selectedRowData, setSelectedRowData] = useState<assetTable | null>(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [openAssetModal, setOpenAssetModal] = useState(false);
    const [showEmployeeName, setShowEmployeeName] = useState(false);
    const { assetTypes } = useGetAssetListingType();
    const { deleteAssetData, deleteLoader } = useDeleteAssetApi({
        handleCancel: () => setOpenConfirmationModal(false),
    });
    const HandleDelete = (selectedRow: assetTable) => {
        setOpenConfirmationModal(true);
        setSelectedRowData(selectedRow);
    };
    const handleDeleteAsset = async () => {
        await deleteAssetData(selectedRowData?.id);
        setSelectedRowData(null);
        setRefresh((p: any) => !p);
    };

    const HandleEdit = (selectedRow: assetTable) => {
        setSelectedRowData(selectedRow);
        setOpenAssetModal(true);
    };

    const statusType = [
        { label: 'Active', value: 'Active' },
        { label: 'Available', value: 'Available' },
        { label: 'In use', value: 'In_use' },
    ];
    return (
        <>
            <Row align="middle">
                <Col md={24}>
                    <Flex justify="space-between">
                        <Col span={17}>
                            <Input
                                placeholder="Search "
                                suffix={<SearchOutlined />}
                                allowClear
                                type="text"
                                maxLength={100}
                                onChange={handleSearch}
                                className="text-[.8rem] sm:text-[.9rem]"
                            />
                        </Col>
                        <Col span={3}>
                            <Select
                                defaultValue="All"
                                className="w-full sm:w-40"
                                options={[
                                    {
                                        value: '',
                                        label: 'All',
                                    },
                                    ...assetTypes,
                                ]}
                                onChange={setAssetType}
                            />
                        </Col>
                        <Col span={3}>
                            <Select
                                onChange={setAssetStatus}
                                defaultValue="All"
                                className="w-full sm:w-40"
                                options={[
                                    {
                                        value: '',
                                        label: 'All',
                                    },
                                    ...statusType,
                                ]}
                            />
                        </Col>
                    </Flex>
                </Col>
            </Row>
            <Table
                scroll={{ x: 992 }}
                className="mt-4"
                columns={Assetcolumns(HandleDelete, HandleEdit)}
                dataSource={assetData}
                loading={isLoading}
                size="small"
                pagination={false}
            />
            <Flex className="w-full" justify="end" align="end">
                <Pagination
                    defaultPageSize={10}
                    defaultCurrent={1}
                    total={count}
                    className="mt-4"
                    onChange={setCurrentPage}
                />
            </Flex>

            <ConfirmationModal
                isOpen={openConfirmationModal}
                handleCancel={() => setOpenConfirmationModal(false)}
                title="Are you sure you want to delete this asset?"
                handleSubmit={handleDeleteAsset}
                isLoading={deleteLoader}
            />

            {openAssetModal && (
                <AssetsModal
                    open={openAssetModal}
                    handleCancel={() => setOpenAssetModal(false)}
                    setRefresh={setRefresh}
                    selectedRowData={selectedRowData}
                    hideEmployeeDropdown={showEmployeeName}
                />
            )}
        </>
    );
};

export default AssetsTab;
