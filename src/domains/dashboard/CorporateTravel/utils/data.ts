import { paths } from '@src/routes/paths';

import BookAHotel from '../assets/icons/BookAHotel.svg';
import BookAirTicket from '../assets/icons/BookAirTicket.svg';

export const travelServices = [
    {
        icon: BookAirTicket,
        title: 'Book Air Ticket',
        status: '',
        path: 'airline',
    },
    {
        icon: BookAHotel,
        title: 'Book A Hotel',
        status: '',
        path: 'hotels',
    },
    {
        icon: BookAHotel,
        title: 'Book An eSIM',
        status: '',
        path: 'esim',
    },
];

export const links = [
    '',
    `${paths.airline.index}/${paths.airline.manage}`,
    `${paths.hotels.index}/${paths.hotels.manageBookings}`,
    paths.esim.orders,
];
