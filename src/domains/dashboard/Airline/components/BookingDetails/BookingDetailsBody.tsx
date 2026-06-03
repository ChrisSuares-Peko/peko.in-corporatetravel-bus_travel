import type { FC } from 'react';

import { Flex } from 'antd';

import DetailsBody from './DetailsBody';
import PassengerInfo from './PassengerInfo';

interface BookingDetailsBodyProps {}
const samplePassengers = [
    {
        name: 'John Doe',
        pnr: 'G13BSZZ',
        passportNumber: '231454422',
        ticketNumber: '202105-375152',
        seat: 'A2',
        email: 'jinto123@gmail.com',
    },
    {
        name: 'John Doe',
        pnr: 'G13BSZZ',
        passportNumber: '231454422',
        ticketNumber: '202105-375152',
        seat: 'A2',
        email: 'john123@gmail.com',
    },
    {
        name: 'Doe John',
        pnr: 'G13BSZZ',
        passportNumber: '231454422',
        ticketNumber: '202105-375152',
        seat: 'A2',
        email: 'jinto123@gmail.com',
    },
];
const BookingDetailsBody: FC<BookingDetailsBodyProps> = () => {
    console.log('');
    return (
        <Flex vertical gap={40}>
            <DetailsBody />
            <PassengerInfo />
        </Flex>
    );
};

export default BookingDetailsBody;
