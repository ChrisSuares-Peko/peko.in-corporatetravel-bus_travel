import type { FC } from 'react';

import { Card, Col, Typography } from 'antd';

import { useAppSelector } from '@src/hooks/store';

import { PassengerType } from '../../types/passenger';

interface PassengerProps {
    passenger: PassengerType;
    index: number;
}

const Passenger: FC<PassengerProps> = ({ passenger, index }) => {
    const {
        passengerInfo,
        passengerKey,
        identityDocuments,
        contact: { contactsProvided },
    } = passenger;
    const { orderResponse } = useAppSelector(state => state.reducer.airline.orderDetails);
    const orderDetails = useAppSelector(state => state.reducer.airline.orderDetails);
    const { ticketDocument } = orderResponse.data[0];
    console.log({ passenger, ticketDocument, orderResponse });
    const ticketDoc = ticketDocument.find(
        (doc: { passengerKey: string }) => doc.passengerKey === passengerKey
    );

    return (
        <Col key={index} xs={24} sm={24} md={12} lg={8} xl={8}>
            <Card
                title={`Passenger ${index + 1}`}
                bordered={false}
                style={{ background: '#F0F0F0' }}
            >
                <Typography.Text strong>Name: </Typography.Text>
                <Typography.Text>{`${passengerInfo.givenName} ${passengerInfo.surname}`}</Typography.Text>
                <br />
                <Typography.Text strong>Airline PNR: </Typography.Text>
                <Typography.Text>
                    {ticketDoc.airlineLocators[0]?.airlineLocator || ''}
                </Typography.Text>
                <br />
                {identityDocuments && identityDocuments[0]?.idType === 'PT' && (
                    <>
                        <Typography.Text strong>Passport Number: </Typography.Text>
                        <Typography.Text>{identityDocuments[0].idDocumentNumber}</Typography.Text>
                        <br />
                    </>
                )}

                <Typography.Text strong>Ticket Number: </Typography.Text>
                <Typography.Text>{ticketDoc.ticketDocNbr || ''}</Typography.Text>
                <br />
                {/* <Typography.Text strong>Seat: </Typography.Text>
                <Typography.Text>{passenger.seat}</Typography.Text>
                <br /> */}
                {contactsProvided && contactsProvided[0].emailAddress[0] && (
                    <>
                        <Typography.Text strong>Email: </Typography.Text>
                        <Typography.Text>{contactsProvided[0].emailAddress[0]}</Typography.Text>
                    </>
                )}
            </Card>
        </Col>
    );
};

export default Passenger;
