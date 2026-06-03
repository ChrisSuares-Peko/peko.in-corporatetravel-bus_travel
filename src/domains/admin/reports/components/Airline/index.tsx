import { useState } from 'react';

import { Button, Flex, Pagination, Typography } from 'antd';
import dayjs from 'dayjs';

import GenericTable from '@components/atomic/GenericTable';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';
import { toTitleCase } from '@utils/wordFormat';

import Header from './Header';
import RefundModal from './RefundModal';
import useAirline from '../../hooks/useAirline';
import useFilter from '../../hooks/useFilter';
import useGetCorporateDatas from '../../hooks/useGetCorporateDatas';
import { Booking } from '../../types/airline';

function calculateTimeRemainingToNext1026AMUTC(
    transactionDate: string | number | Date,
    status: string,
    paymentMode: string
) {
    try {
        if (status === 'REFUNDED' || paymentMode === 'WALLET') {
            return { status: true, message: '' };
        }
        const oneHourInMilliseconds = 3600000;
        const oneMinuteInMilliseconds = 60000;

        // Get the current UTC date and time
        const nowUTC = new Date();

        const transactionDateUTC = new Date(transactionDate);
        const next1026AMUTC = new Date(nowUTC);
        next1026AMUTC.setHours(10, 26, 0, 0); // Set to 10:26 AM
        if (nowUTC.getHours() > 10 || (nowUTC.getHours() === 10 && nowUTC.getMinutes() >= 26)) {
            next1026AMUTC.setDate(next1026AMUTC.getDate() + 1); // Move to the next day if current time is past 10:26 AM
        }

        // Subtract the timestamps (using getTime()) to find the time difference
        const diff =
            (next1026AMUTC.getTime() - transactionDateUTC.getTime()) / oneHourInMilliseconds;
        if (diff > 24) {
            return { status: true, message: '' };
        }

        // Calculate the difference in milliseconds
        const diffMs = next1026AMUTC.getTime() - nowUTC.getTime();

        // Calculate hours and minutes remaining
        const hours = Math.floor(diffMs / oneHourInMilliseconds);
        const minutes = Math.floor((diffMs % oneHourInMilliseconds) / oneMinuteInMilliseconds);

        return { status: false, message: `${hours}h ${minutes} min to refund` };
    } catch (error) {
        return { status: false, message: 'N/A' };
    }
}

const Airline = () => {
    const today = dayjs();
    const todayFormatted = today.format('YYYY-MM-DD');
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<Booking>();
    const initialValues = {
        searchText: '',
        category: '',
        sort: 'DESC',
        sortField: 'transactionDate',
        page: 1,
        itemsPerPage: 10,
        from: todayFormatted,
        to: todayFormatted,
        id: '',
    };
    const [filters, setFilters] = useState(initialValues);
    const {
        isLoading,
        modalLoading,
        tableData,
        count,
        getAllTableData,
        downloadReport,
        refundAmount,
    } = useAirline(filters);
    const {
        handleSearch,
        handlePageChange,
        handleDateChange,
        handleFromChange,
        handleToChange,
        searchText,
        setSearchText,
        handleChangeFilters,
        handleTableChange,
    } = useFilter({
        setFilters,
        initalStartDate: initialValues.from,
        initalEndDate: initialValues.to,
    });
    const { corporateDatas } = useGetCorporateDatas(searchText);
    const columns = [
        {
            title: 'Date',
            sorter: true,
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            render: (transactionDate: any) => (
                <Flex vertical>
                    <Typography.Text>
                        {formattedDateOnly(new Date(transactionDate))}
                    </Typography.Text>
                    <Typography.Text>{formattedTime(new Date(transactionDate))}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'Corporate',
            sorter: true,
            dataIndex: ['credential', 'name'],
            key: 'corporateTxnId',
            render: (_: any, data: any) => (
                <Flex vertical>
                    <Typography.Text>{data?.credential.name}</Typography.Text>
                    <Typography.Text>{data?.credential.username}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'Transaction Id',
            sorter: true,
            dataIndex: 'corporateTxnId',
            key: 'corporateTxnId',
        },
        {
            title: 'Amount',
            sorter: true,
            dataIndex: 'debitAmount',
            key: 'debitAmount',
            render: (_: any, data: Booking) => {
                // const amountInAed = data?.order?.amountInAed || 'N/A'
                const orderAmount = data?.order?.orderResponse?.data[0]?.fare?.totalFare || 'N/A';
                const paymentMode = data?.order?.paymentMode || 'N/A';
                return (
                    <Flex vertical>
                        <Typography.Text>
                            AED {formatNumberWithLocalString(orderAmount)}
                        </Typography.Text>
                        <Typography.Text>{toTitleCase(paymentMode)}</Typography.Text>
                    </Flex>
                );
            },
        },
        {
            title: 'Payment Status',
            sorter: true,
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Refunded',
            sorter: true,
            dataIndex: 'debitAmount',
            key: 'debitAmount',
            render: (_: any, data: any) => {
                const refundedAmount = data?.order?.shipmentStatus?.refundAmount || '';
                return (
                    <Flex vertical>
                        <Typography.Text>
                            {refundedAmount
                                ? `AED ${formatNumberWithLocalString(refundedAmount)}`
                                : ''}
                        </Typography.Text>
                    </Flex>
                );
            },
        },
        // {
        //     title: 'Booking Status',
        //     sorter: true,
        //     dataIndex: 'id',
        //     key: 'id',
        //     render: (_: any, data: Booking) => {
        //         // let status = data?.order?.orderResponse?.data[0]?.bookingStatus || 'N/A'
        //         const status2 = data?.order?.ecomOrderStatus || 'N/A'
        //         return <Typography.Text> {status2}</Typography.Text>
        //     },
        // },
        {
            title: 'Action',
            sorter: true,
            dataIndex: 'id',
            key: 'id',
            render: (_: any, data: Booking) => {
                const ecomOrderStatus = data?.order?.ecomOrderStatus;
                const { status, message } = calculateTimeRemainingToNext1026AMUTC(
                    data.transactionDate,
                    data.status,
                    data.order.paymentMode
                );
                return (
                    <>
                        {status ? (
                            <Button
                                type="default"
                                size="small"
                                disabled={ecomOrderStatus === 'REFUNDED'}
                                onClick={() => {
                                    setOpenModal(true);
                                    setModalData(data);
                                }}
                                danger
                            >
                                Refund
                            </Button>
                        ) : (
                            <Typography.Text>{message}</Typography.Text>
                        )}
                    </>
                );
            },
        },
    ];
    return (
        <Flex vertical gap={20}>
            <Header
                handleDownloadReport={downloadReport}
                dropDownData={corporateDatas}
                setSearchText={setSearchText}
                handleChangeFilters={handleChangeFilters}
                handleSearch={handleSearch}
                searchText={filters.searchText}
                handleDateChange={handleDateChange}
                handleFromChange={handleFromChange}
                handleToChange={handleToChange}
                from={filters.from}
                to={filters.to}
            />
            <GenericTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={isLoading}
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
                <RefundModal
                    open={openModal}
                    handleCancel={() => {
                        setOpenModal(false);
                        setModalData(undefined);
                    }}
                    data={modalData!}
                    handleRefresh={getAllTableData}
                    refundAmount={refundAmount}
                    loading={modalLoading}
                />
            )}
        </Flex>
    );
};

export default Airline;
