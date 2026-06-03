import { DropDown } from '@customtypes/general';

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
    totalData: number;
    result: TransactionInfo[];
};
export type categoryResponse = {
    category: DropDown;
};
