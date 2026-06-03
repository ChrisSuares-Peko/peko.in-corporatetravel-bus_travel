export type hafilatPayload = {
    userType: string;
    userId: number;
    trafficNo: string;
    flexiKey: string;
};

export type hafilatPaymentPayload = {
    account: string;
    transactionId: string;
    amount: number;
    flexiKey: string;
    typeKey: number;
    optionals: {
        ProductCode: string;
        isTPurse: string;
        customerMobileNo: string;
        itemCode?: string | null;
    };
};

export type HaflatBalanceResponse = {
    TransactionId: string;
    isHafilatCardValid: boolean;
    ExpiryDate: string;
    CardStatus: string;
    RequestStatus: string;
    ProductDetails: {
        ProductCode: string;
        ProductTitle: string;
        TransactionType: string;
        ProductCategory: string;
        TitleNetwork: string;
        ValidityStartDate: string;
        ValidityEndDate: string;
        BalanceAmount: number;
        AmountInProcess: number;
        MaximumAllowed: number;
        ItemInfo:
            | {
                  ProductCode: string;
                  ItemCode: string;
                  ItemTitle: string;
                  Price: number;
              }[]
            | null;
    }[];
    dueBalanceInAed: string;
};
