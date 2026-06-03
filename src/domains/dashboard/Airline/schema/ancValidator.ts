const isAncillaryRequired = (ancillaries: any[], ancillaryType: string) => {
    const ancType = ancillaryType.toUpperCase();
    // Find the ancillary item that matches the given type
    const ancillary = ancillaries.find(
        (item: { ancillaryType: any }) => item.ancillaryType === ancType
    );
    // Check if the ancillary exists and its minimum quantity is greater than 0
    return (
        ancillary?.ancillaryQuantity.some((quantity: { min: number }) => quantity.min > 0) || false
    );
};

type ValidateSelectedAncillariesProps = {
    ancillaryRules: any[];
    selectedAncillaries: any[];
    passengers: any[];
    meals: any[];
    baggages: any[];
    seatMap: any[];
};

type ValidateResponse = {
    status: boolean;
    message: string;
};

export const validateSelectedAncillaries = ({
    ancillaryRules,
    selectedAncillaries,
    passengers,
    meals,
    baggages,
    seatMap,
}: ValidateSelectedAncillariesProps) => {
    const validateAncillary = (
        ancillaryType: string,
        ancillaries: any
    ): ValidateResponse | undefined => {
        if (ancillaries && isAncillaryRequired(ancillaryRules, ancillaryType)) {
            let segmentKeys;
            if (ancillaryType === 'seat') {
                segmentKeys = Array.from(
                    new Set(
                        ancillaries.flatMap((seat: { cabin: any[] }) =>
                            seat.cabin.flatMap(
                                (cabin: { segmentPassengerMapping: { segmentKeys: any } }) =>
                                    cabin.segmentPassengerMapping.segmentKeys
                            )
                        )
                    )
                );
            } else {
                segmentKeys = Array.from(
                    new Set(
                        ancillaries.flatMap(
                            (ancillary: { segmentPassengerMapping: { segmentKeys: any } }) =>
                                ancillary.segmentPassengerMapping.segmentKeys
                        )
                    )
                );
            }
            // eslint-disable-next-line no-restricted-syntax
            for (const passenger of passengers) {
                const { passengerKey, ptc } = passenger;
                if (ptc !== 'INF') {
                    // eslint-disable-next-line no-restricted-syntax
                    for (const segmentKey of segmentKeys) {
                        const matchingAncillary = selectedAncillaries.find(
                            (ancillary: { segmentKey: unknown; passengerKey: any; ancType: any }) =>
                                ancillary.segmentKey === segmentKey &&
                                ancillary.passengerKey === passengerKey &&
                                ancillary.ancType === ancillaryType
                        );
                        if (!matchingAncillary) {
                            return {
                                status: false,
                                message: `Please select ${ancillaryType}s for all passengers`,
                            };
                        }
                    }
                }
            }
        }
        return undefined;
    };
    const seatValidation = validateAncillary('seat', seatMap);
    if (seatValidation) return seatValidation;

    const mealValidation = validateAncillary('meal', meals);
    if (mealValidation) return mealValidation;

    const baggageValidation = validateAncillary('baggage', baggages);
    if (baggageValidation) return baggageValidation;

    return { status: true, message: 'Success' };
};
