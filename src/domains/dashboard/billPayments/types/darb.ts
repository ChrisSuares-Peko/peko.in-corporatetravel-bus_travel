export type darbPayload = {
    userType: string;
    userId: number;
    eid: string;
    trafficNo: string;
    flexiKey: string;
};

export type darbPaymentPayload = {
    account: string;
    flexiKey: string;
    typeKey: number;
    optional1: string;
    optional2: string;
    transactionId: string;
    amount: number;
    minAmt: number | string;
    maxAmt: number | string;
};
