import { useState } from 'react';

import { Button, Col, Flex, Image, Row, Typography, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { saveAs } from 'file-saver';
import { ReactSVG } from 'react-svg';

import hotel1 from '@domains/dashboard/Hotels/Assets/hotel1.png';
import starIcon from '@domains/dashboard/Hotels/Assets/icons/Star 11.svg';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import CancelBooking from './CancelBooking';
import useCancellationApi from '../../hooks/useCancellationApi';
import DateFields from '../../hooks/useDateField';
import useTicketDownloadApi from '../../hooks/useDownloadTicketApi';
import { getTxnId } from '../../slices/getHotelSlice';
import { cancelArray } from '../../types/types';

interface booked {
    orderId?: number;
    details: string | undefined;
    txnId: string;
    baseAmt: number;
    refetch?: any;
}
const RecentlyBookedSm = ({ orderId, details, txnId, baseAmt, refetch }: booked) => {
    const [downloadTicketLoading, setDownloadedTicketLoading] = useState(false);
    const dispatch = useAppDispatch();

    const {
        token: { colorPrimary },
    } = theme.useToken();

    const [charges, setCharges] = useState<cancelArray[]>([]);
    const { showModal, isModalOpen, handleCancel } = DateFields();

    let orderResponseObj;
    if (details) {
        try {
            orderResponseObj = JSON.parse(details);
        } catch (error) {
            // console.error('Error parsing details:', error);
        }
    }
    const cId = orderResponseObj?.meta?.conversationId;
    const bookingId = orderResponseObj?.data[0].bookingReferenceId;
    const { download } = useTicketDownloadApi();
    const { cancellation, isLoading } = useCancellationApi();
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

    let address = orderResponseObj?.hotelContact?.address;
    address = address?.split(',')[0];
    const res = orderResponseObj?.data[0]?.hotel;
    let amount: string | number = 'N/A';
    if (typeof baseAmt === 'number') {
        amount = baseAmt.toFixed(2);
    } else if (typeof baseAmt === 'string') {
        const numericValue = parseFloat(baseAmt);
        if (!Number.isNaN(numericValue)) {
            amount = numericValue.toFixed(2);
        } else {
            // console.error('Invalid numeric string:', baseAmt);
        }
    }
    let bookingButton;
    if (orderResponseObj?.data[0].bookingStatus === 'CONFIRMED') {
        bookingButton = (
            <Button
                size="middle"
                onClick={handleSubmit}
                className="px-5 w-36  rounded-sm m-3"
                style={{
                    color: colorPrimary,
                    borderColor: colorPrimary,
                }}
            >
                Cancel Booking
            </Button>
        );
    } else if (orderResponseObj?.data[0].bookingStatus === 'Cancel Pending') {
        // Assuming you have a handler for pending status
        bookingButton = (
            <Typography.Text className="font-bold text-bgOrange2 mx-auto">
                Cancel Pending
            </Typography.Text>
        );
    } else {
        bookingButton = (
            <Typography.Text className="font-bold text-bgOrange2 mx-auto">
                Cancelled
            </Typography.Text>
        );
    }
    return (
        <Content className="w-full border border-solid border-gray-200 rounded-md bg-bgLightGray">
            <Row gutter={12}>
                <Col span={8} style={{ padding: '0.7rem' }}>
                    <Image
                        className="mt-1 ml-1"
                        width="100%"
                        height={80}
                        src={hotel1}
                        style={{ objectFit: 'cover' }}
                    />
                </Col>
                <Col span={12} className="mt-3">
                    <Flex vertical>
                        <Typography.Text className="font-bold mt-2">{res?.name}</Typography.Text>
                        <Typography.Text className="text-xs pt-2">{address}</Typography.Text>
                        <Flex gap="" className="">
                            <ReactSVG className="mt-1" src={starIcon} />
                            <Typography.Text className="text-xs mt-1 font-bold ml-1">
                                5.0
                            </Typography.Text>
                            <Typography.Text className="text-xs mt-1 font-bold text-gray-400 ml-1">
                                ({3} Reviews)
                            </Typography.Text>
                        </Flex>
                    </Flex>
                </Col>
                <Col>
                    <Flex vertical className="mt-7">
                        <Typography.Text className="font-bold text-red-500">AED</Typography.Text>
                        <Typography.Text className="font-bold   text-red-500">
                            {amount}
                        </Typography.Text>
                        <Typography.Text style={{ fontSize: '0.57rem' }}>/night</Typography.Text>
                        {/* <ReactSVG className="mt-1 ml-1" src={saveIcon} /> */}
                    </Flex>
                </Col>
            </Row>
            <Col className="gutter-row" xs={16} sm={16} md={12} lg={12} xl={4}>
                <Flex align="center" className="h-full" style={{ marginLeft: '2.960rem' }}>
                    {orderResponseObj?.data[0].bookingStatus === 'CONFIRMED' ? (
                        <Button
                            size="middle"
                            onClick={handleDownload}
                            danger
                            type="primary"
                            className="w-36 font-medium px-5 m-3"
                            loading={downloadTicketLoading}
                        >
                            Download
                        </Button>
                    ) : (
                        ''
                    )}

                    {bookingButton}
                </Flex>
            </Col>
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
    );
};

export default RecentlyBookedSm;
