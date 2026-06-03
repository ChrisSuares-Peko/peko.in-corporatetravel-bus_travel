import { useState } from 'react';

import { Col, Flex, Pagination, Row, Tabs, TabsProps, Typography, Skeleton } from 'antd';
import { ReactSVG } from 'react-svg';

import ManageBookingSVG from '../assets/icons/ManageBookings.svg';
import HeadManageBooking from '../components/HeadManageBooking';
import BookingsBody from '../components/ManageBooking/BookingsBody';
import { useManageBookingListAPI } from '../hooks/useManageBookingList';

const ManageBooking = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [availability, setAvailability] = useState<string>('upcoming');
    const [reload, setReload] = useState(false);
    const { data, pageData, isLoading, getBookingsListHandler } = useManageBookingListAPI(
        currentPage,
        availability,
        reload
    );
    const onChange = (key: string) => {
        setAvailability(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'upcoming',
            label: 'Upcoming Ticket',
            // children: 'Content of Tab Pane 1',
        },
        {
            key: 'expired',
            label: 'Past and Cancelled',
            // children: 'Content of Tab Pane 2',
        },
    ];
    return (
        <Row>
            <Col span={24}>
                <Flex vertical gap={40}>
                    <HeadManageBooking />
                    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                    {isLoading ? (
                        <Skeleton />
                    ) : (
                        <>
                            {data?.length === 0 ? (
                                <Flex
                                    className="w-full h-full mt-36"
                                    justify="center"
                                    align="center"
                                    vertical
                                >
                                    <ReactSVG src={ManageBookingSVG} />
                                    <Typography.Text className="text-textGrey mt-4 text-center">
                                        No {availability === 'upcoming' ? 'upcoming' : 'past'}{' '}
                                        tickets found
                                    </Typography.Text>
                                </Flex>
                            ) : (
                                data && (
                                    <>
                                        <BookingsBody
                                            bookings={data}
                                            currentPage={currentPage}
                                            getBookingsListHandler={getBookingsListHandler}
                                            setReload={setReload}
                                        />
                                        <Pagination
                                            className="sm:text-end text-center mt-10"
                                            defaultPageSize={10}
                                            defaultCurrent={1}
                                            size="small"
                                            total={pageData.count}
                                            onChange={(pageCount, pageSize) => {
                                                setCurrentPage(pageCount);
                                            }}
                                        />
                                    </>
                                )
                            )}
                        </>
                    )}
                </Flex>
            </Col>
        </Row>
    );
};

export default ManageBooking;
