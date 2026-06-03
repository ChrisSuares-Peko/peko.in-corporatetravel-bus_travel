import { useState } from 'react';

import { Flex, Grid, Typography } from 'antd';

import ManageBookingSm from '../Components/BookingHistory/ManageBookingSm';
import ManageBookingWeb from '../Components/BookingHistory/ManageBookingWeb';
import useManageBokingsApi from '../hooks/useManageBookingApi';

const { useBreakpoint } = Grid;
const ManageBooking = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { isLoading, data, bookings, refetch } = useManageBokingsApi(currentPage);
    const screens = useBreakpoint();

    return (
        <>
            <Flex>
                <Typography.Title level={4}> Manage Your Bookings</Typography.Title>
            </Flex>

            {screens.md ? (
                <ManageBookingWeb
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    isLoading={isLoading}
                    data={data}
                    bookings={bookings}
                    refetch={refetch}
                />
            ) : (
                <ManageBookingSm
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    isLoading={isLoading}
                    data={data}
                    bookings={bookings}
                    refetch={refetch}
                />
            )}
        </>
    );
};

export default ManageBooking;
