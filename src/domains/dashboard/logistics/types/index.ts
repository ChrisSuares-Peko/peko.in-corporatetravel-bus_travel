export interface RequestPayload {
    userId: number;
    userType: string;
}
export interface DataType {
    key: number;
    trackingNo: string | number;
    shipper: {
        Line1: string;
        Line2: string;
        Line3: string;
        City: string;
    };
    receiver: {
        Line1: string;
        Line2: string;
        Line3: string;
        City: string;
    };
    type: string;
    quantity: number;
    totalAmount: number | string;
    status?: string;
}

export type logisticsCountryListing = {
    userId: number;
    userType: string;
    searchText: string;
};

export type ICountryListing = {
    name: string;
    alpha2Code: string;
};

export type ICountryListingResponse = {
    countries: ICountryListing[];
};

export type commonSelectType = {
    oName: string;
    oValue: string;
};

export type defaultSelectType = {
    label: string;
    value: string;
};

export type logisticsCityListing = {
    userId: number;
    userType: string;
    searchText: string;
    countryCode: string;
};

export type ICityListingResponse = {
    Cities: string[];
};

export type logisticsServiceTypeListing = {
    userId: number;
    userType: string;
    itemType: string;
    shipmentType: string;
};

export type IServiceTypeListing = {
    id: string;
    name: string;
    code: string;
};

export type IServiceTypeListingResponse = {
    serviceType: IServiceTypeListing[];
};

export type IServiceType = {
    id: string;
    name: string;
    code: string;
};

// calculateRate API types
export interface Address {
    Line1: string;
    Line2: string;
    Line3: string;
    City: string;
    StateOrProvinceCode?: string | null;
    PostCode?: string;
    CountryCode: string;
    Description: string;
    POBox?: string | null;
}

export interface shipmentDetailsMin {
    actualWeight: string;
    numberOfPieces: number;
    productGroup: string;
    productType: string;
    customsValueAmount: number;
    quantity: number;
    shipmentContent?: string;
    date?: string;
}

export interface shippingAmount {
    TotalAmount: number;
    TotalAmountBeforeTax: number;
    TaxAmount: number;
    type?: string;
}

interface Dimensions {
    Length: string;
    Width: string;
    Height: string;
    Unit: string;
}

interface Weight {
    Unit: string;
    Value: string;
}

interface Amount {
    CurrencyCode: string;
    Value: number;
}

interface Item {
    PackageType: string;
    Quantity: number;
    Weight: Weight;
    Comments: string;
    Reference: string;
    PiecesDimensions?: string | null;
    CommodityCode?: string | null;
    GoodsDescription?: string | null;
    CountryOfOrigin?: string | null;
    CustomsValue?: number | null;
    ContainerNumber?: number | null;
}

export interface ShipmentDetails {
    Dimensions?: null;
    ActualWeight: Weight;
    ChargeableWeight: Weight;
    DescriptionOfGoods: null;
    GoodsOriginCountry: string;
    NumberOfPieces: string;
    ProductGroup: string;
    ProductType: string;
    PaymentType: string;
    PaymentOptions: string;
    CustomsValueAmount: Amount;
    CashOnDeliveryAmount: Amount;
    InsuranceAmount: Amount;
    CashAdditionalAmount?: string | null;
    CashAdditionalAmountDescription?: string | null;
    CollectAmount: Amount;
    Services: string;
    Items: Item[];
    DeliveryInstructions?: string | null;
    AdditionalProperties?: string | null;
    ContainsDangerousGoods: boolean;
}

export interface calculateRatePayload {
    userType: string;
    userId: number;
    originAddress: Address;
    destinationAddress: Address;
    actualWeight: string;
    numberOfPieces: number;
    productGroup: string;
    productType: string;
    customsValueAmount: number;
    quantity: number;
}

export type ICalculateRateResponse = {
    TotalAmountBeforeTax: string;
    TaxAmount: number;
    TotalAmount: number;
    serviceType: string;
};

// logistics payment type

interface Contact {
    Department: string;
    PersonName: string;
    Title: string | null;
    CompanyName: string;
    PhoneNumber1: string;
    PhoneNumber1Ext: string | null;
    PhoneNumber2: string | null;
    PhoneNumber2Ext: string | null;
    FaxNumber: string | null;
    CellPhone: string;
    EmailAddress: string;
    Type: string | null;
}

interface ShipperConsignee {
    Reference1: string | null;
    Reference2: string | null;
    AccountNumber: string | null;
    PartyAddress: Address;
    Contact: Contact;
}

export interface PaymentLogisticsPayload {
    Pickup: {
        PickupAddress: Address;
        PickupContact: Contact;
        PickupLocation: string;
        PickupDate: string;
        ReadyTime: string;
        LastPickupTime: string;
        ClosingTime: string;
        Comments: string;
        Reference1: string;
        Reference2: string | null;
        Vehicle: string | null;
        Shipments: Array<{
            Reference1: string;
            Reference2: string | null;
            Reference3: string | null;
            Shipper: ShipperConsignee;
            Consignee: ShipperConsignee;
            ThirdParty: any;
            ShippingDateTime: string;
            DueDate: string;
            Comments: string | null;
            PickupLocation: string | null;
            OperationsInstructions: any;
            AccountingInstrcutions: any;
            Details: {
                Dimensions: Dimensions;
                ActualWeight: Weight;
                ChargeableWeight: Weight;
                DescriptionOfGoods: string | null;
                GoodsOriginCountry: string;
                NumberOfPieces: string;
                ProductGroup: string;
                ProductType: string;
                PaymentType: string;
                PaymentOptions: string;
                CustomsValueAmount: Amount;
                CashOnDeliveryAmount: Amount;
                InsuranceAmount: Amount;
                CashAdditionalAmount: any; // Define type as required
                CashAdditionalAmountDescription: any; // Define type as required
                CollectAmount: Amount;
                Services: string;
                Items: Item[];
                DeliveryInstructions: any; // Define type as required
                AdditionalProperties: any; // Define type as required
                ContainsDangerousGoods: boolean;
            };
            Attachments: any; // Define type as required
            ForeignHAWB: any; // Define type as required
            TransportType: number;
            PickupGUID: any; // Define type as required
            Number: any; // Define type as required
            ScheduledDelivery: any; // Define type as required
        }>;
        LabelInfo: {
            ReportID: string;
            ReportType: string;
        };
        PickupItems: Array<{
            ProductGroup: string;
            ProductType: string;
            NumberOfShipments: number;
            PackageType: string;
            Payment: string;
            ShipmentWeight: any; // Define type as required
            ShipmentVolume: any; // Define type as required
            NumberOfPieces: number;
            CashAmount: any; // Define type as required
            ExtraCharges: any; // Define type as required
            ShipmentDimensions: any; // Define type as required
            Comments: string;
        }>;
        Status: string;
        ExistingShipments: any; // Define type as required
        Branch: any; // Define type as required
        RouteCode: any; // Define type as required
        Dispatcher: number;
    };
    amount: number;
    accessKey: string;
}

export interface trackShipmentPayload {
    userType: string;
    userId: number;
    trackingNumber: string;
}

export type IHistoryListingResponse = {
    changeAccordingly: {
        CurrencyCode: string;
        Value: number;
    };
    RateDetails: {
        Amount: number;
        OtherAmount1: number;
        OtherAmount2: number;
        OtherAmount3: number;
        OtherAmount4: number;
        OtherAmount5: number;
        TotalAmountBeforeTax: number;
        TaxAmount: number;
    };
};

export type SurchargeResponse = {
    surcharge: string;
    serviceData: {
        cashback: string;
        cashbackType: string;
        commissionType: string;
        providerCommission: string;
    };
};

export type ShipmentDetailForm = {
    totalWeight: string;
    noOfPieces: number | string;
    serviceType: string;
    shipmentContent: string;
    pickupDate: string;
    customsValueAmount: number | string;
};
