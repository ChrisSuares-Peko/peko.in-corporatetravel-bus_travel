export type GiftCardsBody = {
    id: number;
    serviceOperatorId: string;
    product_id: string;
    brand_code: string;
    name: string;
    minDenomination: string;
    maxDenomination: string;
    priceType: string;
    denominations: number[];
    image:
        | string
        | {
              imageBase: string;
              imageFormat: string;
          };
    activation_fee: null | any;
    currency: string;
    description: string;
    redemption_instructions: string;
    status: boolean;
    serviceOperator: {
        serviceProvider: string;
        id: number;
    };
    format?: string;
};

export type GiftCardsWithoutID = {
    id?: number;
    serviceOperatorId: string;
    product_id: string;
    brand_code: string;
    name: string;
    minDenomination: string;
    maxDenomination: string;
    priceType: string;
    denominations: number[];
    image:
        | string
        | {
              imageBase: string;
              imageFormat: string;
          };
    activation_fee: null | any;
    currency: string;
    description: string;
    redemption_instructions: string;
    status: boolean;
};

export type ApiResponseGiftCards = {
    draw: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: GiftCardsBody[];
};

export type getGiftCards = {
    page: number;
    searchText: string;
    itemsPerPage: number;
    sort: 'ASC' | 'DESC';
    sortField?: string;
};

export type updateGiftCardsStatusPayload = {
    status: boolean;
    giftCardId: string | number;
};

export type GiftCardsID = Omit<updateGiftCardsStatusPayload, 'status'>;

export type IVendor = {
    id: number;
    accessKey: string;
    serviceProvider: string;
};

export type IVendorsListingResponse = {
    data: IVendor[];
};

export type autoUpdatePayload = {
    status: boolean;
    serviceOperatorId: string | number;
    otp: string;
    scope: string;
};

export type IAutoUpdateStatusResponse = {
    data: string[];
};

export type IAutoUpdateResponse = {
    giftCards: GiftCardsBody[];
};
