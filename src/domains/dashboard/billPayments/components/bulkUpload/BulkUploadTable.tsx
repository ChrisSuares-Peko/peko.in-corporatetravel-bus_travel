import { useState } from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Col, Row, Typography, Table, Button, Flex, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import { TableProps } from 'antd/lib';
import * as Yup from 'yup';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { BulkValidateApi } from '../../api/etisalat';
import { deleteBulkData, updateBulkData } from '../../slices/beneficiary';
import { GetLimitResponse } from '../../types';
import { BulkUploadResponse, BulkData } from '../../types/etisalat';
import BulkForm from '../forms/BulkForm';

const BulkUploadTable = ({ limitData }: { limitData: GetLimitResponse }) => {
    const data = useAppSelector(state => state.reducer.billPayment);
    const item = data ? data.vendor : null;
    const bulkEtiSalat = useAppSelector(state => state.reducer.beneficiary).bulkData;
    const dispatch = useAppDispatch();
    const { role } = useAppSelector(state => state.reducer.auth);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [selectedProductInfo, setSelectedProductInfo] = useState<{
        data: BulkData | undefined;
        index: number;
    }>();

    const handleEditClick = (index: number) => {
        const product = bulkEtiSalat[index];
        if (product) {
            setIsModalVisible(true);
            setSelectedProductInfo({ data: product, index });
        }
    };

    const handleDeleteClick = (index: number) => {
        const product = bulkEtiSalat[index];
        if (product) {
            setOpenConfirmationModal(true);
            setSelectedProductInfo({ data: product, index });
        }
    };

    const handleDelete = () => {
        if (selectedProductInfo) {
            dispatch(deleteBulkData(selectedProductInfo.index));
            setOpenConfirmationModal(false);
            setIsModalVisible(false);
        }
    };

    const columns: TableColumnsType<BulkData> = [
        {
            title: '#',
            dataIndex: 'index',
            render: (text, record, index) => (
                <Typography.Text>{(current - 1) * pageSize + index + 1}</Typography.Text>
            ),
        },
        {
            title: 'Beneficiary Name',
            dataIndex: 'name',
            render: (name: string) => <Typography.Text>{name}</Typography.Text>,
        },
        {
            title: 'Validation',
            dataIndex: 'status',
            render: (status: boolean) => (
                <Typography.Text style={{ color: status ? 'green' : 'red' }}>
                    {status ? 'Success' : 'Error'}
                </Typography.Text>
            ),
        },
        {
            title: 'Message',
            dataIndex: 'errors',
            render: (errors: string[]) => (
                <ul style={{ color: 'red' }}>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            ),
        },
        {
            title: '',
            dataIndex: 'index',
            width: '10%',
            render: (text, record, index) => {
                const selectedIndex = (current - 1) * pageSize + index;
                return (
                    <Space>
                        <Button type="link" onClick={() => handleEditClick(selectedIndex)}>
                            <EditOutlined className="text-bgOrange2" />
                        </Button>
                        <Button type="link" onClick={() => handleDeleteClick(selectedIndex)}>
                            <DeleteOutlined className="text-bgOrange2" />
                        </Button>
                    </Space>
                );
            },
        },
    ];

    const handleTableChange: TableProps<BulkData>['onChange'] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        if (pagination.current) setCurrent(pagination.current);
        if (pagination.pageSize) setPageSize(pagination.pageSize);
    };
    const etisalatBulkModalSchema = Yup.object().shape({
        name: Yup.string().required('Please enter the beneficiary name'),
        accountNo: Yup.string()
            .trim()
            .required('Please enter a valid Mobile number')
            .min(7, 'Mobile number must be 8-10 digits')
            .max(10, 'Account Number Cannot exceed 10 digits'),
        optional1: Yup.string().when([], {
            is: () => item?.accessKey === 'etisalat_bill',
            then: schema => schema.required('Please select the service type'),
            otherwise: schema => schema,
        }),
    });
    return (
        <>
            <Row className="mt-4" gutter={[0, 20]}>
                <Col span={24}>
                    <Table
                        rowKey={(record, index) => index?.toString() || record.name}
                        columns={columns}
                        scroll={{ x: 992 }}
                        dataSource={bulkEtiSalat}
                        pagination={{ current, pageSize, total: bulkEtiSalat.length }}
                        onChange={handleTableChange}
                    />
                </Col>
            </Row>
            {isModalVisible && (
                <CustomModalWithForm
                    modalTitle={
                        <Flex justify="space-between">
                            <Typography.Text className="font-medium">
                                {item ? item?.title : ''} Bulk Management
                            </Typography.Text>
                        </Flex>
                    }
                    open={isModalVisible}
                    handleCancel={() => setIsModalVisible(false)}
                    handleFormSubmit={async values => {
                        const jsonData = {
                            ...bulkEtiSalat[selectedProductInfo?.index!],
                            ...values,
                        };
                        const response: BulkUploadResponse | false = await BulkValidateApi(
                            jsonData,
                            role,
                            limitData
                        );
                        if (response) {
                            dispatch(
                                updateBulkData({
                                    index: selectedProductInfo?.index!,
                                    updatedBulkData: response?.jsonData[0],
                                })
                            );
                            setIsModalVisible(false);
                        }
                    }}
                    initialValues={{
                        name: selectedProductInfo?.data?.name || '',
                        accountNo: selectedProductInfo?.data?.accountNo || '',
                        ...(item?.accessKey === 'etisalat_bill' && {
                            optional1: selectedProductInfo?.data?.optional1 || '',
                        }),
                    }}
                    validationSchema={etisalatBulkModalSchema}
                >
                    <BulkForm />
                </CustomModalWithForm>
            )}
            <ConfirmationModal
                isOpen={openConfirmationModal}
                handleCancel={() => setOpenConfirmationModal(false)}
                title="Are you sure you want to delete this beneficiary?"
                handleSubmit={async () => {
                    handleDelete();
                }}
                isLoading={false}
            />
        </>
    );
};

export default BulkUploadTable;
