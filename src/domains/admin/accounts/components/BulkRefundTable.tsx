import React, { useState } from 'react';

import { Button, Col, Flex, Row, Select, Table, Typography } from 'antd';

import OtpModal from '@components/molecular/modals/OtpModal';
import { DropDown } from '@customtypes/general';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { Transaction, payloadData } from '../types/bulkRefund';
import { BulkRefundColumns, calculateTimeRemainingToNext1026AMUTC } from '../utils/bulkRefundData';

interface BulkRefundTableProps {
    tableData: Transaction[];
    isLoading: boolean;
    loader: boolean;
    otpLoader: boolean;
    categoryDatas?: DropDown | undefined;
    handleCategoryFilters?: (val: string) => void;
    bulkPaymentApi: (payloaData: payloadData) => Promise<boolean>;
    getOtp: () => Promise<boolean>;
}
const BulkRefundTable = ({
    tableData,
    isLoading,
    categoryDatas,
    handleCategoryFilters,
    bulkPaymentApi,
    getOtp,
    loader,
    otpLoader,
}: BulkRefundTableProps) => {
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const handleOtp = () => {
        getOtp();
        setOpenModal(true);
    };
    const handleBulkPayment = async (otp: string) => {
        const res: boolean = await bulkPaymentApi({
            otp,
            checkedCorporateTxnIds: selectedIds,
            scope: 'email',
            total: totalAmount,
        });
        if (res) {
            setSelectedRows([]);
            setSelectedIds([]);
            setTotalAmount(0);
        }
        setOpenModal(false);
    };

    const rowSelection = {
        selectedRowKeys: selectedRows,
        onChange: (selectedRowKeys: React.Key[]) => {
            const selectedRowKeysArray = selectedRowKeys.map(key => Number(key));
            setSelectedRows(selectedRowKeysArray);
        },
        onSelect: (record: Transaction, selected: boolean) => {
            if (selected) {
                setSelectedIds(prevIds => {
                    if (!prevIds || prevIds.includes(record.corporateTxnId)) {
                        return prevIds;
                    }
                    return [...prevIds, record.corporateTxnId];
                });
                setTotalAmount((prevState: number) => prevState + Number(record.order.amountInAed));
            } else {
                const newID = selectedIds?.filter(id => id !== record.corporateTxnId);
                setSelectedIds(newID);
                setTotalAmount((prevState: number) => prevState - Number(record.order.amountInAed));
            }
        },
        onSelectAll: (selected: boolean, allSelectedRows: Transaction[]) => {
            if (allSelectedRows.length === 0) {
                setSelectedIds([]);
                setTotalAmount(0);
            }

            const totalSum = allSelectedRows.reduce((acc, record) => {
                if (record && record.order && record.order.amountInAed) {
                    return acc + Number(record.order.amountInAed);
                }
                return acc;
            }, 0);
            const newSelectedIds: string[] = [];
            allSelectedRows.forEach(record => {
                if (
                    record &&
                    record.corporateTxnId &&
                    !newSelectedIds.includes(record.corporateTxnId)
                ) {
                    newSelectedIds.push(record.corporateTxnId);
                }
            });
            setSelectedIds(newSelectedIds);
            setTotalAmount(prevState => prevState + totalSum);
        },
        getCheckboxProps: (record: Transaction) => ({
            disabled:
                record.remarks === 'REFUNDED' ||
                calculateTimeRemainingToNext1026AMUTC(
                    record.transactionDate,
                    record.remarks,
                    record.order.paymentMode
                ) !== '',
            status: record.remarks,
        }),
    };
    return (
        <>
            <Table
                rowSelection={rowSelection}
                columns={BulkRefundColumns}
                dataSource={tableData.map(item => ({
                    ...item,
                    key: item.id,
                }))}
                loading={isLoading}
                pagination={{ position: ['bottomRight'] }}
                title={() => (
                    <Row justify="space-between" gutter={[0, 10]} className="-mx-4">
                        <Col xs={24} sm={6} md={2}>
                            <Button
                                onClick={() => {
                                    setSelectedRows([]);
                                    setSelectedIds([]);
                                    setTotalAmount(0);
                                }}
                                disabled={selectedRows.length <= 0}
                                type="primary"
                                danger
                                className=""
                            >
                                Clear Selection
                            </Button>
                        </Col>
                        <Col xs={24} sm={12} md={5}>
                            {categoryDatas && (
                                <Select
                                    options={(categoryDatas || []).map(d => ({
                                        value: d.value,
                                        label: d.label,
                                    }))}
                                    defaultValue={categoryDatas[0].value}
                                    placeholder="Select Category"
                                    loading={categoryDatas.length < 0}
                                    className="w-full"
                                    onChange={handleCategoryFilters}
                                    defaultActiveFirstOption={false}
                                    filterOption={false}
                                />
                            )}
                        </Col>
                    </Row>
                )}
                footer={() => (
                    <Flex className="w-full px- my-2" justify="space-between">
                        <Typography.Text className="text-2xl font-semibold">Amount</Typography.Text>
                        <Typography.Text className="text-2xl font-semibold ">
                            AED {formatNumberWithLocalString(totalAmount)}
                        </Typography.Text>
                    </Flex>
                )}
                rowClassName={record => (!record.status ? 'cursor-not-allowed  opacity-50' : '')}
            />
            <Flex className="w-full my-10" gap={30}>
                <Button
                    onClick={handleOtp}
                    loading={otpLoader}
                    disabled={totalAmount <= 0}
                    key="submit"
                    type="primary"
                    htmlType="submit"
                    danger
                    className="px-10 h-10"
                >
                    Pay AED {formatNumberWithLocalString(totalAmount)}
                </Button>
            </Flex>
            <OtpModal
                onResend={() => getOtp()}
                handleSubmit={handleBulkPayment}
                handleCancel={() => setOpenModal(false)}
                isOpen={openModal}
                isLoading={isLoading}
                title="Otp has sent to your email address"
                isOtpSending
            />
        </>
    );
};

export default BulkRefundTable;
