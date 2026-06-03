import { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Table, Pagination, Flex, Col, Input, Row, Select } from 'antd';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';

import { useDeleteDocumentApi } from '../../hooks/docAndAssetsHooks/useDocDeleteApi';
import { useGetEmployee } from '../../hooks/docAndAssetsHooks/useGetEmployeeListApi';
import { documentTable } from '../../types/docAndAssetsTypes';
import { Documentcolumns } from '../../utils/docAndAssets/data';
import DocumentsModal from '../modals/DocumentsModal';

type Props = {
    documentsData: any;
    setCurrentPage: (page: number, pageSize: number) => void;
    count?: number;
    isLoading: boolean;
    setRefresh: (value: any) => void;
    Search: (value: any) => void;
    setEmployee: (value: any) => void;
    handleCancel: () => void;
    page?: number;
    // setRefState?:(num: number) => void;
};

const DocumentsTab = ({
    documentsData,
    setCurrentPage,
    count,
    isLoading,
    setRefresh,
    Search,
    setEmployee,
    handleCancel,
    page,
    // setRefState
}: Props) => {
    const [selectedRowData, setSelectedRowData] = useState<documentTable | null>(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const { deleteDocumentData, deleteLoader } = useDeleteDocumentApi({
        handleCancel: () => setOpenConfirmationModal(false),
    });
    const [openDocumentModal, setOpenDocumentModal] = useState(false);

    const HandleDelete = (selectedRow: documentTable) => {
        setOpenConfirmationModal(true);

        setSelectedRowData(selectedRow);
    };
    const HandleEdit = (selectedRow: documentTable) => {
        setSelectedRowData(selectedRow);
        setOpenDocumentModal(true);
    };
    const handleDeleteDoc = async () => {
        await deleteDocumentData(selectedRowData?.docuementId, selectedRowData?.employeeId);
        setSelectedRowData(null);
        setRefresh((p: any) => !p);
    };

    const { data, generateEmployeesDropdown } = useGetEmployee();
    return (
        <>
            <Row className=" " gutter={[16, 16]} align="middle">
                <Col md={20}>
                    <Input
                        placeholder="Search "
                        suffix={<SearchOutlined />}
                        allowClear
                        type="text"
                        maxLength={100}
                        onChange={Search}
                        className="text-[.8rem] sm:text-[.9rem]"
                    />
                </Col>
                <Col xs={8} sm={8} md={4}>
                    <Select
                        defaultValue="All"
                        className="w-full sm:w-48"
                        options={[
                            {
                                value: '',
                                label: 'All',
                            },
                            ...generateEmployeesDropdown(data),
                        ]}
                        onChange={setEmployee}
                    />
                </Col>
            </Row>
            <Table
                scroll={{ x: 992 }}
                className="mt-4"
                columns={Documentcolumns(HandleDelete, HandleEdit, true)}
                dataSource={documentsData}
                loading={isLoading}
                size="small"
                pagination={false}
            />
            <Flex className="w-full" justify="end" align="end">
                <Pagination
                    current={page}
                    total={count}
                    className="mt-4"
                    onChange={setCurrentPage}
                />
            </Flex>

            <ConfirmationModal
                isOpen={openConfirmationModal}
                handleCancel={() => setOpenConfirmationModal(false)}
                title="Are you sure you want to delete this document?"
                handleSubmit={handleDeleteDoc}
                isLoading={deleteLoader}
            />
            {openDocumentModal && (
                <DocumentsModal
                    open={openDocumentModal}
                    handleCancel={() => setOpenDocumentModal(false)}
                    setRefresh={setRefresh}
                    selectedRowData={selectedRowData}
                />
            )}
        </>
    );
};

export default DocumentsTab;
