export type CommonPayload = {
    userId: number;
    userType: string;
};

export type GetLimitResponse = {
    minDenomination: number;
    maxDenomination: number;
    flexiKey: string;
    typeKey: number;
    accessKey: string;
    serviceProvider: string;
    surcharge: string;
};

export type GetBalancePayload = {
    voucherId: string;
};

export type FetchBillApiPayload = CommonPayload & {
    voucherId: string;
    flexiKey: string;
    typeKey: number;
};

export type FetchBillApiResponse = {
    TransactionId: string;
    AccountNumber: string;
    Amount: string;
    VoucherNumber: string;
    VocuherDate: string;
    VoucherExpiryDate: string;
    dueBalanceInAed: string;
};

export type PaymentRequestPayload = CommonPayload & {
    account: string;
    transactionId: string;
    amount: string;
    payCashback: boolean;
    flexiKey: string;
    typeKey: number;
    emiratesId: string;
    customerName: string;
};

export type PaymentResponse = {
    status: string;
    datetime: string;
    ResponseCode: string;
    paidAmountInAed: number;
    paidAmount: string;
    supplierId: string;
    operatorId: string;
    orderId: number;
    corporateFinalBalance: string;
    corporateCashback: string;
    amount: string;
};

export type WalletBalanceResponse = {
    balance: string;
    credentialId: number;
};

export type FormValuesType = {
    emiratesId: string;
    customerName: string;
};
