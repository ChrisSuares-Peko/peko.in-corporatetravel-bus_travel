export type dubaiPoliceOptional = {
    searchType: string;
    plateNumber?: string;
    plateSource?: string;
    plateCategory?: string;
    plateCode?: string;
    licenseSourceCode?: string;
    licenseFrom?: string;
    licenseNo?: string;
    beneficiaryCode?: string;
    beneficiaryName?: string;
    ticketNumber?: string;
    ticketYear?: string;
    trfNo?: string;
};

export type dubaiPoliceBalancePayload = {
    userId: number;
    userType: string;
    flexiKey: string;
    accountNo: string;
    optional: dubaiPoliceOptional;
};

export type limitResponse = {
    minDenomination: number;
    maxDenomination: number;
    baseCurrency: string;
    planCurrency: string;
    flexiKey: string;
    typeKey: number;
    id: number;
    serviceProvider: string;
    accessKey: string;
    serviceStatus: number;
    providerCommission: string;
    serviceImage: string;
    serviceCategory: string;
    remarks: string | null;
    countryName: string;
    countryCode: number;
    balanceMethod: number;
    commissionType: string;
    serviceType: string;
    isPlanAvailable: number;
    createdAt: string;
    updatedAt: string;
    vendorId: number;
    vendor: {
        apiUrl: string;
        optional1: string;
        optional2: string;
        optional3: string;
        optional4: string;
        optional5: string;
    };
    cashbackType: string;
    cashback: string;
    packageId: number;
    serviceOperatorId: number;
    surcharge: string;
};

export type Tickets = {
    TicketId: string;
    TicketNo: string;
    ticketDateField: string;
    ticketTimeField: string;
    locationDescription: string;
    TicketDescription: string;
    PenaltyFine: string;
    TicketFine: string;
    IsPayable: string;
    PlateNo: string;
    PlateCode: string;
    PlateCategory: string;
    PlateFrom: string;
    LicenseFrom: string;
    LicenseNo: string;
    InsideDubai: string;
    KnowledgeFee: string;
    PlateSourceCode: string;
    CalculatedFineAMount: number;
    LicenseSourceCode: string;
    LicenseSourceDesc: string;
    Regulation: string;
    locationCode: string;
    PaidAmount: number;
    plateCategoryDesc: string;
    plateCodeDescription: string;
    plateSourceDesc: string;
};

export type DubaiPoliceBalanceResponse = {
    BlackPoints: string;
    FineSource: string;
    FineSourceCode: string;
    NoOfTickets: string;
    PedestrianFine: boolean;
    Tickets: Tickets[];
    TotalAmount: string;
    TrafficFileNo: string;
    TransactionId: string;
};
// export type DubaiPoliceBalanceResponse = {
//     ResponseCode: string;
//     ResponseMessage: string;
//     BackPoints: number;
//     TrafficFileNo: number;
//     Pedestrianfine: boolean;
//     BeneficiaryInfo: {
//         ResponseCode: string;
//         BlackPoints: string;
//         FineSource: string;
//         IsAll: string;
//         Code: string;
//         NoOfTickets: string;
//         Tickets: Tickets[];
//         TotalAmount: number;
//     }[];
//     TransactionId: string;
//     surchargeInAED: string;
// };

export type ticketStateData = {
    FineSource: string;
    FineSourceCode: string;
    TicketNo: string;
    TicketId: string;
    ticketDateField: string;
    TicketFine: string;
    ticketTimeField: string;
    TrafficFileNo: number;
    amount: number;
};

export type OptionData = {
    isPedestrianFine: boolean;
    ticketData: {
        FineSource: string;
        FineSourceCode: string;
        CalculatedFineAmount: number;
        TicketNo: string;
        TicketId: string;
        TicketFine: string;
        ticketTimeField: string;
    }[];
};

export type DubaiPolicePaymentPayload = {
    account: string;
    amount: number;
    flexiKey: string;
    typeKey: number;
    optionals: OptionData;
    transactionId: string;
};

// Type for individual PlateCategory
export type PlateCategory = {
    EmiratesCode: string;
    PlateCategoryCode: string;
    PlateCategoryName: string;
};

// Type for individual PlateCode
export type PlateCode = {
    EmiratesCode: string;
    PlateCategory: string;
    PlateCodes: string;
    PlateName: string;
};

// Type for individual PlateSource
export type PlateSource = {
    PlateSourceCode: string;
    PlateSourceName: string;
};

// Type for individual FineSource
export type FineSource = {
    FineSourceCode: string;
    FineSourceName: string;
};

// Type for individual LicenseSource
export type LicenseSource = {
    LicenseSourceCode: string;
    LicenseSourceName: string;
};

// Main type for the data object
export type ListingData = {
    PlateCategories: PlateCategory[];
    PlateCodes: PlateCode[];
    PlateSources: PlateSource[];
    FineSources: FineSource[];
    LicenseSources: LicenseSource[];
};

export type GetListingResponse = {
    data: ListingData;
};
