import { useState } from 'react';

import { Button, Card, Col, Image, Row, Spin, Typography } from 'antd';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import useDownloadTicket from '../../hooks/useDownloadTicket';
import useUpdateBooking from '../../hooks/useUpdateBooking';
import { Booking } from '../../types/Booking';
import FlightDurationBadge from '../FlightDurationBadge';
import FlightInfo from '../FlightInfoTypography';

interface BookingBodyProps {
    bookings: Booking[];
    currentPage: number;
    getBookingsListHandler: (num: number) => void;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

function BookingsBody({
    bookings,
    currentPage,
    getBookingsListHandler,
    setReload,
}: BookingBodyProps) {
    const { HandleDownloadTicket } = useDownloadTicket();
    const navigate = useNavigate();
    const { HandleUpdateBooking } = useUpdateBooking();
    const [downloadTicketLoading, setDownloadedTicketLoading] = useState(false);
    const dispatch = useAppDispatch();

    const downloadTicket = async (id: number) => {
        try {
            setDownloadedTicketLoading(true);
            const res = await HandleDownloadTicket(id);
            if (res) {
                const uint8Array = new Uint8Array(res.pdfFile.data);
                const blob = new Blob([uint8Array], { type: 'application/pdf' });
                await saveAs(blob, 'invoice.pdf');
                setDownloadedTicketLoading(false);
            }
        } catch (error) {
            setDownloadedTicketLoading(false);
            dispatch(
                showToast({
                    description: 'Something went wrong while generating invoice',
                    variant: 'error',
                })
            );
        }
    };

    const handleRetry = async (id: number) => {
        await HandleUpdateBooking(id);
        dispatch(showToast({ description: 'Booking request sent', variant: 'success' }));
        getBookingsListHandler(currentPage);
    };

    return (
        <Spin className="w-full" spinning={downloadTicketLoading}>
            <Row gutter={16}>
                {bookings &&
                    bookings.map((item, index) => (
                        <Col key={index} className="mb-5" span={24}>
                            <Card className="border-2 p-2" size="small">
                                <Row>
                                    <Col
                                        md={4}
                                        lg={3}
                                        className="xs:flex xs:flex-col md:flex md:flex-col items-center w-full justify-center bg-tagColor"
                                    >
                                        <Image
                                            preview={false}
                                            className="w-full max-w-[7.5rem] h-auto object-contain"
                                            src={item?.logo}
                                            alt={`${item?.flightClass} logo`}
                                        />
                                        <Typography.Text className="text-red-400 xs:ml-5 ml-0 font-medium me-6 text-xs mt-4">
                                            {item?.flightClass} Class
                                        </Typography.Text>
                                    </Col>

                                    <Col sm={24} md={20} lg={22} xl={17} className="py-5 px-6">
                                        <Row>
                                            <Col
                                                sm={24}
                                                lg={8}
                                                className="flex flex-col items-center text-center pt-4"
                                            >
                                                <Typography.Text className="text-gray-500 text-base font-semibold">
                                                    Depart
                                                </Typography.Text>
                                                <FlightInfo info={item?.depart} />
                                            </Col>
                                            <Col
                                                sm={24}
                                                lg={8}
                                                className="flex flex-col items-center justify-center"
                                            >
                                                <FlightDurationBadge
                                                    duration={item.flightDuration}
                                                />
                                                <Typography.Text className="text-gray-500 text-base mt-2">
                                                    {item?.stopCount} stop
                                                </Typography.Text>
                                            </Col>
                                            <Col
                                                sm={24}
                                                lg={8}
                                                className="flex flex-col items-center text-center pt-4"
                                            >
                                                <Typography.Text className="text-gray-500 text-base font-semibold">
                                                    Arrive
                                                </Typography.Text>
                                                <FlightInfo info={item?.arrive} />
                                            </Col>
                                        </Row>
                                        <Row className="mt-2 w-full" justify="center">
                                            <Col className="flex">
                                                <Typography.Text className="text-base font-light px-3">
                                                    Airline Booking Code:
                                                    <Typography.Text className="font-medium">
                                                        {` ${item?.bookingCode}`}
                                                    </Typography.Text>
                                                </Typography.Text>
                                                <Typography.Text className="text-base font-light px-3">
                                                    Confirmation number:
                                                    <Typography.Text className="font-medium">
                                                        {` ${item?.ConfimationNumber}`}
                                                    </Typography.Text>
                                                </Typography.Text>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col
                                        lg={24}
                                        xl={4}
                                        className="flex items-center justify-center md: mb-4 xl:flex-col mx-auto gap-4"
                                    >
                                        <>
                                            <Button
                                                danger
                                                className="w-40 flex justify-center"
                                                style={{ borderRadius: '0.125rem' }}
                                                onClick={() => downloadTicket(Number(item.id))}
                                                type="primary"
                                            >
                                                Download Booking
                                            </Button>
                                            <Button
                                                danger
                                                className="w-40 flex justify-center"
                                                loading={false}
                                                style={{ borderRadius: '0.125rem' }}
                                                onClick={() => {
                                                    // handleCancellation({
                                                    //     conversationId: item?.conversationId,
                                                    //     selectedCorporateTxnId:
                                                    //         item?.corporateTxnId,
                                                    //     bookingReferenceId:
                                                    //         item?.bookingReferenceId,
                                                    // });

                                                    navigate(
                                                        `${paths.dashboard.corporateTravel}/${paths.airline.index}/${paths.airline.manage}/${paths.airline.bookingDetails}`,
                                                        {
                                                            state: {
                                                                corporateTxnId:
                                                                    item?.corporateTxnId,
                                                            },
                                                        }
                                                    );
                                                }}
                                            >
                                                View/Manage booking
                                            </Button>
                                        </>

                                        {(item.status === 'BOOKING FAILED' ||
                                            item.status === 'PNR FAILED') && (
                                            <Typography.Text className="text-red-400">
                                                Booking failed
                                            </Typography.Text>
                                        )}

                                        {item.status === 'OK TO TICKET' && (
                                            <>
                                                <Typography.Text className="text-red-400 text-center">
                                                    Booking is pending retry after <br />
                                                    some time
                                                </Typography.Text>
                                                <Button
                                                    danger
                                                    type="primary"
                                                    className="w-40 flex justify-center"
                                                    style={{ borderRadius: '0.125rem' }}
                                                    onClick={() => handleRetry(Number(item.id))}
                                                >
                                                    Retry
                                                </Button>
                                            </>
                                        )}
                                        {item.ecomOrderStatus === 'CANCELLED' && (
                                            <Typography.Text className="text-red-400">
                                                Refund raised
                                            </Typography.Text>
                                        )}
                                        {item.ecomOrderStatus === 'REFUNDED' && (
                                            <Typography.Text className="text-red-400">
                                                Refunded
                                            </Typography.Text>
                                        )}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))}
            </Row>
        </Spin>
    );
}

export default BookingsBody;
