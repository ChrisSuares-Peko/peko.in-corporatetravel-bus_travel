export type APIPayload = {
    userType: string;
    userId: number;
};

export type SearchAirportPayload = APIPayload & {
    loc: string;
};
export type GetBookingsListPayload = APIPayload & {
    page: number;
    availability: string;
};
export type GetBookingDetailsPayload = APIPayload & {
    corporateTxnId: number | string;
};
export type DownloadTicketPayload = APIPayload & {
    orderId: number | string;
};

export type IAncSearchPostData = {
    offerId: string;
    conversationId: string;
    supplierLocator: string | null;
    isLcc: boolean;
};

export type IAncSearchPayload = APIPayload & {
    postData: {
        offerId: string;
        conversationId: string;
        supplierLocator: string | null;
        isLcc: boolean;
    };
};

export type IAncProvBookPayload = {
    userId: number;
    userType: string;
    postData: {
        selectedAncillaries: Array<{
            ancType?: string;
            ancillaryOfferId: string;
            passengerKey: string;
            segmentKey: string;
        }>;
        conversationId: string;
        isLcc: boolean;
        offerId: string;
    };
};
export type otpPayload = {
    userId: number;
    userType: string;
    scope: string;
};

export type IAncCancellationPostData = {
    bookingReferenceId: string;
    conversationId: string;
    selectedCorporateTxnId: string;
    reasonForCancellation: string;
    otp?: string;
    scope?: string;
};

export type IAncCancellationPayload = APIPayload & {
    postData: {
        bookingReferenceId: string;
        conversationId: string;
        selectedCorporateTxnId: string;
        otp?: string;
        scope?: string;
    };
};
