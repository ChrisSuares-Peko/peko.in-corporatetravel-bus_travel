import { UserPayload } from '../../accounts/types/SelfTransferTypes';

export interface OrderDatatype {
    id: string;
    date: JSX.Element;
    productName: string;
    customer: string;
    amount: string;
    currentStatus: JSX.Element;
    status: JSX.Element;
    action: JSX.Element;
    view: JSX.Element;
}

export type getData = {
    page: number;
    searchText: string;
    itemsPerPage: number;
    sort: string;
    from?: string;
    to?: string;
    status?: string;
    category?: string | number;
    type?: string;
    sortField?: string;
};

export type TransactionInfo = {
    id: number;
    transactionDate: string;
    corporateTxnId: string;
    transactionCategory: string;
    corporateCashback: string;
    serviceOperator: {
        id: number;
        serviceProvider: string;
    };
    order: {
        id: number;
        amountInAed: string;
        paymentMode: string;
        status: string;
    };
    credential: {
        name: string;
        email: string;
    };
};
export type transactionResponse = {
    recordsTotal: number;
    data: TransactionInfo[];
};

export type payloadVendors = {
    productIds: string[];
};

export type VendorInfo = {
    id: number;
    name: string;
    price: string;
};

export type vendorListResponse = {
    id: number;
    name: string;
    vendors: VendorInfo[];
};

export type OrderUpdatePayload = {
    id: number;
    ecomOrderStatus: string;
    selectedVendor: Record<string, string>;
    // paymentStatus: string;
    trackingDetails?: {
        deliveryPartner: string;
        trackingNumber: string;
        trackingWebsite: string;
    };
    cancelReason?: string;
};

export interface UpdateOrderRequestPayload extends UserPayload {
    scope: string;
    otp: string;
    productId: number;
    corporateTxnId: string;
    paymentStatus: string;
    workspaceOrderStatus?: string;
    returnPickUpDate?: string;
    returnStatus?: string;
}
