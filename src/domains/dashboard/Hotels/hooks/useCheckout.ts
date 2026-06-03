import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { PaymentPayloadBody } from '@domains/dashboard/Hotels/utils/data';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import useSurchargeDetails from './useSurchargeApi';
import { setPaymentData } from '../../payments/slices/payment';
import { HotelSearch } from '../types/hotelTypes';

export default function useForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const {
        hotelsRequest,
        keyData,
        roomResponse,
        hotelResponse,
        bookingKey,
        reservedData,
        prebookRoomData,
        bookingRoom,
        userdetails,
        netAmount,
    } = useAppSelector(state => state.reducer.hotels);

    const updatedPassengers = userdetails.map((passenger: any) => {
        const matchingRoom = prebookRoomData.find(room => room.roomIndex === passenger.roomIndex);
        if (matchingRoom) {
            return { ...passenger, roomKey: matchingRoom.roomKey };
        }
        return passenger; // Return unchanged if no matching room is found
    });

    const bookArr = prebookRoomData.map(value => ({
        roomKey: value.roomKey,
        roomIndex: value.roomIndex,
        passengers: bookingRoom,
    }));

    const hotelData = hotelResponse as HotelSearch;
    // const [isLoading, setIsLoading] = useState(true);
    const conversation = keyData.conversationId;
    const search = keyData.searchKey;
    const hotel = keyData.hotelKey;
    const total =
        roomResponse?.reduce((totalPrice, roomData) => totalPrice + Number(roomData?.price), 0) ??
        0;

    const client = `PEKO-${new Date().valueOf()}`;

    const { surchargeData } = useSurchargeDetails();
    const totalAmount =
        netAmount + (surchargeData?.surcharge ? parseFloat(surchargeData.surcharge) : 0);

    const handleSubmission = useCallback(async () => {
        const billSummary = [
            {
                key: 'Service name',
                value: 'Hotels',
            },
            {
                key: 'Name',
                value: hotelData.hotelDetails.data[0].name,
            },

            {
                key: 'Amount',
                value: netAmount ?? 0,
            },
        ];

        const paymentSummary = [
            {
                key: 'Platform fee',
                value:
                    new Intl.NumberFormat('en-IN').format(Number(surchargeData?.surcharge) ?? 0) ??
                    0,
            },
        ];
        const date = { checkIn: hotelsRequest.checkIn, checkOut: hotelsRequest.checkOut };

        const requestBody = {
            userId: id,
            userType: role,
            conversationId: conversation,
            hotelKey: hotel,
            searchKey: search,
            clientReference: client,
            amount: netAmount,
            stayDateRange: date,
            bookingKey,
            rooms: updatedPassengers,
            ...PaymentPayloadBody,
            billingEmail:
                updatedPassengers[0].passengers[0].contact.contactProvided[0].emailAddress[0],
            accessKey: accessKeys.hotels,
            currentUrl: window.location.href,
        };

        dispatch(
            setPaymentData({
                billSummary,
                paymentSummary,
                totalAmount,
                title: 'Bill Summary',
                payload: requestBody,
                url: 'travel/hotels/book',
                earningCashbackAmount: Number(surchargeData?.corporateCashback) || 0,
            })
        );

        navigate(paths.dashboard.payments);
    }, [
        hotelData.hotelDetails.data,
        netAmount,
        surchargeData?.surcharge,
        surchargeData?.corporateCashback,
        hotelsRequest.checkIn,
        hotelsRequest.checkOut,
        id,
        role,
        conversation,
        hotel,
        search,
        client,
        bookingKey,
        updatedPassengers,
        dispatch,
        totalAmount,
        navigate,
    ]);

    return { handleSubmission };
}
