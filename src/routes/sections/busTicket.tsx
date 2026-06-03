import { lazy } from 'react';

const BusTicketSearch = lazy(
    () => import('@domains/dashboard/CorporateTravel/BusTicket/pages/BusTicketSearch')
);
const BusTicketSearching = lazy(
    () => import('@domains/dashboard/CorporateTravel/BusTicket/pages/BusTicketSearching')
);
const BusTicketResults = lazy(
    () => import('@domains/dashboard/CorporateTravel/BusTicket/pages/BusTicketResults')
);
const BusTicketSeatSelection = lazy(
    () => import('@domains/dashboard/CorporateTravel/BusTicket/pages/BusTicketSeatSelection')
);
const BusTicketBoarding = lazy(
    () => import('@domains/dashboard/CorporateTravel/BusTicket/pages/BusTicketBoarding')
);
const BusTicketTraveller = lazy(
    () => import('@domains/dashboard/CorporateTravel/BusTicket/pages/BusTicketTraveller')
);
const BusTicketReview = lazy(
    () => import('@domains/dashboard/CorporateTravel/BusTicket/pages/BusTicketReview')
);
const BusTicketPayment = lazy(
    () => import('@domains/dashboard/CorporateTravel/BusTicket/pages/BusTicketPayment')
);

export const busTicketRoutes = [
    { index: true,         element: <BusTicketSearch /> },
    { path: 'searching',   element: <BusTicketSearching /> },
    { path: 'results',     element: <BusTicketResults /> },
    { path: 'seats',       element: <BusTicketSeatSelection /> },
    { path: 'boarding',    element: <BusTicketBoarding /> },
    { path: 'traveller',   element: <BusTicketTraveller /> },
    { path: 'review',      element: <BusTicketReview /> },
    { path: 'payment',     element: <BusTicketPayment /> },
];
