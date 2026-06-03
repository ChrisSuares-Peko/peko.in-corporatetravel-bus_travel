import React from 'react';

import { Flex, Table } from 'antd';
import type { TableProps } from 'antd';

import { DataType } from '../types';

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Sender',
        dataIndex: 'shipper',
        key: 'shipper',
        render: shipper => (
            <Flex vertical>
                <Flex className="h-5 text-sm font-semibold capitalize line-clamp-1">
                    {shipper.Line1}
                </Flex>
                <Flex className="h-5 line-clamp-1">{shipper.City}</Flex>
                <Flex className="h-5 text-xs line-clamp-1">{shipper.Line2}</Flex>
                <Flex className="h-8 text-xs line-clamp-2">{shipper.Line3}</Flex>
            </Flex>
        ),
        width: '15%',
    },
    {
        title: 'Receiver',
        dataIndex: 'receiver',
        key: 'receiver',
        render: receiver => (
            <Flex vertical>
                <Flex className="h-5 text-sm font-semibold capitalize line-clamp-1">
                    {receiver.Line1}
                </Flex>
                <Flex className="h-5 line-clamp-1">{receiver.City}</Flex>
                <Flex className="h-5 text-xs line-clamp-1">{receiver.Line2}</Flex>
                <Flex className="h-8 text-xs line-clamp-2">{receiver.Line3}</Flex>
            </Flex>
        ),
        width: '15%',
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: type => <Flex className="text-sm text-neutral-600">{type}</Flex>,
        width: '15%',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        render: quantity => <Flex className="text-sm text-neutral-600">{quantity}</Flex>,
        width: '10%',
    },
    {
        title: 'Total Amount',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        render: totalAmount => (
            <Flex className="text-sm text-neutral-600">
                AED {parseFloat(totalAmount).toFixed(2)}
            </Flex>
        ),
        width: '15%',
    },
    // {
    //     title: 'ACTION',
    //     key: 'action',
    //     render: (_, record) => (
    //         // here we will show download booking only if the latest status is completed
    //         <Flex vertical gap={10}>
    //             {record.status === 'completed' && (
    //                 <Flex className="text-sm text-red-500 ">Download Invoice</Flex>
    //             )}
    //             <Flex className="text-sm text-red-700">Request for Booking Cancellation</Flex>
    //         </Flex>
    //     ),
    //     width: '20%',
    // },
];

interface TrackingTableProps {
    data: string;
    amount: string;
    status: string;
}

const TrackingTable: React.FC<TrackingTableProps> = ({ data, amount, status }) => {
    const trackingTableData = JSON.parse(data);
    const trackingData: DataType[] = [
        {
            key: trackingTableData?.ProcessedPickup.ProcessedShipments[0].ID,
            trackingNo: trackingTableData?.ProcessedPickup.ProcessedShipments[0].ID,
            shipper: {
                Line1: trackingTableData?.shipmentDetails.PickupAddress.Line1,
                City: trackingTableData?.shipmentDetails.PickupAddress.City,
                Line2: trackingTableData?.shipmentDetails.PickupAddress.Line2,
                Line3: trackingTableData?.shipmentDetails.PickupAddress.Line3,
            },
            receiver: {
                Line1: trackingTableData?.shipmentDetails.Shipments[0].Consignee.PartyAddress.Line1,
                City: trackingTableData?.shipmentDetails.Shipments[0].Consignee.PartyAddress.City,
                Line2: trackingTableData?.shipmentDetails.Shipments[0].Consignee.PartyAddress.Line2,
                Line3: trackingTableData?.shipmentDetails.Shipments[0].Consignee.PartyAddress.Line3,
            },
            type: trackingTableData?.shipmentDetails?.Shipments[0]?.Details.Items[0].Comments,
            quantity:
                trackingTableData?.ProcessedPickup?.ProcessedShipments[0]?.ShipmentDetails
                    .NumberOfPieces,
            totalAmount: amount,
            status,
        },
    ];

    return (
        <Table
            style={{ overflow: 'auto' }}
            className="my-8"
            pagination={false}
            columns={columns}
            dataSource={trackingData}
        />
    );
};

export default TrackingTable;
