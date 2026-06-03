/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Flex, Typography, Button, Skeleton, Empty, Col, Table, Input } from 'antd';

import BulkUploadModal from '@components/molecular/modals/BulkUploadModal';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import OtpModal from '@components/molecular/modals/OtpModal';
import { useAppSelector } from '@src/hooks/store';

import BeneficiaryModal from './BeneficiaryModal';
import useGetBeneficiaries from '../../hooks/beneficiary/useBeneficiaryApis';
import useEtiSalatBulkUpload from '../../hooks/beneficiary/useBeneficiaryBulkUpload';
import useBulkPayment from '../../hooks/beneficiary/useBulkPayApis';
import useGetBeneficiarie from '../../hooks/beneficiary/useFetchBeneficiary';
import { Beneficiary, BeneficiaryActionType, GetLimitResponse } from '../../types';
import { beneficiaryTableColumn } from '../../utils/tableColumn';

const BulkBenificiariesList = ({ limitData }: { limitData: GetLimitResponse }) => {
    const { id, role } = useAppSelector(state => state.reducer.auth);
    const details = useAppSelector(state => state.reducer.billPayment);
    const serviceData = details ? details.vendor : null;

    const { tableData, isLoading } = useAppSelector(data => data.reducer.beneficiary);

    const { bulkBalanceApi, isbulkLoading } = useBulkPayment({ limitDetails: limitData });
    useGetBeneficiarie({ accesskey: serviceData?.accessKey });
    const { buttonLoader, sendOtpApi, deleteBeneficicary, updateBeneficiaryStatus, isOtpSending } =
        useGetBeneficiaries({
            accesskey: serviceData?.accessKey,
            openOtpModal: () => setShowOtpModal(true),
            closeOtpModal: () => setShowOtpModal(false),
            closeConfirmationModal: () => setOpenConfirmationModal(false),
        });
    const [showOtpModal, setShowOtpModal] = useState(false);
    const { ADD, EDIT, DELETE } = BeneficiaryActionType;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openBulkModal, setOpenBulkModal] = useState(false);
    const [showBulkOtpModal, setShowBulkOtpModal] = useState(false);
    const [editBeneficiaryData, setEditBeneficiaryData] = useState<Beneficiary | null>(null);
    const { isTemplateFileLoading, getetiSalatBulkUploadTemplate, BulkUpload } =
        useEtiSalatBulkUpload({
            openOtpModal: () => setShowBulkOtpModal(true),
            closeOtpModal: () => setShowBulkOtpModal(false),
            limitData,
            serviceData,
        }); // use the custom hook
    const [beneficiaryActionType, setBeneficiaryActionType] = useState<BeneficiaryActionType>(ADD);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [beneficiaryData, setBeneficiaryData] = useState(tableData);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

    useEffect(() => {
        setBeneficiaryData(tableData);
    }, [tableData]);

    const handleEditClick = (beneficiary: Beneficiary) => {
        setEditBeneficiaryData(beneficiary);
        setBeneficiaryActionType(EDIT);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (beneficiary: Beneficiary) => {
        setEditBeneficiaryData(beneficiary);
        setOpenConfirmationModal(true);
    };

    const handleStatus = async (beneficiary: Beneficiary) => {
        const newStatus = !beneficiary.isActive;
        const isUpdated = await updateBeneficiaryStatus({
            userId: id,
            userType: role,
            id: beneficiary.id,
            isActive: newStatus,
        });
        if (isUpdated) {
            setBeneficiaryData(prevData =>
                prevData.map(item =>
                    item.id === beneficiary.id ? { ...item, isActive: newStatus } : item
                )
            );
        }
    };

    const handleAddBeneficiary = () => {
        setEditBeneficiaryData(null);
        setBeneficiaryActionType(ADD);
        setIsModalOpen(true);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: Beneficiary[]) => {
            const activeRowKeys = selectedRows
                .filter(row => row.isActive)
                .map(row => row.key) as React.Key[];
            setSelectedRowKeys(activeRowKeys);
        },
        getCheckboxProps: (record: Beneficiary) => ({
            disabled: !record.isActive,
        }),
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
        if (value === '') {
            setBeneficiaryData(tableData);
            return;
        }
        const searchString = value.trim().toLowerCase();
        const filteredData = tableData.filter(item => {
            const { name, accountNo, optional1 } = item;
            return (
                name?.toLowerCase().includes(searchString) ||
                accountNo?.includes(searchString) ||
                optional1?.toLowerCase().includes(searchString)
            );
        });
        setBeneficiaryData(filteredData);
    };

    const handleEtisalatBulkPay = () => {
        bulkBalanceApi(selectedRowKeys, limitData);
    };

    return (
        <>
            <Col className="w-full bg-red- flex flex-wrap flex-col gap-5 sm:flex-row sm:justify-between">
                <Typography.Text className="font-medium text-lg sm:text-lg">
                    Your Beneficiaries
                </Typography.Text>
                <Col className="flex gap-5">
                    <Button
                        danger
                        onClick={handleAddBeneficiary}
                        className="h-full text-xs sm:text-sm"
                    >
                        Add Beneficiary
                    </Button>
                    <Button
                        danger
                        className="h-full text-xs sm:text-sm sm:px"
                        onClick={() => setOpenBulkModal(true)}
                    >
                        Bulk Upload
                    </Button>
                </Col>
            </Col>

            <Col className="mt-3 w-full h-[24rem] sm:pr-3 overflow-x-auto">
                {isLoading ? (
                    [...Array(5)].map((_, index) => <Skeleton key={index} active />)
                ) : tableData && tableData.length > 0 ? (
                    <Table
                        rowSelection={rowSelection}
                        columns={beneficiaryTableColumn(
                            handleEditClick,
                            handleDeleteClick,
                            handleStatus
                        )}
                        dataSource={beneficiaryData.map(item => ({
                            ...item,
                            key: item.id,
                        }))}
                        pagination={false}
                        title={() => (
                            <Input
                                placeholder="Search beneficiary"
                                className="text-sm sm:text-base"
                                value={searchValue}
                                onChange={e => handleSearch(e.target.value)}
                                addonAfter={<SearchOutlined />}
                                allowClear
                                type="text"
                                minLength={8}
                                maxLength={20}
                            />
                        )}
                    />
                ) : (
                    <Flex className="h-full" justify="center" align="center">
                        <Empty description="No Beneficiaries Found." className="px-0 sm:px-10" />
                    </Flex>
                )}
            </Col>
            <Button
                danger
                type="primary"
                size="large"
                className="w-full mt-5"
                onClick={handleEtisalatBulkPay}
                loading={isbulkLoading}
            >
                View Bills
            </Button>

            {isModalOpen && (
                <BeneficiaryModal
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    closeAddModal={() => setIsModalOpen(false)}
                    editValues={editBeneficiaryData}
                    beneficiaryActionType={beneficiaryActionType}
                    setBeneficiaryActionType={setBeneficiaryActionType}
                    accesskeyValue={serviceData?.accessKey}
                />
            )}

            {openBulkModal && (
                <BulkUploadModal
                    open={openBulkModal}
                    handleCancel={() => setOpenBulkModal(false)}
                    handleBulkUpload={BulkUpload}
                    isUploading={false}
                    handleTemplateDownload={getetiSalatBulkUploadTemplate}
                    isTemplateFileLoading={isTemplateFileLoading}
                />
            )}
            <OtpModal
                isOpen={showOtpModal}
                isLoading={buttonLoader!}
                handleCancel={() => setShowOtpModal(false)}
                onResend={() => sendOtpApi(beneficiaryActionType)}
                isOtpSending={isOtpSending}
                handleSubmit={async otp => {
                    const resp = await deleteBeneficicary({
                        userId: id,
                        userType: role,
                        id: editBeneficiaryData?.id,
                        scope: 'email',
                        otp,
                    });
                    if (resp) setBeneficiaryActionType(EDIT);
                    if (resp)
                        setBeneficiaryData(prevData =>
                            prevData.filter(item => item.id !== editBeneficiaryData?.id)
                        );

                    setShowOtpModal(false);
                }}
                title="OTP Verification"
            />
            <ConfirmationModal
                isOpen={openConfirmationModal}
                handleCancel={() => setOpenConfirmationModal(false)}
                title="Are you sure you want to delete this beneficiary?"
                handleSubmit={async () => {
                    sendOtpApi(DELETE);
                    setBeneficiaryActionType(DELETE);
                }}
                isLoading={isOtpSending!}
            />
        </>
    );
};

export default BulkBenificiariesList;
