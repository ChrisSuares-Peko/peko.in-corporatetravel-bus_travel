import React, { useState } from 'react';

import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Input, Pagination, Row, Space, Spin, TableColumnsType } from 'antd';
import { useNavigate } from 'react-router-dom';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import { paths } from '@src/routes/paths';

import { useDeleteBeneficiaryApi } from '../../../hooks/useBeneficiaryDeleteApi';
import useFilter from '../../../hooks/useFilter';
import { useListBeneficiaryApi } from '../../../hooks/useListBeneficiaryApi';
import { BeneficiaryTableRow, filterStates } from '../../../types/types';

const Table: React.FC = () => {
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [selectedRecordData, setSelectedRecordData] = useState<BeneficiaryTableRow | null>(null);
    const [confirmEdit, setConfirmEdit] = useState(false); // Track edit confirmation

    const initialValues = {
        search: '',
        start: 1,
        length: 10,
    };
    const [filter, setFilter] = useState<filterStates>(initialValues);
    const { handleSearch, handlePageChange } = useFilter({ setFilter });
    const { data, count, fetchBeneficiariesData, isLoading } = useListBeneficiaryApi(
        filter.start,
        filter.length,
        filter.search
    );

    const navigate = useNavigate();

    const { deleteBeneficiaryData, isLoading: deleteLoader } = useDeleteBeneficiaryApi({
        handleCancel: () => setOpenConfirmationModal(false),
    });

    const handleDelete = async (selectedRowData: BeneficiaryTableRow) => {
        setSelectedRecordData(selectedRowData);
        setConfirmEdit(false); // Set to false to handle delete logic
        setOpenConfirmationModal(true);
    };

    const handleEdit = (selectedRowData: BeneficiaryTableRow) => {
        setSelectedRecordData(selectedRowData);
        setConfirmEdit(true); // Set to true to handle edit logic
        setOpenConfirmationModal(true);
    };

    const handleSendMoney = (selectedRowData: BeneficiaryTableRow) => {
        navigate(`/${paths.dashboard.vendorPayouts}/${paths.vendorPayouts.upload}`, {
            state: { selectedData: selectedRowData },
        });
    };

    const handleConfirmAction = async () => {
        if (confirmEdit) {
            navigate(`${paths.vendorPayouts.registerBeneficiary}`, {
                state: { selectedData: selectedRecordData },
            });
        } else {
            const res = await deleteBeneficiaryData(selectedRecordData?.id!);
            if (res) {
                setSelectedRecordData(null);
                fetchBeneficiariesData();
            }
        }
        setOpenConfirmationModal(false);
    };

    const beneficiariesTable: TableColumnsType<any> = [
        {
            title: 'Date',
            dataIndex: 'updatedAt',
            align: 'center',
        },
        {
            title: 'Beneficiaries Name',
            dataIndex: 'fullName',
            align: 'center',
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            align: 'center',
            render: (_, record: BeneficiaryTableRow) => (
                <Flex vertical align="center">
                    <Flex>{record.email}</Flex>
                    <Flex>{record.phoneNumber}</Flex>
                </Flex>
            ),
        },
        {
            title: 'Currency',
            dataIndex: 'country',
            align: 'center',
        },
        {
            title: 'Country',
            dataIndex: 'country',
            align: 'center',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (text, record: BeneficiaryTableRow) => (
                <Space size="middle">
                    <Button className="border-0" onClick={() => handleSendMoney(record)}>
                        <Button htmlType="submit" type="default" danger size="small">
                            Send Money
                        </Button>
                    </Button>
                    <Button className="border-0" onClick={() => handleEdit(record)}>
                        <EditOutlined className="text-[#E30000]" />
                    </Button>
                    <Button className="border-0" onClick={() => handleDelete(record)}>
                        <DeleteOutlined className="text-[#E30000]" />
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Row>
            <Col span={24}>
                <Spin spinning={isLoading}>
                    <Col span={24}>
                        <Input
                            placeholder="Search Beneficiary by name or ID "
                            suffix={<SearchOutlined />}
                            allowClear
                            type="text"
                            maxLength={100}
                            value={filter.search}
                            onChange={handleSearch}
                        />
                    </Col>
                    <GenericTable
                        rowKey={record => record.id}
                        bordered={false}
                        columns={beneficiariesTable}
                        dataSource={data || []}
                        pagination={false}
                        className="w-full mt-8"
                    />
                    <Pagination
                        current={filter.start}
                        onChange={handlePageChange}
                        size="default"
                        className="text-end pt-7"
                        total={count}
                    />
                </Spin>

                <ConfirmationModal
                    isOpen={openConfirmationModal}
                    handleCancel={() => setOpenConfirmationModal(false)}
                    title={
                        confirmEdit
                            ? 'Are you sure you want to edit this?'
                            : 'Are you sure you want to delete this?'
                    }
                    handleSubmit={handleConfirmAction}
                    isLoading={deleteLoader && !confirmEdit}
                />
            </Col>
        </Row>
    );
};

export default Table;
