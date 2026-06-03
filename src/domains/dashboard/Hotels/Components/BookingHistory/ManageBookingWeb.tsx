import { Col, Flex, Image, Pagination, Skeleton, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

import noBookings from '@domains/dashboard/Hotels/Assets/noBookings.png';

import Manage from './Manage';
import { Booking, bookingData } from '../../types/managebookingTypes';

interface bookingProps {
    currentPage: number;
    setCurrentPage: Function;
    isLoading: boolean;
    data: Booking[];
    bookings: bookingData | undefined;
    refetch?: any;
}

const ManageBookingWeb = ({
    isLoading,
    data,
    bookings,
    currentPage,
    setCurrentPage,
    refetch,
}: bookingProps) => {
    const count = bookings?.count;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            {data.length === 0 && !isLoading ? (
                <Flex vertical justify="center" align="center" style={{ height: '60vh' }}>
                    <Image height={200} width={250} src={noBookings} preview={false} />
                    <Typography.Text className="text-gray-400 mt-2 mr-1">
                        {' '}
                        No Bookings Found
                    </Typography.Text>
                </Flex>
            ) : (
                <Content>
                    {isLoading ? (
                        <Col span={24} className="mt-5">
                            <Skeleton active avatar />
                        </Col>
                    ) : (
                        <>
                            {data.map(item => (
                                <Manage
                                    orderId={item.id}
                                    txnId={item.corporateTxnId}
                                    details={item.orderResponse}
                                    baseAmt={item.baseAmount}
                                    refetch={refetch}
                                />
                            ))}
                            <Flex justify="end" className="mt-3">
                                <Pagination
                                    current={currentPage}
                                    defaultCurrent={1}
                                    total={count}
                                    showSizeChanger={false}
                                    onChange={handlePageChange}
                                />
                            </Flex>
                        </>
                    )}
                </Content>
            )}
        </>
    );
};

export default ManageBookingWeb;
