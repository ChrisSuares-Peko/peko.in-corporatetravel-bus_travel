export type reportListingPayload = {
    userId: number;
    userType: string;
    from: string;
    to: string;
    categoryName: string;
    searchText: string;
    sort: string;
    page: number;
    itemsPerPage: number;
    filter: string;
    sortField: string;
};

export type downloadInvoicePayload = {
    userId: number;
    userType: string;
    transactionID: number;
};
type ServiceOperator = {
    id: number;
    serviceProvider: string;
};

type Order = {
    id: number;
    amountInAed: number;
    paymentMode: string;
    status: string;
    accountNo: string;
    subCorporateUser: {
        id: number;
        name: string;
    };
};

type ReportBody = {
    id: number;
    transactionDate: string;
    corporateTxnId: number;
    transactionCategory: string;
    serviceOperator: ServiceOperator;
    order: Order;
    corporateCashback: string;
};

export type ShedulerResponse = {
    name: string;
    email: string;
    dailyReport: {
        email: string[];
        isActive: boolean;
        scheduledTime: string;
        scheduledDay?: string;
    };
    weeklyReport: {
        email: string[];
        isActive: boolean;
        scheduledTime: string;
        scheduledDay: string;
    };
    monthlyReport: {
        email: string[];
        isActive: boolean;
        scheduledTime: string;
        scheduledDay?: string;
    };
};

export type reportListingResponse = {
    result: ReportBody[];
    totalData: number;
};

export type ReportRow = {
    date: string;
    transactionID: number;
    category: string;
    operator: string;
    amount: number;
    paymentMode: string;
    status: string;
    download: string;
    cashback: string;
};
export type useFilterCommon = {
    searchText: string;
    page: number;
    itemsPerPage: number;
    partnerId?: string | number;
    sort?: 'ASC' | 'DESC';
    sortField?: string;
    from?: string;
    to?: string;
    corporateId?: string | number;
    category?: string | number;
};
export type transactionType = {
    date: string;
    transactionID: number;
    category: string;
    operator: string;
    amount: any;
    paymentMode: string;
    status: string;
    download: string;
    cashback: string;
    accountNumber: string;
    subCorporateName: string;
};

export interface filterOption {
    value: string;
    label: string;
}

export interface categoryListingResponse {
    category: filterOption[];
}
export interface invoiceResponse {
    id: number;
    corporateTxnId: string;
    operatorId: string;
    providerId: null | number;
    transactionDate: string;
    accountNo: string;
    amountInAed: string;
    baseAmount: string;
    paymentMode: string;
    orderResponse: null;
    paymentModeResponse: null;
    surcharge: string;
    baseCurrency: string;
    exchangeRate: string;
    status: string;
    message: string;
    ecomOrderStatus: null;
    workspaceOrderStatus: string;
    shipmentStatus: null;
    createdAt: string;
    updatedAt: string;
    serviceOperatorId: number;
    credentialId: number;
    serviceOperator: {
        serviceProvider: string;
    };
}
export type ShedulerPayload = {
    userId: number;
    userType: string;
};

export type updateShedulerPayload = shedulerTypes & {
    userId: number;
    userType: string;
    route: string;
};
export type updateShedulerResponse = {
    data: {};
    success: boolean;
};

export type shedulerTypes = {
    email: string[] | undefined | false;
    isActive: boolean | undefined;
    scheduledTime: string | false | undefined;
    scheduledDay: string | false | undefined;
};

export type HandleUpdateBtnType = (
    title: string,
    emailIds: string[] | false | undefined,
    scheduledTime: string | false | undefined,
    scheduledDay: string | false | undefined,
    isActive: boolean | undefined
) => void;

export type AllShedulerTypes = {
    title: string;
    email: string[] | undefined | false;
    isActive: boolean | undefined;
    scheduledTime: string | false | undefined;
    scheduledDay: string | false | undefined;
    handleUpdateBtn: HandleUpdateBtnType;
};

export type filterState = {
    type?: string;
    title?: string;
    searchText: string;
    category: string;
    sort: string;
    page: number;
    itemsPerPage: number;
    filter: string;
    from: string;
    to: string;
    sortField: string;
};
export type getData = {
    page: number;
    searchText: string;
    itemsPerPage: number;
    sort: string;
    sortField?: string;
    from?: string;
    to?: string;
    id?: string | number;
    category?: any;
    type?: string;
};
export type downloadResponse = {
    pdfBuffer: {
        type: string;
        data: [];
    };
};

export type transactionResponse = {
    rows: transactionType[];
    count: number;
};
