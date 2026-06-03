export type getSearchListPayload = {
    userId: number;
    userType: string;
    country: string | undefined;
    city: string | undefined;
    checkIn: string;
    checkOut: string;
    // originCountry: string;
    rooms: RoomInfo[];
};
export type countrySearchPayload = {
    userId: number;
    userType: string;
    searchText: string;
};

export type searchListResponse = {
    data: searchList;
};

export type searchList = {
    conversationId: string;
    meta: {
        success: boolean;
        statusCode: number;
        statusMessage: string;
        actionType: string;
        conversationId: string;
    };
    commonData: {
        searchKey: string;
        culture: string;
    };
    data: Hotels[];
};

export type Hotels = {
    hotelKey: string;
    propertyInfo: PropertyInfo;
    rooms: Room[];
};

export type PropertyInfo = {
    hotelName: string;
    address: string;
    phoneNumber: string;
    location: string;
    latitude: string;
    longitude: string;
    imageUrl: string;
    facilities: string[]; // Assuming facilities are strings, modify as needed
    propertyType: string;
    starRating: string;
};

export type Room = {
    roomIndex: number;
    roomKey: string;
    roomId: string;
    roomTypeDesc: string;
    maxOccupancy: number;
    ratePlan: RatePlan;
    roomRate: RoomRate;
    rateNotes: string;
    financialInfo: FinancialInfo;
};
export type FinancialInfo = {
    supplier: string;
    payment: {
        paymentTypes: string[];
    };
};
export type RatePlan = {
    supplierCode: string;
    meal: string;
    availableStatus: string;
    cancelPolicyIndicator: string;
    code: string;
    isPackage: boolean;
    fixedCombo: boolean;
    gstAssured: boolean;
};
export type RoomRate = {
    currency: string;
    netAmount: number;
    rates: Rate[];
};
export type Rate = {
    name: string;
    amount: number;
    from: string;
    rateIndex: string;
    to: string;
};

// export type countries = {
//     cityName: string;
//     countryName: string;
// };
export type country = {
    label: string;
    value: string;
};
export type CityData = {
    cities: City[];
};

export type City = {
    cityName: string;
    countryName: string;
    id: number;
};

export type hotelListData = {
    hotelKey: string;
    hotelName: string;
    address: string;
    phoneNumber: string;
    hotelImage: string;
    hotelRating: string;
}[];

export type RoomInfo = {
    adult: number;
    child: number;
    roomIndex: number;
    childAge: number[] | [];
};

export type prebookHotelsResponse = {
    userId: number;
    userType: string;
    rooms: roomData[];
    hotelKey: string;
    searchKey: string;
    conversationId: string;
};

export type roomData = {
    roomIndex: number;
    roomKey: string;
};

export type bookings = {
    userId: number;
    userType: string;
    currentPage: number;
};
export type ticket = {
    userId: number;
    userType: string;
    orderId: number;
};

export type cancelBooking = {
    userId: number;
    userType: string;
    bookingReferenceId: string;
    conversationId: string;
    selectedCorporateTxnId: string;
    otp: string;
    scope: string;
};
export type cancellation = {
    userId: number;
    userType: string;
    bookingReferenceId: string;
    conversationId: string;
};
export type cancellationData = {
    conversationId: string;
    meta: {
        success: boolean;
        statusCode: number;
        statusMessage: string;
        actionType: string;
        conversationId: string;
    };
    commonData: {
        productCode: string;
        culture: string;
    };
    data: cancelArray[];
    version: string;
};
export type cancelArray = {
    bookingStatus: string;
    bookingReferenceId: string;
    command: string;
    currency: string;
    cancellationCharge: [
        {
            supplierCancellationCharge: number;
            totalCancellationCharges: number;
            adminCancellationCharge: number;
        },
    ];
};

export type HotelBookCancelResponse = {
    data: {
        conversationId: string;
        meta: {
            success: boolean;
            statusCode: number;
            statusMessage: string;
            actionType: string;
            conversationId: string;
        };
        commonData: {
            productCode: string;
            culture: string;
        };
        data: {
            bookingStatus: string;
            bookingReferenceId: string;
            command: string;
        }[];
        version: string;
    };
};
