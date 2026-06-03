export type GetGiftcardListPayload = {
    userId: number;
    userType: string;
    accessKeys: ['quickcilver', 'youGotAGift'];
    searchText: string;
    page: number;
    limit: number;
    category: string;
    offset: number;
};

export type DetailPayload = {
    userId: number;
    userType: string;
};

export type giftCardDetailPayload = DetailPayload & {
    cardID: string;
};

export interface ServiceOperator {
    accessKey: string;
}

export interface Giftcard {
    id: number;
    product_id: string;
    brand_code: string;
    name: string;
    image: string;
    minDenomination: string;
    maxDenomination: string;
    priceType: string;
    denominations: number[]; // Assuming denominations are always numbers
    activation_fee: string | null; // Activation fee can be null
    currency: string;
    description: string;
    redemption_instructions: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    serviceOperatorId: number;
    serviceOperator: ServiceOperator;
}

export interface GiftcardListResponse {
    count: number;
    rows: Giftcard[];
}

export interface ApiResponse {
    status: boolean;
    data: GiftcardListResponse;
    message: string;
    responseCode: string;
}

export type GiftcardsTableData = {
    image: string;
    name: string;
    description: string;
    id: number;
}[];

export type GiftCardDetailResponse = {
    mainGiftCard: Giftcard;
    relatedGiftCards: Giftcard[];
};

export interface walletPayload {
    userId?: number;
    userType?: string;
}

export type SurchargeResponse = {
    surcharge: string;
    corporateCashback: string;
};

export interface summaryTexts {
    key: string;
    value: string | number;
    isInput?: boolean;
}

export interface PaymentPayload {
    cardId: string;
    receiverFirstName: string;
    receiverLastName: string;
    receiverEmail: string;
    receiverMobile: string;
    gender: string;
    amount: number;
    quantity: number;
    totalAmount: number;
    senderName: string;
    postcode: string;
    message: string;
    userType?: string;
    credentialId?: number;
}

interface OrderResponse {
    body: {
        giftCardId: string;
        first_name: string;
        last_name: string;
        email: string;
        telephone: string;
        gender: string;
        amount: number;
        number_of_items: number;
        load_amount: number;
        senderName: string;
        message: string;
        images: {
            card: string;
            background: string;
            onError: string;
            selectedCard_Name: string;
        };
    };
    selectedCard: {
        id: number;
        product_id: string;
        brand_code: string;
        name: string;
        image: string;
        minDenomination: string;
        maxDenomination: string;
        priceType: string;
        denominations: any[];
        activation_fee: string;
        currency: string;
        description: string;
        redemption_instructions: string;
        status: boolean;
        createdAt: string;
        updatedAt: string;
        serviceOperatorId: number;
        serviceOperator: {
            accessKey: string;
        };
    };
    paymentResponse: {
        reference_id: string;
        order_id: number;
        state: number;
        notify: number;
        ordered_amount: {
            currency: string;
            amount: number;
        };
        extra_fields: string;
        brand_accepted_amount: {
            currency: string;
            amount: number;
        };
        exchange_rate: {
            base_currency: string;
            target_currency: string;
            conversion_rate: number;
        };
        barcode: string;
        gift_voucher: {
            label: string;
            value: string;
        }[];
        expiry_date: string;
        redemption_instructions: string;
        brand_details: {
            logo: string;
            product_image: string;
            code: string;
            pin_redeemable: boolean;
            name: string;
        };
        receiver_name: string;
        receiver_email: string;
        receiver_phone: string;
        country: string;
        message: string;
        date_added: string;
        egift_card: {
            url: string;
            gift_verification_pin: string;
        };
    };
}

interface OrderResponseData {
    orderResponse: string; // This will contain the nested JSON string
}

export type OrderHistoryTableData = {
    txnId: string;
    date: string;

    paymentMode: string;
    status: string;
    giftCardName: string;
    amount: string;
};
export type filterState = {
    search: string;
    draw: number;
    start: number;
    length: number;
};

interface Order {
    id: number;
    amountInAed: string;
    paymentMode: string;
    status: string;
    orderResponse: string;
    ecomOrderStatus: string;
    transactionDate: string;
    corporateTxnId: string;
}

export interface OrderHistoryDatatype {
    order: Order;
}

export type OrderHistoryTablePayload = {
    userId: number;
    userType: string;
    draw: number;
    start: number;
    length: number;
    search: string;
};

interface Order {
    id: number;
    amountInAed: string;
    paymentMode: string;
    status: string;
    orderResponse: string;
    ecomOrderStatus: string;
    transactionDate: string;
    corporateTxnId: string;
}

export type OrderHistoryListResponse = {
    result: OrderHistoryDatatype[];
    totalData: number;
};

export type UserDetailsPayload = {
    userId: number;
    userType: string;
};

export type userDetailsResponse = {
    addressId: number;
    addressLine1: string;
    addressLine2: string;
    userName: string;
    userEmail: string;
    userCountry: string;
};
