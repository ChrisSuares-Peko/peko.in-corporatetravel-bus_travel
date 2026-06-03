import { useCallback, useEffect, useState } from 'react';

import { useAppSelector, useAppDispatch } from '@src/hooks/store';

import { getBookingsList } from '../api';
import { resetSelectedOrderDetails } from '../slices/airlineSlice';
import { Booking } from '../types/Booking';
import { IBookingRes, IOrderResponse } from '../types/manageBookings';

export const useManageBookingListAPI = (
    currentPage: number,
    availability: string,
    reload: boolean
) => {
    const dispatch = useAppDispatch();
    const { role, id } = useAppSelector((state: { reducer: { auth: any } }) => state.reducer.auth);
    const [bookingData, setBookingData] = useState<Booking[]>();
    const [pageData, setPageData] = useState({
        page: 0,
        limit: 0,
        count: 0,
    });
    const [isLoading, setIsLoading] = useState(false);

    const getBookingsListHandler = useCallback(
        async (page: number) => {
            setIsLoading(true);
            const data: IBookingRes | false = await getBookingsList({
                userId: id,
                userType: role,
                page,
                availability,
            });
            if (data) {
                setPageData({
                    page: data.page,
                    limit: data.limit,
                    count: data.count,
                });
                const arr = data?.bookings;
                const res: Booking[] = [];
                arr.forEach(async item => {
                    if (item.orderResponse === '') {
                        return;
                    }

                    const bookings: IOrderResponse = JSON.parse(item.orderResponse);
                    const bookingDat = {
                        id: item.id,
                        corporateTxnId: item.corporateTxnId,
                        conversationId: bookings.meta.conversationId,
                        ...bookings.data.map(ele => ({
                            logo: `https://res.cloudinary.com/dqhshqcqd/image/upload/v1710764763/Airline/${bookings.data[0].ticketDocument[0].airlineLocators[0].airline}.png`,
                            flightName: '',
                            bookingCode:
                                bookings.data[0].ticketDocument[0].airlineLocators[0]
                                    .airlineLocator,
                            bookingReferenceId: ele.bookingReferenceId,
                            ConfimationNumber: ele.bookingReferenceId,
                            flightClass: ele?.journey[0]?.flightSegments[0].cabinClass,
                            flightDuration: ele?.journey[0]?.flightSegments[0].duration,
                            stopCount: ele?.journey[0]?.flight.stopQuantity,
                            status: ele?.bookingStatus,
                            depart: {
                                datetime: ele?.journey[0]?.flightSegments[0]?.departureDateTime,
                                terminal: ele?.journey[0]?.flightSegments[0]?.departureTerminal,
                                airport: ele?.journey[0]?.flightSegments[0]?.departureAirportCode,
                            },
                            arrive: {
                                datetime: ele?.journey[0]?.flightSegments[0]?.arrivalDateTime,
                                airport: ele?.journey[0]?.flightSegments[0]?.arrivalAirportCode,
                                terminal: ele?.journey[0]?.flightSegments[0]?.arrivalTerminal,
                            },
                            ecomOrderStatus: item?.ecomOrderStatus,
                        }))[0],
                    };
                    res.push(bookingDat);
                });

                setBookingData(res);
                dispatch(resetSelectedOrderDetails()); // clear selected
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        },
        [availability, id, role, dispatch]
    );

    useEffect(() => {
        getBookingsListHandler(currentPage);
    }, [currentPage, getBookingsListHandler, reload]);

    return { data: bookingData, pageData, isLoading, getBookingsListHandler };
};
