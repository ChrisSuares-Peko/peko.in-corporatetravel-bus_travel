import React, { useState } from 'react';

import { Button, Checkbox, Flex, Row, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

import GenericTable from '@components/atomic/GenericTable';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import useDubaiPolicePayment from '../../hooks/dubai-police/useDubaiPolicePayment';
import { DubaiPoliceBalanceResponse, OptionData, Tickets } from '../../types/dubaiPolice';

type Props = {};

const DubaiPoliceTicketsList = (props: Props) => {
    const { state } = useLocation();
    const dispatch = useAppDispatch();
    const { handleSubmission } = useDubaiPolicePayment();
    const [selectedTicket, setSelectedTicket] = useState<OptionData | null>(null);
    const TicketDetails: DubaiPoliceBalanceResponse = state.details as DubaiPoliceBalanceResponse;
    const handleUpdateTicket = (ticket: Tickets, FineSource: string, FineSourceCode: string) => {
        const data = {
            ticketDateField: ticket.ticketDateField, //
            TrafficFileNo: TicketDetails.TrafficFileNo, //
            isPedestrianFine: false,
            ticketData: [
                {
                    FineSource,
                    FineSourceCode,
                    CalculatedFineAmount: ticket.CalculatedFineAMount,
                    TicketNo: ticket.TicketNo,
                    TicketId: ticket.TicketId,
                    TicketFine: ticket.TicketFine,
                    ticketTimeField: ticket.ticketTimeField,
                },
            ],
            SearchInputValues: state?.searchDetails?.SearchInputValues,
            SearchCriteria: state?.searchDetails?.SearchCriteria,
        };
        const ticketId = selectedTicket !== null ? selectedTicket.ticketData[0].TicketId : null;
        if (ticket !== null && ticketId === ticket.TicketId) {
            setSelectedTicket(null);
        }
        if (ticket !== null && ticketId !== ticket.TicketId) {
            setSelectedTicket(data);
        }
    };

    const handlePayment = () => {
        if (selectedTicket === null) {
            return dispatch(
                showToast({
                    description: `Select a ticket`,
                    variant: 'error',
                })
            );
        }

        const postData = {
            account: state?.searchDetails?.account,
            amount: Number(selectedTicket.ticketData[0].CalculatedFineAmount),
            flexiKey: state.flexiKey,
            typeKey: 1,
            optionals: selectedTicket,
            transactionId: state.details.TransactionId,
        };
        return handleSubmission(postData);
    };

    const columns = [
        {
            title: '',
            dataIndex: 'TicketId',
            key: 'TicketId',
            render: (TicketId: any, data: any) => (
                <Checkbox
                    checked={
                        selectedTicket !== null &&
                        selectedTicket.ticketData[0].TicketId === TicketId
                    }
                    onClick={() =>
                        handleUpdateTicket(
                            data,
                            TicketDetails.FineSource,
                            TicketDetails.FineSourceCode
                        )
                    }
                    className=""
                />
            ),
        },
        {
            title: 'Fine source',
            dataIndex: 'TicketId',
            key: 'TicketId',
            render: (TicketId: any, data: any) => (
                <Flex className="" vertical>
                    <Typography.Text className="text-lg font-medium">
                        {TicketDetails.FineSource}
                    </Typography.Text>
                    <Typography.Text className="text-base">{TicketId}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'Ticket Number',
            dataIndex: 'TicketNo',
            key: 'TicketNo',
            render: (TicketNo: any, data: any) => (
                <Typography.Text className="text-base">{TicketNo}</Typography.Text>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'TicketDescription',
            key: 'TicketDescription',
            render: (TicketDescription: any, data: any) => (
                <Typography.Text className="text-base">{TicketDescription}</Typography.Text>
            ),
        },
        {
            title: 'Ticket Date & Time',
            dataIndex: 'ticketTimeField',
            key: 'ticketTimeField',
            render: (TicketDescription: any, data: any) => (
                <Flex vertical className="" align="">
                    <Typography.Text className="text-lg font-medium">
                        {data.ticketTimeField}
                    </Typography.Text>
                    <Typography.Text className="text-base">{data.ticketDateField}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'Fine Amount',
            dataIndex: 'CalculatedFineAMount',
            key: 'CalculatedFineAMount',
            render: (CalculatedFineAMount: any, data: any) => (
                <Typography.Text className="text-lg font-medium">
                    AED {formatNumberWithLocalString(CalculatedFineAMount)}
                </Typography.Text>
            ),
        },
    ];
    return (
        <Row>
            <GenericTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={TicketDetails.Tickets}
                pagination={false}
                className="w-full"
            />
            {/* <Checkbox>Select All</Checkbox> */}
            <Flex className="w-full p-4 border-t 2xl:mr-12" justify="space-between" align="center">
                <Button
                    type="primary"
                    className="w-28"
                    size="small"
                    danger
                    onClick={() => handlePayment()}
                >
                    Pay
                </Button>
                <Typography.Text className="text-xl font-medium">
                    AED {formatNumberWithLocalString(TicketDetails?.TotalAmount)}
                </Typography.Text>
            </Flex>
        </Row>
    );
};

export default DubaiPoliceTicketsList;
