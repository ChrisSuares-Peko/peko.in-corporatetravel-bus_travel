import React from 'react';

import { Row } from 'antd';

import { useAppSelector } from '@src/hooks/store';
import { accessKeys } from '@utils/accessKeys';
import { formatNumberWithoutCommas } from '@utils/priceFormat';

import PriceFooter from '../components/adaptive/PriceFooter';
import Ancillaries from '../components/Ancillaries';
import useAncillaryProvBooking from '../hooks/useAncillaryProvBooking';
import { AncProvBookSuccessResponse } from '../types/ancProvBookSuccess';
import { ProvBookingSuccess } from '../types/provBooking';

type Props = {
    handlePrevClick: () => void;
    handleClick: () => void;
    handleSubmission: (values: any, bookingDetails: any) => void;
};

const SeatSelectionPage = ({ handlePrevClick, handleClick, handleSubmission }: Props) => {
    const { handleAncProvBooking } = useAncillaryProvBooking();
    const selectedAirlineData = useAppSelector(state => state.reducer.airline.selectedAirline);
    const selectedAncillaries = useAppSelector(state => state.reducer.airline.selectedAncillaries);
    const bookingData = useAppSelector(state => state.reducer.airline.bookingData);
    const provBookingData: ProvBookingSuccess = useAppSelector(
        state => state.reducer.airline.provBookingSuccess
    ) as ProvBookingSuccess;

    const handleBooking = (res: any) => {
        let ancAmount = 0;
        if (res && res?.data) {
            ancAmount = res.data.reduce(
                (sum: any, item: { fare: { buyingAmount: any } }) => sum + item.fare.buyingAmount,
                0
            );
            ancAmount = parseFloat(formatNumberWithoutCommas(ancAmount));
        }

        const requestBody = {
            offerId: provBookingData.data[0].offerId,
            conversationId: provBookingData.conversationId,
            fare: provBookingData.data[0].fare.totalFare,
            totalAncillaryPrice: ancAmount,
            ancillaryDetails: selectedAncillaries,
            passengers: bookingData.passengers,
            isLcc: provBookingData.data[0].detail.lcc,
            customerInfo: {
                emailAddress: bookingData.customerInfo.emailAddress,
            },
            amount: parseFloat(
                formatNumberWithoutCommas(provBookingData.data[0].fare.totalFare + ancAmount)
            ),
            currencyCode: 'AED',
            accessKey: accessKeys.airline,
            currentUrl: window.location.href,
        };
        const bookingDetails = {
            amount: provBookingData.data[0].fare.totalFare + ancAmount,
            tax: provBookingData.data[0].fare.totalTax,
        };

        handleSubmission(requestBody, bookingDetails);
    };

    const handleAncillaryProvBooking = async () => {
        if (selectedAncillaries.selectedAncillaries.length > 0) {
            const res: AncProvBookSuccessResponse =
                (await handleAncProvBooking()) as AncProvBookSuccessResponse;
            if (res.meta.success) {
                handleBooking(res);
            }
        }
    };
    return (
        <Row className="w-full">
            <Ancillaries />
            <PriceFooter
                price={selectedAirlineData.price ?? 0}
                handleClick={() => handleAncillaryProvBooking()}
            />
        </Row>
    );
};

export default SeatSelectionPage;
