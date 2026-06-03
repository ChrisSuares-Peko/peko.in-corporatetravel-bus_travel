export interface OrderHistoryTablePayload {
    userType: string;
    userId: string | number;
    search: string;
    start: number;
    length: number;
}

export interface OrderHistoryItem {
    order: {
        id: number;
        amountInAed: string;
        paymentMode: string;
        status: string;
        orderResponse: string;
        transactionDate: string;
        corporateTxnId: string;
    };
}

export interface SelectedHike {
    id: number;
    hikeName: string;
    price: number;
    totalPrice: number;
    quantity: number;
    employees?: Array<{
        name: string;
        employeeId: string;
    }>;
}

export interface ParsedOrderResponse {
    selectedHikes: SelectedHike[];
}

export interface OrderHistoryListResponse {
    result: OrderHistoryItem[];
    totalData: number;
}
