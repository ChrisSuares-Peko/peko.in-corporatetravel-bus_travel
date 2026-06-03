import { useState } from 'react';

import { Table, Pagination, Flex, Row, Button, Col } from 'antd';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';

import { useDeleteDocumentApi } from '../../hooks/docAndAssetsHooks/useDocDeleteApi';
import { EmployeeDocument } from '../../types/type';
import { Documentcolumns } from '../../utils/employeeDetails/data';
import EmployeeDocumentModal from '../modals/EmployeeDocumentModal';

type Props = {
    setRefresh: (value: any) => void;
    isLoading: boolean;
    employeeDocs?: EmployeeDocument[];
    employeeData: any;
    count: number;
    setCurrentPage: (val: any) => void;
};

const DocumentsTab = ({
    setRefresh,
    isLoading,
    employeeDocs,
    employeeData,
    count,
    setCurrentPage,
}: Props) => {
    const [selectedRowData, setSelectedRowData] = useState<EmployeeDocument | null>(null);

    const [openDocumentModal, setOpenDocumentModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

    const [eId, setEId] = useState<string | undefined>(undefined);
    const [eName, setEName] = useState<string | undefined>(undefined);
    const { deleteDocumentData, deleteLoader } = useDeleteDocumentApi({
        handleCancel: () => setOpenConfirmationModal(false),
    });

    const HandleDelete = (selectedRow: any) => {
        setOpenConfirmationModal(true);

        setSelectedRowData(selectedRow);
    };

    const HandleEdit = (selectedRow: any) => {
        const employeeId = employeeData._id;
        const name = employeeData.fullName;
        setEId(employeeId);
        setEName(name);
        setOpenDocumentModal(true);
        setSelectedRowData(selectedRow);
    };

    const handleDeleteDoc = async () => {
        const documentId = selectedRowData?._id;
        const employeeId = employeeData._id;
        await deleteDocumentData(documentId, employeeId);
        setSelectedRowData(null);
        setRefresh((p: any) => !p);
    };

    return (
        <>
            <Flex className="w-full pr-10" justify="end">
                <Button
                    type="default"
                    danger
                    // onClick={() => setOpenDocumentmentModal(true)}
                    onClick={() => {
                        setSelectedRowData(null);
                        setOpenDocumentModal(true);
                    }}
                >
                    Add Document
                </Button>
            </Flex>

            <Row className="ml-10">
                <Col className="pr-10" span={24}>
                    <Table
                        scroll={{ x: 900 }}
                        className="mt-4"
                        columns={Documentcolumns(HandleDelete, HandleEdit, false)}
                        dataSource={employeeDocs}
                        loading={isLoading}
                        size="small"
                        pagination={false}
                    />
                </Col>
                <Flex className="w-full pr-5" justify="end" align="end">
                    <Pagination
                        defaultPageSize={10}
                        total={count}
                        className="mt-4"
                        onChange={setCurrentPage}
                    />
                </Flex>
            </Row>
            <ConfirmationModal
                isOpen={openConfirmationModal}
                handleCancel={() => setOpenConfirmationModal(false)}
                title="Are you sure you want to delete this document?"
                handleSubmit={handleDeleteDoc}
                isLoading={deleteLoader}
            />

            {openDocumentModal && (
                <EmployeeDocumentModal
                    open={openDocumentModal}
                    handleCancel={() => setOpenDocumentModal(false)}
                    setRefresh={setRefresh}
                    selectedRowData={selectedRowData}
                    employeeIdFromProfile={eId}
                    EmpName={eName}
                    employeeData={employeeData}
                />
            )}
        </>
    );
};

export default DocumentsTab;
