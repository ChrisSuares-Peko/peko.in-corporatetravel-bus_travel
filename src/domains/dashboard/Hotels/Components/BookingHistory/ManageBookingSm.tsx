import { Flex, Pagination, Typography, Col, Skeleton } from 'antd';

import RecentlyBookedSm from '@domains/dashboard/Hotels/Components/BookingHistory/RecentlyBookedSm';

import { Booking, bookingData } from '../../types/managebookingTypes';

interface bookingProps {
    currentPage: number;
    setCurrentPage: Function;
    isLoading: boolean;
    data: Booking[];
    bookings: bookingData | undefined;
    refetch?: any;
}

const ManageBookingSm = ({
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
            {/* <Navigation /> */}
            <Flex>
                <Typography.Title level={5}>Recently Booked</Typography.Title>
            </Flex>
            {isLoading ? (
                <Col span={24} className="mt-5">
                    <Skeleton active avatar />
                </Col>
            ) : (
                <>
                    {data.map(item => (
                        <Flex className="pt-4" key={item.id}>
                            <RecentlyBookedSm
                                orderId={item.id}
                                txnId={item.corporateTxnId}
                                details={item.orderResponse}
                                baseAmt={item.baseAmount}
                                refetch={refetch}
                            />
                        </Flex>
                    ))}
                    <Flex justify="end" className="mt-3">
                        <Pagination
                            current={currentPage}
                            defaultCurrent={1}
                            total={count}
                            onChange={handlePageChange}
                        />
                    </Flex>
                </>
            )}
        </>
    );
};

export default ManageBookingSm;
