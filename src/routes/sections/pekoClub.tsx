import { lazy } from 'react';

import { paths } from '../paths';

const Pekoclub = lazy(() => import('@src/domains/dashboard/pekoclub/Pages/HomePage'));
const Events = lazy(() => import('@src/domains/dashboard/pekoclub/Pages/Events'));
const News = lazy(() => import('@src/domains/dashboard/pekoclub/Pages/News'));
const Details = lazy(() => import('@src/domains/dashboard/pekoclub/Pages/Details'));
const EventDetails = lazy(() => import('@src/domains/dashboard/pekoclub/Pages/EventDetails'));
// -----------------------------------------------------------------------

export const pekoClubRoutes = [
    { element: <Pekoclub />, index: true },
    {
        element: <Events />,
        path: paths.pekoClub.events,
    },
    {
        element: <News />,
        path: paths.pekoClub.news,
    },
    {
        element: <Details />,
        path: paths.pekoClub.newsDetails,
    },
    {
        element: <EventDetails />,
        path: paths.pekoClub.eventDetails,
    },
];
