import React, { useEffect, useState } from 'react';

import { Col, Empty, Flex, Skeleton } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { TrackingTable } from '../components';
import TrackingUpdate from '../components/TrackingUpdate';
import { useTrackShipmentApi } from '../hooks/useTrackShipmentApi';
import { ITrackingDetails } from '../types/tracking';

const TrackShipment = () => {
    const location = useLocation();
    const [trackingDetails, setTrackingDetails] = useState<ITrackingDetails | false>(false);
    const [latestStatus, setLatestStatus] = useState('');
    const { handleTrackShipment } = useTrackShipmentApi();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const trackingNo = searchParams.get('trackingNo');
        handleTrackShipment(trackingNo ?? '').then(result => {
            if (!result) {
                navigate(`/${paths.logistics.index}/${paths.logistics.orderHistory}`);
            } else {
                setTrackingDetails(result);
                if (result.shipmentStatus && result.shipmentStatus.length > 0) {
                    const lastStatus =
                        result.shipmentStatus[result.shipmentStatus.length - 1].Comments;
                    setLatestStatus(lastStatus);
                } else {
                    setLatestStatus('');
                }
            }
        });
    }, [navigate, location.search, handleTrackShipment]);

    return (
        <>
            {trackingDetails ? (
                <Flex vertical gap={20} className="px-0 mb-8">
                    <Flex vertical>
                        <Flex justify="space-between" align="end">
                            <Flex className="text-sm font-medium sm:text-lg ">Order Details</Flex>
                            <Flex>
                                <Flex className="font-normal text-neutral-900 text-4">
                                    Tracking Number:
                                </Flex>
                                <Flex className="font-semibold text-red-500 text-4 ps-1">
                                    {trackingDetails.trackingNo}
                                </Flex>
                            </Flex>
                        </Flex>
                        <TrackingTable
                            data={trackingDetails.orderResponse}
                            amount={trackingDetails.amount}
                            status={
                                Array.isArray(trackingDetails.shipmentStatus) &&
                                trackingDetails.shipmentStatus.length > 0
                                    ? trackingDetails.shipmentStatus[
                                          trackingDetails.shipmentStatus.length - 1
                                      ]?.Comments || ''
                                    : ''
                            }
                        />
                    </Flex>

                    <Flex vertical>
                        <Flex className="text-sm font-medium sm:text-lg mb-12">
                            Shipment Tracking
                        </Flex>
                        <Flex
                            vertical
                            style={{
                                maxHeight: '280px',
                                maxWidth: '700px',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                            }}
                        >
                            {trackingDetails &&
                            trackingDetails.trackingResults &&
                            trackingDetails.trackingResults.length > 0 ? (
                                trackingDetails.trackingResults.map((track, i) => (
                                    <TrackingUpdate
                                        key={i}
                                        date={new Date(
                                            parseInt(
                                                track.UpdateDateTime.match(/\d+/)?.[0] ?? '0',
                                                10
                                            )
                                        )
                                            .toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            })
                                            .replace(/(\d+)\/(\d+)\/(\d+)/, '$2-$1-$3')}
                                        location={track.UpdateLocation}
                                        description={track.UpdateDescription}
                                        comments={track.Comments}
                                        isEnd={i === trackingDetails.trackingResults.length - 1}
                                    />
                                ))
                            ) : (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="No updates"
                                />
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            ) : (
                Array.from({ length: 4 }).map((_, index) => (
                    <Col xs={24} sm={24} md={24} xl={24} key={index}>
                        <Skeleton active avatar className="min-h-48" />
                    </Col>
                ))
            )}
        </>
    );
};

export default TrackShipment;
