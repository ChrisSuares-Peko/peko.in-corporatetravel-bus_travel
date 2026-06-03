export type PaymentGeneric = {
    accessKey?: string;
    successUrl?: string;
    failureUrl?: string;
    currentUrl?: string;
    amount?: number | string;
    total?: number;
    bulkPaymentData?: any[];
    [key: string]: number | string | Object | undefined | null;
};

export type CardPaymentResponse = {
    redirectLink: string;
};

export type WalletBalanceResponse = {
    balance: string | number;
    credentialId: number;
    name: string;
    role: string;
};

export type OrderResponse = {
    customer_id: string;
    end_user_id: string;
};

export type PaymentIntentRequestPayload = {
    amount: number;
    currency: string;
    customer_id: string;
};

export type PaymentIntentResponse = {
    payment_intent_id: string;
};

export type QueuedPaymentRequestPayload = {
    customerId: string;
};

export type QueuedPaymentResponse = {
    queued_Payments: string[];
};
export interface BulkPaymentDataItem {
    account: string;
    transactionId: string;
    providerTransactionId: string;
    amount: number;
    lastBalance: string;
    type: string;
    flexiKey: string;
    typeKey: number;
    corporateTxnId: number;
    batchId: number;
    accessKey: string;
    isLastItem: boolean;
    paymentStatus: string;
}
export type PaymentResponse = {
    corporateFinalBalance: string;
    corporateCashback: string;
    orderId: number;
    datetime: string;
    amount: number;
    corporateTxnId: number;
    bulkPaymentData: BulkPaymentDataItem[];
};

export enum LeanPaymentStatus {
    success = 'SUCCESS',
    cancelled = 'CANCELLED',
}

export enum PaymentMode {
    bank = 'BANK',
    card = 'CARD',
    wallet = 'PEKO-WALLET',
    empty = '',
}

export type TransactionDetailsPayload = {
    transactionId: string;
};
export type TransactionDetailsResponse = {
    id: number;
    corporateTxnId: string;
    operatorId: string;
    providerId: string;
    transactionDate: string;
    accountNo: string;
    amountInAed: string;
    baseAmount: string;
    paymentMode: string;
    orderResponse: string;
    paymentModeResponse: string;
    surcharge: string;
    baseCurrency: string;
    exchangeRate: string;
    status: string;
    message: string;
    ecomOrderStatus: string;
    workspaceOrderStatus: string;
    shipmentStatus: any[];
    createdAt: string;
    updatedAt: string;
    serviceOperatorId: number;
    credentialId: number;
    serviceOperator: {
        serviceProvider: string;
        accessKey: string;
    };
};

export interface PaymentResultTableProps {
    paymentData: {
        transactionDate?: string;
        corporateTxnId?: string;
        serviceProvider?: string;
        amount?: string;
        paymentMode?: string;
    };
}

export type earningCashbackPayload = {
    billAmount: number;
    accessKey: string;
};

export type vendorBalanceResponse = {
    merchantName: string;
    merchantBalance: string;
};

export type BulkPaymentResp = {
    account: string;
    amount: number;
    surcharge: number;
    corporateTxnId: number;
    paymentStatus: string;
    batchId: number;
    serviceName?: string;
};

export type BulkPaymentStatusResp = {
    bulkPaymentStatus: {
        status: string;
        corporateTxnId: number;
    }[];
};
