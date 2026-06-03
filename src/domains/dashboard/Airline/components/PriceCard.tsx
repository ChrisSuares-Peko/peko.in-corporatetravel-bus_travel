import React, { useEffect, useState } from 'react';

import { Button, Col, Divider, Flex, Typography } from 'antd';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { accessKeys } from '@utils/accessKeys';
import { formatNumberWithLocalString, formatNumberWithoutCommas } from '@utils/priceFormat';

import CheckoutTextRow from '../../GiftCards/components/CheckoutTextRow';
import useAncillaryProvBooking from '../hooks/useAncillaryProvBooking';
import { validateSelectedAncillaries } from '../schema/ancValidator';
import { AncillarySearch } from '../types/ancilaryType';
import { AncProvBookSuccessResponse } from '../types/ancProvBookSuccess';
import { ProvBookingSuccess } from '../types/provBooking';

const { Text } = Typography;

type props = {
    formRef: React.MutableRefObject<any>;
    formRef1: React.MutableRefObject<any>;
    showSpinner: (spin: boolean) => void;
    isLcc: boolean;
    handleSubmission: (values: any, bookingDetails: any) => void;
};
interface Totals {
    [key: string]: number;
}

export default function PriceCard({
    formRef,
    formRef1,
    isLcc,
    showSpinner,
    handleSubmission,
}: props) {
    const dispatch = useAppDispatch();
    const { handleAncProvBooking } = useAncillaryProvBooking();
    const [ancillary, setAncillary] = useState<Totals>({});
    const selectedAncillaries = useAppSelector(state => state.reducer.airline.selectedAncillaries);
    const bookingData = useAppSelector(state => state.reducer.airline.bookingData);
    const provBookingData: ProvBookingSuccess = useAppSelector(
        state => state.reducer.airline.provBookingSuccess
    ) as ProvBookingSuccess;

    const airlineData = useAppSelector(state => state.reducer.airline.selectedAirline);
    const airlineFormData = useAppSelector(state => state.reducer.airline.formData);
    const ancillariesData: AncillarySearch = useAppSelector(
        state => state.reducer.airline.ancillariesSearch
    ) as AncillarySearch;

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
        // dispatch(resetFormState());
        handleSubmission(requestBody, bookingDetails);
    };
    const totalGuests =
        airlineFormData.passengerData.adultCount +
        airlineFormData.passengerData.childCount +
        airlineFormData.passengerData.infantCount;

    const handleBookNow = async () => {
        if (!isLcc) {
            formRef.current.forEach((ref: any) => ref.current.handleSubmit());
            formRef1.current.handleSubmit();
        }
        // in case of LCC and anc is required we need to validate selectedAncillaries include
        // all anc detaisl for all passnegers
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { ancillaryRules, baggages, passengers, meals, seatMap } = ancillariesData?.data[0];
        const { status, message } = validateSelectedAncillaries({
            ancillaryRules,
            selectedAncillaries: selectedAncillaries?.selectedAncillaries,
            baggages,
            passengers,
            meals,
            seatMap,
        });
        if (!status) {
            dispatch(showToast({ description: message, variant: 'warning' }));
            return;
        }
        if (isLcc && selectedAncillaries.selectedAncillaries.length > 0) {
            const res: AncProvBookSuccessResponse =
                (await handleAncProvBooking()) as AncProvBookSuccessResponse;
            if (res.meta.success) {
                handleBooking(res);
            }
        } else {
            handleBooking(false);
        }
    };
    const priceWithoutTax = Number(airlineData.price) - Number(airlineData.totalTax);
    const [totals, setTotals] = useState(airlineData.price);
    useEffect(() => {
        // Calculate ancillary
        let total = airlineData.price;
        const calculatedTotals = selectedAncillaries.selectedAncillaries.reduce<Totals>(
            (acc, ancillaryData) => {
                const { ancType, itemPrice } = ancillaryData;
                if (!acc[ancType]) {
                    acc[ancType] = 0;
                }
                acc[ancType] += itemPrice;
                total += itemPrice;
                return acc;
            },
            {}
        );
        // Set ancillary to state
        setTotals(total);
        setAncillary(calculatedTotals);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAncillaries]);
    return (
        <Col xl={6} className="flex flex-col gap-5 justify-between w-full mx-0">
            <Flex
                vertical
                className="p-6 mt-5 border justify-between border-gray-200 rounded md:mt-0"
            >
                <Typography.Title level={5}>Total Amount</Typography.Title>
                <Flex vertical className="mt-4 " gap={15}>
                    <Flex className="w-full justify-between items-center whitespace-nowrap">
                        <Text className="text-gray-500 text-[12px] font-normal">
                            {`Base fare (${totalGuests} traveller)`}
                        </Text>
                        <Text className="text-[12px] text-zinc-900 font-semibold">
                            AED {formatNumberWithLocalString(priceWithoutTax)}
                        </Text>
                    </Flex>

                    {ancillary?.seat && (
                        <CheckoutTextRow text="Seat" value={ancillary?.seat || ''} />
                    )}

                    {ancillary?.meal && (
                        <CheckoutTextRow text="Meal" value={ancillary?.meal || ''} />
                    )}

                    {ancillary?.baggage && <CheckoutTextRow text="Baggage" value={11} />}

                    <Flex className="w-full justify-between">
                        <Text className="text-gray-500 text-[13px] font-normal">
                            {`Taxes and fees`}{' '}
                        </Text>
                        <Text className="text-[14px]  text-zinc-900 font-semibold">
                            AED {formatNumberWithLocalString(airlineData.totalTax)}{' '}
                        </Text>
                    </Flex>

                    <Divider className="m-0" />

                    <CheckoutTextRow text="Total" value={totals} bold />
                    <Button
                        danger
                        type="primary"
                        className="w-full h-10 px-5 font-medium "
                        onClick={async () => {
                            handleBookNow();
                        }}
                        // Disable button when loading
                        // loading={loading}
                    >
                        Continue
                    </Button>
                </Flex>
            </Flex>
        </Col>
    );
}
