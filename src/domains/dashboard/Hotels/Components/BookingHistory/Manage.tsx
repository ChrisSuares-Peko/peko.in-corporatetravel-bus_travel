/* eslint-disable no-plusplus */
import { useState } from 'react';

import { Button, Col, Flex, Grid, Image, Row, Spin, Typography, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { saveAs } from 'file-saver';

import CheckInDetails from '@src/domains/dashboard/Hotels/Components/BookingHistory/CheckInDetails';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import CancelBooking from './CancelBooking';
import defaultImage from '../../Assets/defaultImage.jpg';
import useCancellationApi from '../../hooks/useCancellationApi';
import DateFields from '../../hooks/useDateField';
import useTicketDownloadApi from '../../hooks/useDownloadTicketApi';
import useTimeConvert from '../../hooks/useTimeConvertHook';
import { getTxnId } from '../../slices/getHotelSlice';
import { cancelArray } from '../../types/types';

const { useBreakpoint } = Grid;
interface bookingProps {
    orderId: number;
    details: string;
    txnId: string;
    baseAmt: number;
    refetch?: any;
}

const Manage = ({ orderId, details, txnId, baseAmt, refetch }: bookingProps) => {
    const { convertToAMPM } = useTimeConvert();
    const [downloadTicketLoading, setDownloadedTicketLoading] = useState(false);
    const dispatch = useAppDispatch();
    const { showModal, isModalOpen, handleCancel } = DateFields();

    // const orderResponseObj = JSON.parse(details);
    let orderResponseObj;
    if (details) {
        try {
            orderResponseObj = JSON.parse(details);
        } catch (error) {
            // console.error('Error parsing details:', error);
        }
    }
    const res = orderResponseObj?.data[0]?.hotel;
    const passengers = orderResponseObj?.data[0]?.passengers;
    const [charges, setCharges] = useState<cancelArray[]>([]);
    const { download } = useTicketDownloadApi();
    const { cancellation, isLoading } = useCancellationApi();
    let adultCount = 0;
    let childCount = 0;
    let rooms = 0;
    passengers?.forEach((passenger: any) => {
        rooms = passenger.roomIndex;
        if (passenger.ptc === 'ADT') {
            adultCount++;
        } else if (passenger.ptc === 'CHD') {
            childCount++;
        }
    });

    const checkInDate1 = new Date(res?.checkInDate);
    const checkOutDate1 = new Date(res?.checkOutDate);
    const timeDiff = checkOutDate1.getTime() - checkInDate1.getTime();
    const nightDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const Info = orderResponseObj?.hotelContact;
    const cId = orderResponseObj?.meta?.conversationId;
    const bookingId = orderResponseObj?.data[0].bookingReferenceId;

    const screens = useBreakpoint();
    const {
        token: { colorPrimary },
    } = theme.useToken();

    const handleSubmit = () => {
        dispatch(getTxnId(txnId));
        cancellation(bookingId, cId).then((data: any) => {
            setCharges(data.data);
        });
        showModal();
    };

    const handleDownload = async () => {
        try {
            setDownloadedTicketLoading(true);
            const resp = await download(Number(orderId));

            if (resp) {
                const uint8Array = new Uint8Array(resp.pdfFile.data);

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
    const bookingStatus = orderResponseObj?.data[0]?.bookingStatus || '';
    let cancellationDeadlineDate;
    if (orderResponseObj?.hotelContact?.cancellationPolicy) {
        cancellationDeadlineDate =
            orderResponseObj?.hotelContact?.cancellationPolicy[0].cancellationDeadlineDate;
    }
    let bookingButton;
    if (
        (bookingStatus === 'CONFIRMED' || bookingStatus === 'VOUCHERED') &&
        cancellationDeadlineDate
    ) {
        const today = new Date();
        const deadlineDate = new Date(cancellationDeadlineDate);
        const isBeforeDeadline = today.setHours(0, 0, 0, 0) <= deadlineDate.setHours(0, 0, 0, 0);
        bookingButton = (
            <Button
                size="middle"
                onClick={handleSubmit}
                className={`mb-2 mx-2  rounded-sm ${screens.xl ? 'mt-2 w-32' : 'mt-6  w-36'}`}
                disabled={!isBeforeDeadline}
                style={{
                    color: colorPrimary,
                    borderColor: colorPrimary,
                }}
            >
                <Typography.Text data-testid="cancel">Cancel Booking</Typography.Text>
            </Button>
        );
    } else if (bookingStatus === 'Cancel Pending') {
        // Assuming you have a handler for pending status
        bookingButton = (
            <Typography.Text className="font-bold text-bgOrange2">Cancel Pending</Typography.Text>
        );
    } else if (bookingStatus === 'Cancelled') {
        bookingButton = (
            <Typography.Text className="font-bold text-bgOrange2">Cancelled</Typography.Text>
        );
    } else {
        bookingButton = '';
    }
    return (
        <Spin className="w-full" spinning={downloadTicketLoading}>
            <Content className="mt-5  border border-solid border-gray-200 rounded-md">
                <Content className="px-5">
                    <Row gutter={16} className="p-4 bg-white rounded-md">
                        <Col className="gutter-row" xs={8} sm={8} md={6} lg={6} xl={6}>
                            <Image
                                width="100%"
                                height={180}
                                src={
                                    orderResponseObj?.hotelContact?.image !== ''
                                        ? orderResponseObj?.hotelContact?.image
                                        : defaultImage
                                }
                                style={{
                                    borderRadius: ' 0.625rem 0.625rem  0.625rem  0.625rem  ',
                                    objectFit: 'cover',
                                }}
                            />
                        </Col>
                        <Col className="gutter-row mt-5" xs={0} sm={0} md={24} lg={24} xl={14}>
                            <Flex justify="space-between" className="px-4">
                                <Flex vertical>
                                    {/* <Typography.Text
                                    className="mt-1 text-gray-500 font-bold"
                                    style={{ fontSize: '0.6875rem' }}
                                >
                                    Entire home in {res?.name}
                                </Typography.Text> */}

                                    <Typography.Text className="font-medium text-base">
                                        {' '}
                                        {res?.name}
                                    </Typography.Text>
                                </Flex>
                                <Flex>
                                    <Typography.Text className="text-xs mt-2 font-medium">
                                        {nightDifference} Night | {adultCount} Adult | {rooms} Room
                                    </Typography.Text>
                                </Flex>
                            </Flex>

                            <Flex justify="space-evenly" className="px-1">
                                <Flex vertical className="pt-3 items-center">
                                    <Typography.Text
                                        className="mt-1 text-gray-500 font-medium"
                                        style={{ fontSize: '0.6875rem' }}
                                    >
                                        Check In
                                    </Typography.Text>
                                    <Typography.Text
                                        className="mt-1 font-medium"
                                        style={{ fontSize: '0.89rem' }}
                                    >
                                        {res?.checkInDate}
                                    </Typography.Text>
                                    {Info?.checkInTime && (
                                        <Typography.Text
                                            className="mt-1 font-medium"
                                            style={{ fontSize: '0.6875rem' }}
                                        >
                                            {convertToAMPM(Info?.checkInTime)}
                                        </Typography.Text>
                                    )}
                                </Flex>

                                <CheckInDetails night={nightDifference} />

                                <Flex
                                    align="center"
                                    vertical
                                    className="pt-3"
                                    style={{ marginRight: '-0.625rem' }}
                                >
                                    <Typography.Text
                                        className="mt-1 font-medium text-gray-500"
                                        style={{ fontSize: '0.6875rem' }}
                                    >
                                        Check Out
                                    </Typography.Text>
                                    <Typography.Text
                                        className="mt-1 font-medium"
                                        style={{ fontSize: '0.89rem' }}
                                    >
                                        {res?.checkOutDate}
                                    </Typography.Text>
                                    {Info?.checkOutTime && (
                                        <Typography.Text
                                            className="mt-1 font-medium"
                                            style={{ fontSize: '0.6875rem' }}
                                        >
                                            {convertToAMPM(Info?.checkOutTime)}
                                        </Typography.Text>
                                    )}
                                </Flex>
                            </Flex>
                            <Flex vertical className="p-3" align="center">
                                <Flex>
                                    <Typography.Text style={{ fontSize: '0.77rem' }}>
                                        Booking number:
                                    </Typography.Text>
                                    &nbsp;&nbsp;
                                    <Typography.Text
                                        className="font-medium"
                                        style={{ fontSize: '0.77rem' }}
                                    >
                                        {orderResponseObj?.data[0].bookingReferenceId}
                                    </Typography.Text>
                                </Flex>
                                {cancellationDeadlineDate && (
                                    <Flex>
                                        <Typography.Text style={{ fontSize: '0.77rem' }}>
                                            Cancellation deadline date:
                                        </Typography.Text>
                                        &nbsp;&nbsp;
                                        <Typography.Text
                                            className="font-medium"
                                            style={{ fontSize: '0.77rem' }}
                                        >
                                            {cancellationDeadlineDate}
                                        </Typography.Text>
                                    </Flex>
                                )}
                            </Flex>
                        </Col>
                        <Col className="gutter-row" xs={16} sm={16} md={12} lg={12} xl={4}>
                            <Flex
                                justify={screens.xl ? 'center' : 'space-between'}
                                align="center"
                                className="h-full"
                                style={{ marginLeft: '2.960rem' }}
                                vertical={screens.xl}
                            >
                                {bookingStatus === 'CONFIRMED' || bookingStatus === 'VOUCHERED' ? (
                                    <div data-testid="download">
                                        <Button
                                            size="middle"
                                            onClick={handleDownload}
                                            danger
                                            type="primary"
                                            className={`font-medium px-5 mt-6 mx-2 mb-2 ${screens.xl ? ' w-32' : ' w-36'}`}
                                        >
                                            Download
                                        </Button>
                                    </div>
                                ) : (
                                    <></>
                                )}

                                {bookingButton}
                            </Flex>
                        </Col>
                    </Row>

                    <CancelBooking
                        isModalOpen={isModalOpen}
                        handleCancel={handleCancel}
                        cId={cId}
                        BookingId={bookingId}
                        charges={charges}
                        baseAmt={baseAmt}
                        refetch={refetch}
                        isLoading={isLoading}
                    />
                </Content>
            </Content>
        </Spin>
    );
};

export default Manage;
