import { SortDirection } from '@customtypes/general';

import { RequestPayload } from '.';

export interface useOrderHistoryApiProps {
    sort: SortDirection;
    page: number;
    itemsPerPage: number;
    search?: string | null;
    from?: string;
    to?: string;
}
export interface TransactionsRequestPayload extends RequestPayload, useOrderHistoryApiProps {}

export interface Order {
    order: {
        id: number;
        amountInAed: string;
        status: string;
        orderResponse: string;
        transactionDate: string;
        corporateTxnId: string;
        shipmentStatus: any[]; // You can define a proper type for this if needed
        providerId: string;
    };
}

export interface TransactionsResponse {
    totalData: number;
    result: Order[];
}

export interface TransactionDetailsRequestPayload extends RequestPayload {
    orderId: string;
}
export interface TransactionDetailsResponse {
    id: number;
    corporateTxnId: string;
    operatorId: string;
    providerId: string | null;
    transactionDate: string;
    accountNo: string;
    amountInAed: string;
    baseAmount: string;
    paymentMode: string;
    orderResponse: any;
    paymentModeResponse: any;
    surcharge: string;
    baseCurrency: string;
    exchangeRate: string;
    status: string;
    message: string;
    ecomOrderStatus: string;
    workspaceOrderStatus: string;
    shipmentStatus: string | null;
    createdAt: string;
    updatedAt: string;
    serviceOperatorId: number;
    credentialId: number;
}

export interface OrderedProduct {
    productId: number;
    productQuantity: number;
    productName: string;
    totalPrice: number;
    totalVat: number;
    image: string;
    status?: string;
    returnPickUpDate?: string;
    returnInitiatedDate?: string;
    reason?: string;
}

export interface OrderDetailsSlice {
    orderedProducts: OrderedProduct[];
    orderDetails: TransactionDetailsResponse | null;
    trackingDetails: {
        trackingWebsite: string;
        trackingNumber: string;
        deliveryPartner: string;
    } | null;
    refresh: boolean;
}

export interface CancelOrderRequestResponse {
    data: number[];
}

export interface CancelOrderRequestPayload extends RequestPayload {
    orderId: number;
    description: string;
    reason: string;
}

export interface ProductReturnRequestPayload extends CancelOrderRequestPayload {
    productId: number;
}
export interface ProductReturnRequestResponse {
    data: number[];
}

export interface DownloadInvoiceRequestResponse {
    data: any;
}

export interface DownloadInvoiceRequestPayload extends RequestPayload {
    orderId: number;
}

export interface OrderTableItem {
    id: number;
    date: string;
    shipmentType: string;
    pickupReference: string;
    AWBNumber: string;
    transactionId: string;
    amount: string;
    status: string;
    providerId: string;
}
