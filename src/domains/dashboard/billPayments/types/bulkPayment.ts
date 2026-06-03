import React from 'react';

import { CommonPayload } from '.';

export type bulkBalancePayload = CommonPayload & {
    flexiKey: string;
    typeKey: number;
    accessKey: string;
    beneficiariesId: React.Key[];
};

export type BeneficiaryBulkBalance = {
    key: React.Key;
    status: boolean;
    data: {
        optional1: string;
        accountNo: string;
        name: string;
        id: number;
        status: string;
        ResponseCode: string;
        ResponseMessage: string;
        TransactionId: string;
        surchargeInAED: string;
        dueBalanceInAed: string;
        ServiceType: string;
        TransactionType: string;
        ProviderTransactionId: string;
        TransactionDateStamp: string;
        ReplyDateStamp: string;
        CurrentBalance: string;
    };
    message: string;
};

export type bulkBalanceResponse = {
    beneficiariesBalances: BeneficiaryBulkBalance[];
};

export type bulkBalanceTableData = {
    beneficiaryName: string;
    accountNo: string;
    serviceType: string;
    billAmount: string;
    status: boolean;
};
