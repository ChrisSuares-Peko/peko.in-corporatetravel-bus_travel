import { useState } from 'react';

import { Table, Pagination, Flex, Button, Row, Col } from 'antd';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';

import { useDeleteAssetApi } from '../../hooks/docAndAssetsHooks/useAssetDeleteApi';
import { assetTable } from '../../types/docAndAssetsTypes';
import { Assetcolumns } from '../../utils/employeeDetails/data';
import AssetsModal from '../modals/AssetsModal';

type Props = {
    assetData: any;
    setCurrentPage: (page: number, pageSize: number) => void;
    count?: number;
    isLoading: boolean;
    setRefresh: (value: any) => void;

    setAssetStatus?: (value: any) => void;
    setAssetType?: (value: any) => void;
    employeeData: any;
};

const AssetsTab = ({
    assetData,
    setCurrentPage,
    count,
    isLoading,
    setRefresh,

    setAssetStatus,
    setAssetType,
    employeeData,
}: Props) => {
    const [selectedRowData, setSelectedRowData] = useState<assetTable | null>(null);
    const [openAssetModal, setOpenAssetModal] = useState(false);
    const [showEmployeeName] = useState(true);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [eId, setEId] = useState<string | undefined>(undefined);
    const [eName, setEName] = useState<string | undefined>(undefined);
    const { deleteAssetData, deleteLoader } = useDeleteAssetApi({
        handleCancel: () => setOpenConfirmationModal(false),
    });
    const HandleDelete = (selectedRow: assetTable) => {
        setOpenConfirmationModal(true);
        setSelectedRowData(selectedRow);
    };

    const HandleEdit = (selectedRow: assetTable) => {
        setOpenAssetModal(true);
        setSelectedRowData(selectedRow);
        const employeeId = employeeData._id;
        setEId(employeeId);

        setEName(employeeData.fullName);
    };
    const handleDeleteAsset = async () => {
        await deleteAssetData(selectedRowData?.id);
        setSelectedRowData(null);
        setRefresh((p: any) => !p);
    };

    return (
        <>
            <Flex className="w-full pr-10" justify="end">
                <Button
                    type="default"
                    danger
                    onClick={() => {
                        setSelectedRowData(null);
                        setOpenAssetModal(true);
                    }}
                >
                    Add Asset
                </Button>
            </Flex>
            <Row className="ml-10">
                <Col className="pr-10" span={24}>
                    <Table
                        scroll={{ x: 900 }}
                        className="mt-4"
                        columns={Assetcolumns(HandleDelete, HandleEdit)}
                        dataSource={assetData}
                        loading={isLoading}
                        size="small"
                        pagination={false}
                    />
                </Col>
                <Flex className="w-full pr-5" justify="end" align="end">
                    <Pagination
                        defaultPageSize={10}
                        defaultCurrent={1}
                        total={count}
                        className="mt-4"
                        onChange={setCurrentPage}
                    />
                </Flex>
            </Row>
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
                    employeeIdFromProfile={eId}
                    EmpName={eName}
                    hideEmployeeDropdown={showEmployeeName}
                    employeeData={employeeData}
                />
            )}
        </>
    );
};

export default AssetsTab;
